import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import Sidebar from "./components/Sidebar";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <div className="bg-white shadow-xl rounded-none p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">
                  Order Management
                </h2>
              </div>

              {/* Loading & Empty State */}
              {loading ? (
                <div className="text-center text-gray-500 py-10">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No orders found.
                </div>
              ) : (
                // Table Structure
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="py-3 px-6 text-left">Order ID</th>
                        <th className="py-3 px-6 text-left">Customer</th>
                        <th className="py-3 px-6 text-left">Total</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-4 px-6 text-gray-800">
                            {order._id}
                          </td>
                          <td className="py-4 px-6 text-gray-800">
                            {order.email}
                          </td>
                          <td className="py-4 px-6 text-gray-800">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                order.status === "pending"
                                  ? "bg-yellow-500 text-gray-900"
                                  : order.status === "shipped"
                                  ? "bg-blue-500 text-white"
                                  : order.status === "delivered"
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 flex space-x-2 justify-center">
                            <button
                              //onClick={() => handleStatusUpdate(order._id, "shipped")}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                              Mark as Shipped
                            </button>
                            <button
                              //onClick={() => handleCancelOrder(order._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                              Cancel
                            </button>
                            <Link
                              to={`/order/${order._id}`}
                              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
