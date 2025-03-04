import React, { useState } from "react";
import { FaPrint, FaPen } from "react-icons/fa";
import AdminNavbar from "./components/AdminNavbar";
import Sidebar from "./components/Sidebar";
const AdminOrderDetail = () => {
  const [orderStatus, setOrderStatus] = useState("Shipped");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "John Doe",
    phone: "+94712345678",
    address: "25, Main Street, Colombo",
  });
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Define order with sample data
  const order = {
    products: [
      {
        name: "Samsung Galaxy S23",
        price: 220000,
        quantity: 1,
        image: "http://dummyimage.com/50x50/808080/fff.png",
      },
      {
        name: "MacBook Air M2",
        price: 380000,
        quantity: 1,
        image: "http://dummyimage.com/50x50/808080/fff.png",
      },
    ],
    subTotal: 600000,
    totalAmount: 600000,
  };

  const handleOrderStatusChange = (e) => setOrderStatus(e.target.value);
  const handlePaymentStatusChange = (e) => setPaymentStatus(e.target.value);
  const handleDeliveryDateChange = (e) => setDeliveryDate(e.target.value);
  const toggleEdit = () => setIsEditing(!isEditing);

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
            <div className="w-full max-w-full bg-white h-screen shadow-md p-6 flex gap-6">
              {/* Left Side - Order Details */}
              <div className="flex-1">
                <div className="border-b pb-4 flex justify-between items-center">
                  <h2 className="text-3xl font-semibold text-gray-800">
                    Order Details
                  </h2>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold">Order ID #200123</span>
                  <div className="flex space-x-2">
                    <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded">
                      <FaPrint className="mr-2" /> Print Invoice
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  20 Feb 2025 14:45:00
                </p>

                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="text-green-600">{orderStatus}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Payment Method:</span>{" "}
                    Credit Card
                  </p>
                  <p>
                    <span className="font-semibold">Payment Status:</span>{" "}
                    <span className="text-green-600">{paymentStatus}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Order Type:</span> Home
                    Delivery
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Order Items
                  </h3>

                  {/* Order Table */}
                  {order?.products?.length > 0 && (
                    <table className="w-full mt-6 border border-gray-300 rounded-lg">
                      <thead className="bg-gray-200">
                        <tr className="text-gray-700">
                          <th className="py-3 px-4 text-left">Product</th>
                          <th className="py-3 px-4 text-left">
                            Unit Price (Rs.)
                          </th>
                          <th className="py-3 px-4 text-left">Quantity</th>
                          <th className="py-3 px-4 text-left">Total (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((product, idx) => (
                          <tr key={idx} className="border-t border-gray-300">
                            <td className="py-3 px-4 flex items-center">
                              <img
                                src={
                                  product.image ||
                                  "https://via.placeholder.com/50"
                                }
                                alt={product.name}
                                className="w-12 h-12 rounded mr-3"
                              />
                              {product.name}
                            </td>
                            <td className="py-3 px-4">
                              {product.price.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">{product.quantity}</td>
                            <td className="py-3 px-4 font-semibold">
                              {(
                                product.price * product.quantity
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Total Summary */}
                  <div className="mt-6 flex border justify-between items-center text-white px-6 py-4 rounded-lg">
                    <p className="font-bold text-lg bg-gray-500 text-white px-6 py-2 rounded-md">
                      Sub Total:{" "}
                      <span className="font-medium">
                        Rs {order?.subTotal?.toLocaleString()}
                      </span>
                    </p>

                    <p className="font-bold text-lg bg-gray-500 text-white px-6 py-2 rounded-md ">
                      Total Amount:{" "}
                      <span className="font-medium">
                        Rs {order?.totalAmount?.toLocaleString()}
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
                      <option>Shipped</option>
                      <option>Pending</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                      <option>Returned</option>
                      <option>Processing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Payment Status:
                    </label>
                    <select
                      className="border p-2 w-full rounded"
                      value={paymentStatus}
                      onChange={handlePaymentStatusChange}
                    >
                      <option>Paid</option>
                      <option>Refunded</option>
                      <option>Partially Paid</option>
                      <option>Failed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Delivery Date & Time:
                    </label>
                    <input
                      type="date"
                      className="border p-2 w-full rounded"
                      value={deliveryDate}
                      onChange={handleDeliveryDateChange}
                    />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded">
                    Assign Delivery Man Manually
                  </button>
                </div>

                {/* Delivery Information */}
                {/* <div className="mt-6">
            <h3 className="text-lg font-semibold border-b pb-2">Delivery Information</h3>
            <p><span className="font-semibold">Name:</span> John Doe</p>
            <p><span className="font-semibold">Phone:</span> +94712345678</p>
            <p><span className="font-semibold">Address:</span> 25, Main Street, Colombo</p>
            {deliveryDate && <p><span className="font-semibold">Scheduled Delivery Date:</span> {deliveryDate}</p>}
          </div> */}

                {/* Delivery Information with Edit Option */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold border-b pb-2 flex justify-between items-center">
                    Delivery Information
                    <FaPen
                      className="text-gray-500 cursor-pointer"
                      onClick={toggleEdit}
                    />
                  </h3>
                  {isEditing ? (
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
                  ) : (
                    <div className="mt-2">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {deliveryInfo.name}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {deliveryInfo.phone}
                      </p>
                      <p>
                        <span className="font-semibold">Address:</span>{" "}
                        {deliveryInfo.address}
                      </p>
                      <p>
                        <span className="font-semibold">Delivery Date:</span>{" "}
                        {deliveryDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
