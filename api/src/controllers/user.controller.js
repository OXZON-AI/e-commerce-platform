import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { logger } from "../utils/logger.util.js";
import {
  validateDeleteUser,
  validateGetUsers,
  validateUpdateUser,
} from "../utils/validator.util.js";
import mongoose from "mongoose";
import { customError } from "../utils/error.util.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";

export const updateUser = async (req, res, next) => {
  const { error, value } = validateUpdateUser(req.body);

  if (error) return next(error);

  const { email, password, name, phone } = value;

  const updateFields = { email, name, phone };

  if (password) {
    const encryptPass = await bcrypt.hash(password, 10);
    updateFields.password = encryptPass;
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateFields,
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

export const getUsers = async (req, res, next) => {
  const { error, value } = validateGetUsers(req.query);

  if (error) return next(error);

  const { user, userType, sortBy, sortOrder, page, limit } = value;
  const skip = (page - 1) * limit;
  const sortByField = sortBy === "points" ? "loyaltyPoints" : "createdAt";

  const pipeline = [];

  if (user || userType)
    pipeline.push({
      $match: {
        ...(user && { _id: new mongoose.Types.ObjectId(`${user}`) }),
        ...(userType && { role: userType }),
      },
    });

  pipeline.push(
    {
      $lookup: {
        from: "carts",
        localField: "_id",
        foreignField: "user",
        as: "cart",
      },
    },
    {
      $unwind: {
        path: "$cart",
      },
    },
    {
      $project: {
        __v: 0,
        password: 0,
        cart: {
          user: 0,
          total: 0,
          createdAt: 0,
          updatedAt: 0,
          items: 0,
          __v: 0,
        },
      },
    }
  );

  pipeline.push({
    $sort: {
      [sortByField]: sortOrder === "asc" ? 1 : -1,
    },
  });

  pipeline.push({
    $skip: skip,
  });

  pipeline.push({
    $limit: limit,
  });

  try {
    const users = await User.aggregate(pipeline);

    logger.info(`Users fetched successfully.`);
    return res.status(200).json(users);
  } catch (error) {
    logger.error(`Couldn't fetch users: `, error);
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id, role } = req.user;
  const { error, value } = validateDeleteUser(req.params);

  if (error) return next(error);

  const { id: user } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const adminDeleting = role === "admin" && id !== user;
    const selfDeleting = id === user;

    if (!adminDeleting && !selfDeleting) {
      const error = customError(403, "Action is forbidden");
      logger.error(`User ${id} tried to delete user ${user}: `, error);
      return next(error);
    }

    const result = await User.findByIdAndDelete(user).session(session);

    if (!result) {
      const error = customError(404, "User not found");
      logger.error(`User ${user} not found for deletion: `, error);
      return next(error);
    }

    await Cart.findOneAndDelete({ user }).session(session);
    await Order.updateMany(
      { user },
      { $set: { isGuest: true }, $unset: { user: "" } }
    ).session(session);
    await Review.deleteMany({ user }).session(session);

    await session.commitTransaction();

    logger.info(`User ${user} deleted by ${id}.`);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Couldn't delete user ${user}: `, error);
    return next(error);
  } finally {
    await session.endSession();
  }
};
