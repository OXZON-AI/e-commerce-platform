import { Subscriber } from "../models/subscriber.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import { validateSubscribe } from "../utils/validator.util.js";
import crypto from "crypto";

export const subscribe = async (req, res, next) => {
  const { error, value } = validateSubscribe(req.body);

  if (error) return next(error);

  const { email } = value;
  try {
    const token = crypto.randomBytes(32).toString();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const subscriber = new Subscriber({ email, token: hashedToken });

    await subscriber.save();

    logger.info(`Subscribe to news letter for email ${email} is successfull.`);
    res.status(201).json({ message: "Subscribed to new letter successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const error = customError(400, "You have already subscribed");
      logger.error(
        `Email ${email} already subscribed to the news letter: `,
        error
      );
      return next(error);
    }

    logger.error(
      `Couldn't subscribe to news letter for email ${email}: `,
      error
    );
    next(error);
  }
};
