import { News } from "../models/news.model.js";
import { Subscriber } from "../models/subscriber.model.js";
import { sendEmails } from "../utils/emailer.util.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateGetNews,
  validatePublish,
  validateSubscribe,
  validateUnsubscribe,
} from "../utils/validator.util.js";
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

export const publish = async (req, res, next) => {
  const { error, value } = validatePublish(req.body);

  if (error) return next(error);

  const { title, body, image } = value;
  try {
    const news = new News({
      title,
      body,
      image,
    });

    const subscribers = await Subscriber.find().select("email token");

    await Promise.all(
      subscribers.map((subscriber) =>
        sendEmails(
          subscriber.email,
          title,
          {
            title,
            body,
            image,
            link: `${process.env.UNSUBSCRIBE_URL}${subscriber.token}`,
          },
          "news-letter"
        )
      )
    );

    await news.save();

    logger.info(`News letter with id ${news._id} published successfully.`);
    res.status(201).json({ message: "New letter published successfully" });
  } catch (error) {
    logger.error("Couldn't publish news letter: ", error);
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  const { error, value } = validateUnsubscribe(req.body);

  if (error) return next(error);

  const { token } = value;
  try {
    const subscriber = await Subscriber.findOneAndDelete({
      token,
    });

    if (!subscriber) {
      const error = customError(400, "Invalid token");
      logger.error(
        `Attempt to unsubscribe from news letter with invalid token: `,
        error
      );
      return next(error);
    }

    logger.info(
      `Email ${subscriber.email} unsubscribed from news letter successfully.`
    );
    res
      .status(200)
      .json({ message: "Unsubscribed from news letter successfully" });
  } catch (error) {
    logger.error("Couldn't unsubscribe from news letter: ", error);
    next(error);
  }
};

export const getNews = async (req, res, next) => {
  const { error, value } = validateGetNews(req.query);

  if (error) return next(error);

  const { page, limit, sortBy, sortOrder } = value;
  const skip = (page - 1) * limit;
  const sortByField = sortBy === "date" ? "createdAt" : null;

  const pipeline = [
    {
      $sort: {
        [sortByField]: sortOrder === "asc" ? 1 : -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  try {
    const news = await News.aggregate(pipeline);

    logger.error("Fetched news letters successfully.");
    res.status(200).json(news);
  } catch (error) {
    logger.error("Couldn't fetch news letters: ", error);
    next(error);
  }
};
