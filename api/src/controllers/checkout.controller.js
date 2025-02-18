import { clearCart, findOrCreateCart } from "../services/cart.service.js";
import Stripe from "stripe";
import { User } from "../models/user.model.js";
import { convertToPoints, getDiscount } from "../services/checkout.service.js";
import { logger } from "../utils/logger.util.js";
import { validateCompleteCheckout } from "../utils/validator.util.js";
import { Order } from "../models/order.model.js";
import { customError } from "../utils/error.util.js";
import mongoose from "mongoose";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET);

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
    let discount = null;

    if (role === "customer") {
      user = await User.findById(id).select("email loyaltyPoints").lean();
      discount = getDiscount(user.loyaltyPoints, cart.total);
    }

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
      discounts: discount ? [{ coupon: discount.code }] : [],
      success_url: process.env.PAYMENT_SUCCESS_URL,
      cancel_url: process.env.PAYMENT_CANCEL_URL,
      metadata: {
        cartId: cart._id.toString(),
        usedPoints: discount && discount.usedPoints,
        userId: id,
        isGuest: role === "customer" ? false : true,
        role,
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

export const handleWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error("Webhook signature verification failed: ", err.message);
    return next(err);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session_id = event.data.object.id;

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(
          session_id,
          {
            expand: ["payment_intent"],
          }
        );

        let { usedPoints, userId: id, isGuest, role } = stripeSession.metadata;

        isGuest = isGuest === "true";

        const { billing_details, card } = await stripe.paymentMethods.retrieve(
          stripeSession.payment_intent.payment_method
        );

        if (stripeSession.payment_status !== "paid") {
          const error = customError(400, "Payment not completed");
          logger.error(
            `Payment not completed for session ${session_id}: `,
            error
          );

          await session.abortTransaction();

          return next(error);
        }

        const cart = await findOrCreateCart(id, role, session);

        const items = cart.items.map((item) => ({
          variant: item.variant._id,
          quantity: item.quantity,
          subTotal: item.subTotal,
        }));

        const earnedPoints = convertToPoints(
          stripeSession.payment_intent.amount_received
        );

        const order = new Order({
          ...(!isGuest && { user: id }),
          isGuest,
          email: stripeSession.customer_details.email,
          items,
          billing: { address: billing_details.address },
          shipping: { address: stripeSession.shipping_details.address },
          payment: {
            transactionId: stripeSession.payment_intent.id,
            amount: stripeSession.payment_intent.amount_received / 100,
            brand: card.brand,
            expMonth: card.exp_month,
            expYear: card.exp_year,
            last4: card.last4,
            discount: stripeSession.total_details.amount_discount / 100,
          },
          earnedPoints,
        });

        const { _id: oid } = await order.save({ session });

        if (!isGuest) {
          const updatedPoints = earnedPoints - usedPoints;

          await User.findByIdAndUpdate(id, {
            $inc: {
              loyaltyPoints: updatedPoints,
            },
          }).session(session);
        }

        await clearCart(id, role, session);

        await session.commitTransaction();

        logger.info(
          `Checkout completed successfully for user ${id} and order ${oid}.`
        );
      } catch (error) {
        await session.abortTransaction();

        logger.error(`Error completing checkout for user ${id}: `, error);
        return next(error);
      } finally {
        await session.endSession();
        break;
      }
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
