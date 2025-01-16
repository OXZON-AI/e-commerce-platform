import { customError } from "../utils/error.util.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.util.js";

export const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = { role: "customer" };

    logger.info(
      "No token provided, passing as a guest user to the next middleware."
    );
    return next();
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
