import { Cart } from "../models/cart.model.js";
import { logger } from "../utils/logger.util.js";

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

  if (!cart) {
    cart = await createCart(options, session);
    logger.info(`Cart created for user ${id}.`);
  }

  return cart;
};

export const clearCart = async (id, role) => {
  try {
    let cart = await findOrCreateCart(id, role);

    cart.items = [];
    cart.total = 0;

    await cart.save();

    logger.info(`Cart with id ${cart._id} cleared for user ${id}.`);
  } catch (error) {
    logger.error(`Error clearing the cart for id ${id}: `, error);
  }
};
