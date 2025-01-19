import { clearCart, findOrCreateCart } from "../services/cart.service.js";
import Stripe from "stripe";
import { User } from "../models/user.model.js";
import {
  convertToPoints,
  getDiscountCode,
} from "../services/checkout.service.js";
import { logger } from "../utils/logger.util.js";
import { validateCompleteCheckout } from "../utils/validator.util.js";
import { Order } from "../models/order.model.js";
import { customError } from "../utils/error.util.js";
import mongoose from "mongoose";

export const processCheckout = async (req, res, next) => {
  const { id, role } = req.user;

  try {
    const cart = await findOrCreateCart(id, role);

    if (!cart.items.length) {
      const error = customError(400, "Cart is empty");
      logger.error(`Cart is empty for user ${id}: `, error);
      return next(error);
    }

    let user = null;
    let discountCode = null;

    if (role === "customer") {
      user = await User.findById(id).select("email loyaltyPoints").lean();
      discountCode = getDiscountCode(user.loyaltyPoints, cart.total);
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "mvr",
        product_data: {
          name: item.variant.product.name,
        },
        unit_amount: item.variant.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: user ? user.email : undefined,
      shipping_address_collection: {
        allowed_countries: ["MV"],
      },
      discounts: discountCode ? [{ coupon: discountCode }] : [],
      success_url: process.env.PAYMENT_SUCCESS_URL,
      cancel_url: process.env.PAYMENT_CANCEL_URL,
      metadata: {
        cartId: cart._id.toString(),
      },
    });

    logger.info(`Checkout processed successfully for user ${id}.`);
    return res.status(200).json({
      message: "Checkout processed successfully",
      paymentUrl: session.url,
    });
  } catch (error) {
    logger.error(`Error processing checkout for user ${id}: `, error);
    return next(error);
  }
};

