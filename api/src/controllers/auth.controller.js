import bcrypt from "bcryptjs";
import {
  validateSignin,
  validateSignup,
  validatePasswordReset,
  validateRequestReset,
} from "../utils/validator.util.js";
import { createUser, getUser } from "../services/user.services.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import jwt from "jsonwebtoken";
import { cartMigration, createCart } from "../services/cart.service.js";
import crypto from "crypto";
import { sendEmails } from "../utils/emailer.util.js";
import { validateCaptcha } from "../utils/reCAPTCHA.util.js";
import mongoose from "mongoose";

export const signup = async (req, res, next) => {
  const { error, value } = validateSignup(req.body);

  if (error) return next(error);

  const { email, password, name, phone, token } = value;

  const human = await validateCaptcha(token);

  if (!human) {
    const error = customError(400, "Failed captcha verification");
    logger.error("Failed captcha verification: ", error);
    return next(error);
  }

  const encryptPass = await bcrypt.hash(password, 10);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await createUser(email, encryptPass, name, phone, session);
    await createCart({ user: user._id }, session);

    await session.commitTransaction();

    logger.info(`User with email ${email} registered successfully.`);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      const error = customError(400, "Email already exists");
      logger.error(`Email ${email} already exists: `, error);
      return next(error);
    }

    logger.error("Couldn't register user: ", error);
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const signin = async (req, res, next) => {
  const { error, value } = validateSignin(req.body);

  if (error) return next(error);

  const { email, password, rememberMe } = value;

  try {
    const user = await getUser({ email });

    if (!user) {
      const error = customError(401, "Wrong credentials");
      logger.error(`User with email ${email} not found: `, error);
      return next(error);
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      const error = customError(401, "Wrong credentials");
      logger.error(
        `User with email: ${email} attempt signin with wrong password: `,
        error
      );
      return next(error);
    }

    let token = req.cookies.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (error, decodedUser) => {
        if (error) {
          logger.error("Unauthorized access, invalid token: ", error);
          return next(customError(401, "Unauthorized access"));
        }

        if (decodedUser.role === "guest")
          await cartMigration(decodedUser.id, user._id);
      });
    }

    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const { password: pass, role, ...rest } = user._doc;

    logger.info(`User with email ${email} signed in successfully.`);
    return res
      .cookie("token", token, {
        httpOnly: true,
        ...(rememberMe && { maxAge: 24 * 60 * 60 * 1000 }),
      })
      .status(200)
      .json({ user: rest });
  } catch (error) {
    logger.error(`Signin error for email ${email}: `, error);
    return next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User signed out." });
  } catch (error) {
    logger.error("Couldn't sign out user: ", error);
    return next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  const { error, value } = validateRequestReset(req.body);

  if (error) return next(error);

  const { email } = value;

  try {
    const user = await getUser({ email });

    if (!user) {
      const error = customError(404, "User not found");
      logger.error(`User with email ${email} not found: `, error);
      return next(error);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 300000;

    await user.save();

    await sendEmails(
      email,
      "Reset your password",
      {
        link: `${process.env.RESET_PASSWORD_URL}?token=${token}`,
      },
      "reset-password"
    );

    logger.info(`Password reset link sent for ${email}`);
    return res
      .status(200)
      .json({ message: "Password reset link was sent to your email" });
  } catch (error) {
    const err = customError(
      500,
      `Couldn't request password reset for ${email}`
    );
    logger.error(`${err.message}:  `, error);
    return next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { error, value } = validatePasswordReset(req.body);

  if (error) return next(error);

  const { password, token } = value;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await getUser({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = customError(401, "Invalid or expired token");
      logger.error(`Token error: `, error);
      return next(error);
    }

    const encryptPass = await bcrypt.hash(password, 10);

    user.password = encryptPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    logger.info(`Password reset for user with token ${token}`);
    return res.status(200).json({ message: "Password was reset successfully" });
  } catch (error) {
    logger.error(
      `Couldn't reset password for user with token ${token}: `,
      error
    );
    return next(error);
  }
};
