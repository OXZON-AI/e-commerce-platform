import { User } from "../models/user.model.js";
import { logger } from "../utils/logger.util.js";
import { validateUpdateUser } from "../utils/validator.util.js";

export const updateUser = async (req, res, next) => {
  const { error, value } = validateUpdateUser(req.body);

  if (error) return next(error);

  const { email, password, name, phone } = value;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { email, password, name, phone },
      },
      { new: true }
    );

    const { password: pass, role, ...rest } = user._doc;

    logger.info(`User with id ${req.params.id} updated successfully.`);
    return res
      .status(200)
      .json({ message: "User updated successfully", user: rest });
  } catch (error) {
    logger.error(`Couldn't update user: `, error);
    return next(error);
  }
};
