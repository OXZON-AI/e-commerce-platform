import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
});

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String },
  amount: { type: Number, required: true },
  expYear: {
    type: String,
  },
  expMonth: {
    type: String,
  },
  last4: {
    type: String,
  },
  brand: {
    type: String,
  },
  discount: {
    type: Number,
    default: 0,
  },
  refundId: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
    },
    items: [
      {
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subTotal: {
          type: Number,
          required: true,
        },
      },
    ],
    billing: {
      address: addressSchema,
    },
    shipping: {
      address: addressSchema,
    },
    payment: {
      type: paymentSchema,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    earnedPoints: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1 }, { sparse: true });

export const Order = mongoose.model("Order", orderSchema);
