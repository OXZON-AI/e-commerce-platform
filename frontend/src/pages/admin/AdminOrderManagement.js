import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder, fetchOrders } from "../../store/slices/order-slice";
import { toast } from "react-toastify";
import emptyOrdersImg from "../../assets/images/emptyOrders.svg";
import dropArrowIcon from "../../assets/icons/dropArrow.svg";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    orders,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orders);

  const [filters, setFilters] = useState({
    status: undefined,
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // Efect hook for fetch orders
  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  // Handler for cancel order
  const handleCancelOrder = (oid) => {
    console.log("order-id : ", oid);

    dispatch(cancelOrder(oid))
      .unwrap()
      .then(() => {
        toast.success("Order cancelled successfully.");
        dispatch(fetchOrders(filters))
          .unwrap()
          .then(() => {
            console.log("🔰 Orders are re-fetched!");
          });
      })
      .catch(() => {
        toast.error("Failed to cancel order.");
      });
  };

  // handler for filterChange
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value || undefined, // undefine use when value is empty, then mark as undefine
      page: 1,
    });
  };

  // handler for pagination
  const handlePagination = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: direction === "next" ? prev.page + 1 : Math.max(prev.page - 1, 1),
    }));
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
            <div className="bg-white shadow-xl rounded-none p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">
                  Order Management
                </h2>

                <div className="flex gap-4 mb-4">
                  <div className="relative">
                    <select
                      name="status"
                      value={filters.status || ""}
                      onChange={handleFilterChange}
                      className="p-2 border rounded w-[150px] appearance-none pr-8"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <img
                        src={dropArrowIcon}
                        alt="dropdown arrow"
                        className="w-4"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      name="sortOrder"
                      value={filters.sortOrder}
                      onChange={handleFilterChange}
                      className="p-2 border rounded w-[150px] appearance-none pr-8"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <img
                        src={dropArrowIcon}
                        alt="dropdown arrow"
                        className="w-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* orderStatus === "fetch-loading" & Empty State */}
              {orderStatus === "fetch-loading" ? (
                <div className="text-center text-gray-500 py-10">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                // Show no orders available
                <div className="flex flex-col items-center text-center py-6">
                  <img
                    src={emptyOrdersImg}
                    alt="empty order image"
                    className="w-[150px]"
                  />
                  <p className="text-center text-gray-700 font-semibold py-6">
                    No{" "}
                    <span className="text-purple-600">
                      {filters.status ? filters.status + " " : ""}
                    </span>
                    orders found.
                  </p>
                </div>
              ) : (
                // Table Structure
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="py-3 px-6 text-left">Index</th>
                        <th className="py-3 px-6 text-left">Order ID</th>
                        <th className="py-3 px-6 text-left">Customer</th>
                        <th className="py-3 px-6 text-left">Total</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => {
                        // Calculate the starting index based on the current page
                        const currentIndex =
                          (filters.page - 1) * filters.limit + index + 1;

                        return (
                          <tr
                            key={order._id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            <td className="py-4 px-6 text-gray-800">
                              {currentIndex}
                            </td>
                            <td className="py-4 px-6 text-gray-800">
                              {order._id}
                            </td>
                            <td className="py-4 px-6 text-gray-800">
                              {order.email}
                            </td>
                            <td className="py-4 px-6 text-gray-800">
                              {order.payment.amount.toFixed(2)} MVR
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  order.status === "pending"
                                    ? "bg-yellow-500 text-gray-900"
                                    : order.status === "processing"
                                    ? "bg-slate-500 text-white"
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
                                onClick={() => handleCancelOrder(order._id)}
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
                        );
                      })}
                    </tbody>
                  </table>

                  {/* ------------Pagination--------------- */}
                  <div className="flex justify-end items-center mt-4 space-x-4">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePagination("prev")}
                      disabled={filters.page === 1}
                      className={
                        "px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                      }
                    >
                      Previous
                    </button>

                    {/* Page Indicator */}
                    <span className="text-gray-700">Page {filters.page}</span>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePagination("next")}
                      disabled={orders.length < 10}
                      className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
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
