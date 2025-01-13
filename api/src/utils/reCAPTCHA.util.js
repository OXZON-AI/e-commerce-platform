import { logger } from "./logger.util.js";

export const validateCaptcha = async (token) => {
  try {
    const res = await fetch(`${process.env.RECAPTCHA_URL}&response=${token}`, {
      method: "POST",
    });

    const data = await res.json();

    return data.success;
  } catch (error) {
    logger.error("Couldn't validate captcha: ", error);
  }
};
