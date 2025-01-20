import { Order } from "../models/order.model.js";
import { sendEmails } from "../utils/emailer.util.js";

export const watchOrders = () => {
  const changeStream = Order.watch();

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const order = await Order.populate(change.fullDocument, [
        {
          path: "items.variant",
          select: "product",
          populate: { path: "product", select: "name" },
        },
      ]);

      order.total = 0;

      order.items.forEach((item) => {
        order.total += item.subTotal;
      });

      sendEmails(
        order.email,
        "Purchase confirmed",
        {
          order,
        },
        "receipt"
      );
    }
  });
};
