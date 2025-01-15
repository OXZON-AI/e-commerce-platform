import winston from "winston";

const { combine, timestamp, json, prettyPrint, errors } = winston.format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json(), prettyPrint(), errors({ stack: true })),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "./logs/info.log",
      level: "info",
    }),
  ],
});
