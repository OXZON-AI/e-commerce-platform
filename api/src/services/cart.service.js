import { Cart } from "../models/cart.model.js";

export const createCart = async (userId) => {
  const cart = new Cart({
    user: userId,
  });

  return await cart.save();
};
