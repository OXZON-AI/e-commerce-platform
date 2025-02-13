import { sendEmails } from "../utils/emailer.util.js";
import { logger } from "../utils/logger.util.js";
import { validateContact } from "../utils/validator.util.js";

export const handleContact = async (req, res, next) => {
  const { error, value } = validateContact(req.body);

  if (error) return next(error);

  const { email, name, phone, subject, inquiry } = value;
  try {
    await Promise.all([
      sendEmails(email, "We've Received Your Message", {}, "auto-response"),
      sendEmails(
        process.env.MAILER_EMAIL,
        "New Inquiry",
        { name, phone, subject, email, inquiry },
        "admin-notification"
      ),
    ]);

    logger.info(
      `Messages sent to customer ${email} and admin ${process.env.MAILER_EMAIL}.`
    );
    return res.status(200).json({ message: "Your message has been received" });
  } catch (error) {
    logger.error(`Error processing contact form for user ${email}: `, error);
    return next(error);
  }
};
