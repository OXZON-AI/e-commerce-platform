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

export const completeCheckout = async (req, res, next) => {
  const { id, role } = req.user;
  const { error, value } = validateCompleteCheckout(req.body);

  if (error) return next(error);

  const { session_id } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const stripeSession = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    const { billing_details, card } = await stripe.paymentMethods.retrieve(
      stripeSession.payment_intent.payment_method
    );

    if (stripeSession.payment_status !== "paid") {
      const error = customError(400, "Payment not completed");
      logger.error(`Payment not completed for session ${session_id}: `, error);
      return next(error);
    }

    const cart = await findOrCreateCart(id, role, session);

    const items = cart.items.map((item) => ({
      variant: item.variant._id,
      quantity: item.quantity,
      subTotal: item.subTotal,
    }));

    await clearCart(id, role, session);

    const earnedPoints = convertToPoints(
      stripeSession.payment_intent.amount_received
    );

    const order = new Order({
      user: role === "customer" ? id : undefined,
      isGuest: role === "customer" ? false : true,
      items,
      billing: { address: billing_details.address },
      shipping: { address: stripeSession.shipping_details.address },
      payment: {
        transactionId: stripeSession.payment_intent.id,
        amount: stripeSession.payment_intent.amount_received,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year,
        last4: card.last4,
      },
      earnedPoints,
    });

    await order.save({ session });

    await session.commitTransaction();

    logger.info(`Checkout completed successfully for user ${id}.`);
    return res.status(200).json({ message: "Checkout completed successfully" });
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      const err = customError(400, "Checkout is already completed");
      logger.error(
        `Tried to save the order with payment id ${error.keyValue["payment.transactionId"]} again: `,
        err
      );
      return next(err);
    }

    logger.error(`Error completing checkout for user ${id}: `, error);
    return next(error);
  } finally {
    await session.endSession();
  }
};
