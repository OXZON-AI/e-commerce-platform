import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrder,
  fetchOrders,
  setSelectedOrder,
} from "../../store/slices/order-slice";
import { toast } from "react-toastify";
import emptyOrdersImg from "../../assets/images/emptyOrders.svg";
import dropArrowIcon from "../../assets/icons/dropArrow.svg";
import { FaSearch, FaDownload, FaEye, FaEdit } from "react-icons/fa";
import { HashLoader } from "react-spinners";

const AdminOrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    orders,
    paginationInfo,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orders);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");

  const [filters, setFilters] = useState({
    customer: undefined,
    guestOnly: false,
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

  // Filtering orders based on search input
  const handleSearch = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      customer: filters.guestOnly
        ? undefined // Ignore customer filter if guestOnly is true
        : /^[0-9a-fA-F]{24}$/.test(search) // Validate MongoDB ObjectId
        ? search
        : undefined,
      page: 1, // Reset pagination when searching
    }));
  };

  // handler for filterChange
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value || undefined, // undefine use when value is empty, then mark as undefine
      page: 1,
    });
  };

  // handler for view one order and set order details to Redux
  const handleViewOrder = (order) => {
    dispatch(setSelectedOrder(order)); // store order details in redux
    navigate("/manage-order-details"); // Navigate to details page
  };

  // handler for pagination
  const handlePagination = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: direction === "next" ? prev.page + 1 : Math.max(prev.page - 1, 1),
    }));
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
      <div
        className={`border-1 px-2 py-1 rounded font-normal ${
          statusStyles[status] || "border-gray-500 bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </div>
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
            <div className="p-6 space-y-6 bg-gray-50">
              {/* Page Title */}
              <h2 className="text-4xl font-bold text-gray-800 text-center">
                Order Management
              </h2>

              {/* Search and Export Options */}
              <div className="flex flex-wrap justify-between items-center gap-6 p-6 bg-white shadow-sm rounded-lg">
                {/* Search Input & Button */}
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="text"
                    placeholder="Search by Customer ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  />
                  <button
                    onClick={handleSearch}
                    className="flex items-center justify-center w-36 px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaSearch className="mr-2" />
                    <span>Search</span>
                  </button>
                </div>

                {/* Guest Only Filter */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.guestOnly}
                    onChange={(e) =>
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        guestOnly: e.target.checked,
                        customer: undefined, // Remove customer filter when guestOnly is enabled
                        page: 1,
                      }))
                    }
                    className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-700">Guest Orders Only</span>
                </label>

                {/* Filters and Export Section */}
                <div className="flex items-center gap-4">
                  {/* Status Filter Dropdown */}
                  <select
                    name="status"
                    value={filters.status || ""}
                    onChange={handleFilterChange}
                    className="w-52 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Date Sort Dropdown */}
                  <select
                    name="sortOrder"
                    value={filters.sortOrder === "desc" ? "newest" : "oldest"}
                    onChange={(e) =>
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        sortOrder: e.target.value === "newest" ? "desc" : "asc",
                        page: 1,
                      }))
                    }
                    className="w-52 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  {/* Export Button */}
                  <button className="flex items-center justify-center w-36 px-5 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
                    <FaDownload className="mr-2" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {orderStatus === "fetch-loading" ? (
                // Show Loading State with Centered HashLoader
                <div className="flex flex-col justify-center items-center py-[50px] mx-auto text-gray-700 font-semibold">
                  <HashLoader color="#a855f7" size={50} />
                  <span className="mt-3">Loading Orders...</span>
                </div>
              ) : orderStatus === "fetch-failed" ? (
                // Show Error Message Instead of Table
                <div className="my-[50px] text-red-600 font-semibold bg-red-100 p-3 rounded-lg">
                  <span className="mt-3">{orderError}</span>
                </div>
              ) : orders.length === 0 ? (
                // Show no orders available
                <div className="flex flex-col items-center text-center py-6">
                  <img
                    src={emptyOrdersImg}
                    alt="empty order image"
                    className="w-[100px]"
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
                <>
                  {/* Orders Table */}
                  <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                    <thead className="bg-gray-100 text-base">
                      <tr>
                        <th className="p-4 text-left">Index</th>
                        <th className="p-4 text-left">Order ID</th>
                        <th className="p-4 text-left">Payment Staus</th>
                        <th className="p-4 text-left">Customer Name</th>
                        <th className="p-4 text-left">Total Amount</th>
                        <th className="p-4 text-left">Order Status</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders &&
                        orders.map((order, index) => {
                          // Calculate the starting index based on the current page
                          const currentIndex =
                            (filters.page - 1) * filters.limit + index + 1;

                          return (
                            <tr
                              key={order.orderId}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-4 px-6 text-gray-800">
                                {currentIndex}
                              </td>
                              <td className="p-4">{order._id}</td>
                              <td
                                className={`p-4 ${
                                  order.payment?.refundId
                                    ? "text-red-500"
                                    : "text-green-500"
                                }`}
                              >
                                {order.payment?.refundId
                                  ? "Refunded"
                                  : "Success"}
                              </td>
                              <td className="p-4">{order.user?.name}</td>
                              <td className="p-4">
                                {order.payment.amount}{" "}
                                <span className="text-lime-500">MVR</span>
                              </td>
                              <td className="p-3">
                                {getStatusBadge(order.status)}
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleViewOrder(order)}
                                  className="text-blue-500 hover:underline mr-4"
                                >
                                  <FaEye className="mr-2" size={24} />
                                </button>
                                {/* <button className="text-yellow-500 hover:underline">
                              <FaEdit className="mr-2" size={24} />
                            </button> */}
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
                    <span className="text-gray-700">
                      Page {filters.page} of {paginationInfo.totalPages}
                    </span>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePagination("next")}
                      disabled={orders.length < 10}
                      className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;
