import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder, fetchOrders } from "../../store/slices/order-slice";
import { toast } from "react-toastify";
import emptyOrdersImg from "../../assets/images/emptyOrders.svg";
import dropArrowIcon from "../../assets/icons/dropArrow.svg";
import { FaSearch, FaDownload, FaEye, FaEdit } from "react-icons/fa";

const AdminOrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    orders,
    status: orderStatus,
    error: orderError,
  } = useSelector((state) => state.orders);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");

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

  // Filtering orders based on search input
  const filteredOrders = orders.filter((order) =>
    order.items[0].variant.product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  />
                  <button className="flex items-center justify-center w-36 px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                    <FaSearch className="mr-2" />
                    <span>Search</span>
                  </button>
                </div>

                {/* Filters and Export Section */}
                <div className="flex items-center gap-4">
                  {/* Status Filter Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-52 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Date Sort Dropdown */}
                  <select
                    value={dateSort}
                    onChange={(e) => setDateSort(e.target.value)}
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

              {/* Orders Table */}
              <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                <thead className="bg-gray-100 text-base">
                  <tr>
                    <th className="p-4 text-left">Index</th>
                    <th className="p-4 text-left">Order ID</th>
                    <th className="p-4 text-left">Delivery Date</th>
                    <th className="p-4 text-left">Time Slot</th>
                    <th className="p-4 text-left">Customer Name</th>
                    <th className="p-4 text-left">Branch</th>
                    <th className="p-4 text-left">Total Amount</th>
                    <th className="p-4 text-left">Order Status</th>
                    <th className="p-4 text-left">Order Type</th>
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
                          <td className="p-4">{order.deliveryDate}</td>
                          <td className="p-4">{order.timeSlot}</td>
                          <td className="p-4">{order.user}</td>
                          <td className="p-4">{order.branch}</td>
                          <td className="p-4">{order.payment.amount}</td>
                          <td className="p-3">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="p-4">{order.orderType}</td>
                          <td className="p-4">
                            <Link to="/manage-order-details">
                              <button className="text-blue-500 hover:underline mr-4">
                                <FaEye className="mr-2" size={24} />
                              </button>
                            </Link>
                            <button className="text-yellow-500 hover:underline">
                              <FaEdit className="mr-2" size={24} />
                            </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;
