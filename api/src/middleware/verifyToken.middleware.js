import { customError } from "../utils/error.util.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.util.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    const error = customError(401, "Token is required");
    logger.error("Unauthorized access, token is missing: ", error);
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      logger.error("Unauthorized access, invalid token: ", error);
      return next(customError(401, "Unauthorized access"));
    }

    req.user = user;
    next();
  });
};
