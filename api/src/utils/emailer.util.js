import nodemailer from "nodemailer";
import { logger } from "./logger.util.js";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const __dirname = import.meta.dirname;

const hbsOptions = {
  viewEngine: {
    defaultLayout: false,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  },
  viewPath: path.join(__dirname, "../views"),
};

export const sendEmails = async (receivers, subject, context, template) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  transporter.use("compile", hbs(hbsOptions));

  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: receivers,
    subject: subject,
    template,
    context,
  };

  const info = await transporter.sendMail(mailOptions);
  return logger.info(`Email sent to ${receivers}: `, info);
};
