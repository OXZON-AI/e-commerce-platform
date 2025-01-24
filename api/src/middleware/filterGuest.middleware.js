import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";

export const filterGuest = (req, res, next) => {
  const { id, role } = req.user;

  if (role === "guest") {
    const error = customError(403, "Action is forbidden");
    logger.error(`Guest ${id} was denied: `, error);
    return next(error);
  }

  next();
};
