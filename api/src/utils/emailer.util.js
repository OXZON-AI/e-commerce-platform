import nodemailer from "nodemailer";
import { logger } from "./logger.util.js";

export const sendEmails = async (receivers, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: receivers,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      return logger.error(`Error sending email to ${receivers}: `, error);
    return logger.info(`Email sent to ${receivers}: `, info.response);
  });
};
