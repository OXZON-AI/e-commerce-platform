import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaDownload, FaEye, FaEdit } from "react-icons/fa";
import AdminNavbar from "./components/AdminNavbar";
import Sidebar from "./components/Sidebar";
const AdminOrderManagement = () => {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");

  // Sample order data
  const orders = [
    {
      orderId: "1001",
      deliveryDate: "2025-02-28",
      timeSlot: "10:00 AM - 12:00 PM",
      customerName: "John Doe",
      contact: "123-456-7890",
      branch: "Downtown",
      totalAmount: "$150",
      status: "Confirmed",
      orderType: "Delivery",
    },
    {
      orderId: "1002",
      deliveryDate: "2025-03-01",
      timeSlot: "2:00 PM - 4:00 PM",
      customerName: "Jane Smith",
      contact: "987-654-3210",
      branch: "Uptown",
      totalAmount: "$200",
      status: "Out for Delivery",
      orderType: "Delivery",
    },
    {
      orderId: "1003",
      deliveryDate: "2025-03-02",
      timeSlot: "12:00 PM - 2:00 PM",
      customerName: "Mike Johnson",
      contact: "555-123-4567",
      branch: "Midtown",
      totalAmount: "$180",
      status: "Pending",
      orderType: "Pickup",
    },
    {
      orderId: "1004",
      deliveryDate: "2025-03-03",
      timeSlot: "4:00 PM - 6:00 PM",
      customerName: "Emily Davis",
      contact: "444-987-6543",
      branch: "Eastside",
      totalAmount: "$250",
      status: "Delivered",
      orderType: "Delivery",
    },
    {
      orderId: "1005",
      deliveryDate: "2025-03-04",
      timeSlot: "8:00 AM - 10:00 AM",
      customerName: "Chris Brown",
      contact: "333-222-1111",
      branch: "Westside",
      totalAmount: "$120",
      status: "Processing",
      orderType: "Pickup",
    },
  ];

  // Filtering orders based on search input
  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(search.toLowerCase())
  );

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
