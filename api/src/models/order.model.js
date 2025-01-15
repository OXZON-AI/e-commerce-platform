import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const paymentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Card", "Points"],
  },
  transactionId: String,
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
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        varient: {
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
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1 });

export const Order = mongoose.model("Order", orderSchema);
