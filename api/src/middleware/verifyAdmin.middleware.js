import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    const error = customError(403, "Action is forbidden");
    logger.error(
      `Unauthorized access, user with id ${req.user.id} is not an admin: `,
      error
    );
    return next(error);
  }

  next();
};
