import React, { useState } from "react";
import { FaPrint, FaPen } from "react-icons/fa";
import AdminNavbar from "./components/AdminNavbar";
import Sidebar from "./components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { updateOrderStatus } from "../../store/slices/order-slice";
import { toast } from "react-toastify";
import emptyOrdersImg from "../../assets/images/emptyOrders.svg";

const AdminOrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.orders.selectedOrder); // Get order from Redux

  console.log("Selected Order-Details : ", order);

  const [orderStatus, setOrderStatus] = useState(order?.status || "pending");

  // handler for order status change
  const handleOrderStatusChange = (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);
    dispatch(
      updateOrderStatus({
        oid: order._id,
        status: newStatus,
        isGuest: order.isGuest,
        userId: order.user._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Order status updated successfully.");
      })
      .catch(() => {
        toast.error("Failed to update order status.");
      });
  };

  // function for change distinct colors for diffrent order status
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "border-amber-500 bg-amber-50 text-amber-600",
      cancelled: "border-red-500 bg-red-100 text-red-600",
      shipped: "border-blue-500 bg-blue-100 text-blue-600",
      delivered: "border-green-500 bg-green-100 text-green-600",
      processing: "border-purple-500 bg-purple-100 text-purple-600",
    };

    return (
      <span
        className={`border-1 px-2 py-px rounded-[4px] font-normal ${
          statusStyles[status] || "border-gray-500 bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar on Top */}
      <AdminNavbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}

        <div className="flex-1 p-0 overflow-y-auto">
          <div className="p-0 sm:p-8 md:p-10 lg:p-12 w-full mx-auto">
            {/* <div className="p-6 bg-gray-100 flex justify-center "> */}
            {order ? (
              <div className="w-full max-w-full bg-white h-screen shadow-md p-6 flex gap-6">
                {/* Left Side - Order Details */}
                <div className="flex-1">
                  <div className="border-b pb-4 flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-gray-800">
                      Order Details
                    </h2>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold">
                      Order ID: {order._id}
                    </span>
                    {/* <div className="flex space-x-2">
                    <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded">
                      <FaPrint className="mr-2" /> Print Invoice
                    </button>
                  </div> */}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {moment(order.createdAt).format("DD-MMM-YYYY / h:mm:ss a")}
                  </p>

                  <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {getStatusBadge(order.status)}
                    </p>
                    <p>
                      <span className="font-semibold">Payment Method:</span>{" "}
                      {order.payment.brand}
                    </p>
                    <p>
                      <span className="font-semibold">Payment Status:</span>{" "}
                      <span
                        className={`${
                          order.payment?.refundId
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.payment?.refundId ? "Refunded" : "Success"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">
                        Order Earned Points:
                      </span>{" "}
                      <span className="text-yellow-600">
                        {order.earnedPoints} points
                      </span>
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Order Items
                    </h3>

                    {/* Order Table */}
                    {order?.items?.length > 0 && (
                      <table className="w-full mt-6 border border-gray-300 rounded-lg">
                        <thead className="bg-gray-200">
                          <tr className="text-gray-700">
                            <th className="py-3 px-4 text-left">Product</th>
                            <th className="py-3 px-4 text-left">
                              Unit Price (MVR)
                            </th>
                            <th className="py-3 px-4 text-left">Quantity</th>
                            <th className="py-3 px-4 text-left">Total (MVR)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-300">
                              <td className="py-3 px-4 flex items-center">
                                <img
                                  src={
                                    item.variant.image.url ||
                                    "https://via.placeholder.com/50"
                                  }
                                  alt={item.variant.image.alt}
                                  className="w-12 h-12 rounded mr-3"
                                />
                                {item.variant.product.name}
                              </td>
                              <td className="py-3 px-4">
                                {(
                                  item.subTotal / item.quantity
                                ).toLocaleString()}{" "}
                              </td>
                              <td className="py-3 px-4">{item.quantity}</td>
                              <td className="py-3 px-4 font-semibold">
                                {item.subTotal.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Total Summary */}
                    <div className="mt-6 flex border justify-end items-center text-white px-6 py-4 rounded-lg">
                      {/* <p className="font-bold text-lg bg-gray-500 text-white px-6 py-2 rounded-md">
                      Sub Total: <span className="font-medium">N/A</span>
                    </p> */}

                      <p className="font-bold text-lg bg-gray-500 text-white px-6 py-2 rounded-md ">
                        Total Amount:{" "}
                        <span className="font-medium">
                          {order?.payment?.amount?.toLocaleString()} MVR
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Order Setup */}
                <div className="w-96 bg-gray-50 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Order Setup
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-gray-700">
                        Change Order Status:
                      </label>
                      <select
                        className="border p-2 w-full rounded"
                        value={orderStatus}
                        onChange={handleOrderStatusChange}
                      >
                        <option>pending</option>
                        <option>processing</option>
                        <option>shipped</option>
                        <option>delivered</option>
                        <option>cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  {/* Delivery Information with Edit Option */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold border-b pb-2 flex justify-between items-center">
                      Delivery Information
                      {/* <FaPen
                      className="text-gray-500 cursor-pointer"
                      onClick={toggleEdit}
                    /> */}
                    </h3>
                    {/* {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <input
                        className="border p-2 w-full rounded"
                        type="text"
                        value={deliveryInfo.name}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border p-2 w-full rounded"
                        type="text"
                        value={deliveryInfo.phone}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            phone: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border p-2 w-full rounded"
                        type="text"
                        value={deliveryInfo.address}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            address: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border p-2 w-full rounded"
                        type="date"
                        value={deliveryDate}
                        onChange={handleDeliveryDateChange}
                      />
                      <button
                        className="w-full bg-green-600 text-white py-2 rounded"
                        onClick={toggleEdit}
                      >
                        Save
                      </button>
                    </div>
                  ) : ( */}
                    <div className="mt-2">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {order.user.name}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {order.email}
                      </p>
                      <p>
                        <span className="font-semibold">Address:</span>{" "}
                        {order.shipping.address.line1},{" "}
                        {order.shipping.address.line2},{" "}
                        {order.shipping.address.city},{" "}
                        {order.shipping.address.state},{" "}
                        {order.shipping.address.country}
                      </p>
                      {/* <p>
                        <span className="font-semibold">Delivery Date:</span>{" "}
                        {deliveryDate}
                      </p> */}
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center mt-100 gap-4">
                <img
                  src={emptyOrdersImg}
                  alt="order not found image"
                  className="w-[120px]"
                />
                <div className="flex flex-col items-start justify-center">
                  <p className="text-center text-gray-700 font-semibold py-1">
                    Something Went Wrong!
                  </p>
                  <button
                    className="px-6 py-2 border-1 border-purple-500 bg-purple-100 font-medium text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition"
                    onClick={() => navigate("/manage-orders")}
                  >
                    Back To Order Management
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
