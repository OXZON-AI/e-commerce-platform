import bcrypt from "bcryptjs";
import { validateSignin, validateSignup } from "../utils/validator.util.js";
import { createUser, getUser } from "../services/user.services.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import jwt from "jsonwebtoken";
import { createCart } from "../services/cart.service.js";

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

  try {
    const user = await createUser(email, encryptPass, name, phone);
    await createCart(user._id);

    logger.info(`User with email ${email} registered successfully.`);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Couldn't register user: ", error);
    return next(error);
  }
};

export const signin = async (req, res, next) => {
  const { error, value } = validateSignin(req.body);

  if (error) return next(error);

  const { email, password } = value;

  try {
    const user = await getUser(email);

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const { password: pass, role, ...rest } = user._doc;

    logger.info(`User with email ${email} signed in successfully.`);
    return res
      .cookie("token", token, { httpOnly: true })
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
