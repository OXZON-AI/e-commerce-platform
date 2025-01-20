import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { logger } from "../utils/logger.util.js";
import { Variant } from "../models/variant.model.js";

export const createCart = async (options, session = null) => {
  const cart = new Cart(options);

  return await cart.save(session ? { session } : undefined);
};

export const findOrCreateCart = async (id, role, session = null) => {
  const options = role === "guest" ? { guestId: id } : { user: id };

  let query = Cart.findOne(options).select("total items").populate({
    path: "items.variant",
    select: "-isDefault -createdAt -updatedAt -__v",
  });

  if (session) query = query.session(session);

  let cart = await query;

  if (cart) {
    await Variant.populate(cart, {
      path: "items.variant.product",
      select: "name",
    });
  } else {
    cart = await createCart(options, session);
    logger.info(`Cart created for user ${id}.`);
  }

  return cart;
};

export const clearCart = async (id, role, session = null) => {
  try {
    let cart = await findOrCreateCart(id, role, session);

    cart.items = [];
    cart.total = 0;

    await cart.save(session ? session : undefined);

    logger.info(`Cart with id ${cart._id} cleared for user ${id}.`);
  } catch (error) {
    logger.error(`Error clearing the cart for id ${id}: `, error);
  }
};

export const cartMigration = async (guestId, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const guestCart = await Cart.findOne({ guestId }).session(session);

    if (!guestCart)
      return logger.error(`Guest cart with id ${guestId} not found.`);

    const userCart = await Cart.findOne({ user }).session(session);

    if (!userCart) {
      logger.info(`User cart not found for user ${user}.`);
      guestCart.user = user;
      guestCart.guestId = undefined;

      await guestCart.save({ session });
    } else {
      userCart.total += guestCart.total;

      guestCart.items.forEach((guestItem) => {
        const userItem = userCart.items.find(
          (item) => item.variant.toString() == guestItem.variant.toString()
        );

        if (userItem) {
          userItem.quantity += guestItem.quantity;
          userItem.subTotal += guestItem.subTotal;
        } else {
          userCart.items.push(guestItem);
        }
      });

      await userCart.save({ session });
      await Cart.deleteOne({ guestId }).session(session);
    }
    await session.commitTransaction();

    logger.info(`Cart migrated successfully for user ${user}.`);
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Error migrating cart for guest ${guestId}: `, error);
  } finally {
    await session.endSession();
  }
};
