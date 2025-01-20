import { customError } from "../utils/error.util.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.util.js";
import { v4 as uuidv4 } from "uuid";

export const optionalAuth = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    const id = uuidv4();

    token = jwt.sign({ id, role: "guest" }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    req.user = { id, role: "guest" };
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    logger.info(
      `No token provided, created a guest token for ${id} and passing to the next middleware.`
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
