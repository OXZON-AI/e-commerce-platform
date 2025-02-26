import React, { Fragment, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutOne from "../../layouts/LayoutOne";
import { fetchOrders } from "../../store/slices/order-slice";
import { useDispatch, useSelector } from "react-redux";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);

  // Efect hook for fetch orders
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Handler for cancel order
  const handleCancelOrder = (oid) => {
    toast.info("order cancel success!");
  };

  // Handler for reorder
  const handleReorder = (productName) => {
    toast.info("reorder success!");
  };

  return (
    <Fragment>
      <LayoutOne>
        <div className="min-h-full bg-purple-100 flex items-center justify-center p-6">
          <div className="w-full lg:w-3/4 xl:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Order History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Total price</th>
                    <th className="p-3 text-left">Order Status</th>
                    <th className="p-3 text-left">Loyalty Points</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order) =>
                      order.items.map((item, index) => (
                        <tr
                          key={`${order._id}-${index}`}
                          className="border-b hover:bg-gray-200 transition"
                        >
                          <td className="p-3">{item.variant.product.name}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 font-semibold">
                            {item.subTotal} MVR
                          </td>
                          <td className="p-3">{order.status}</td>
                          <td className="p-3">{item.points}</td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                              onClick={() => handleReorder(item.name)}
                            >
                              Reorder
                            </button>
                            {order.status === "pending" && (
                              <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutOne>
      <ToastContainer />
    </Fragment>
  );
};

export default OrderHistory;
