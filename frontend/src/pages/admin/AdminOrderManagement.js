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
    order.customerName.toLowerCase().includes(search.toLowerCase())
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
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">{order.orderId}</td>
                      <td className="p-4">{order.deliveryDate}</td>
                      <td className="p-4">{order.timeSlot}</td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4">{order.branch}</td>
                      <td className="p-4">{order.totalAmount}</td>
                      <td className="p-4">{order.status}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;
