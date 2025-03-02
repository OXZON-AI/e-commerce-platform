import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  clearError,
} from "../../store/slices/admin-user-slice";

import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";
import dropArrowIcon from "../../assets/icons/dropArrow.svg";
import { toast } from "react-toastify";

const RegisteredUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [filters, setFilters] = useState({
    userType: undefined,
    sortBy: "",
    sortOrder: "",
    page: 1, // Current page for pagination
    limit: 10, // Number of users per page
  });

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchUsers(filters)); // Fetch all registered users on component mount
  }, [dispatch, filters]);

  // handler for delete user
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => {
          dispatch(fetchUsers(filters)).unwrap();
        })
        .catch((err) => {
          console.error("User Delete failed! Error : ", err.message);
        });
    }
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
      {/* Admin Navbar placed on top */}
      <AdminNavbar />

      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 p-0 overflow-y-auto">
          <div className="p-0 sm:p-8 md:p-10 lg:p-12 w-full mx-auto">
            <div className=" bg-white rounded-none shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                Registered Users
              </h1>

              <div className="flex gap-4 mb-4">
                <div className="relative">
                  <select
                    name="userType"
                    value={filters.userType || ""}
                    onChange={handleFilterChange}
                    className="p-2 border rounded w-[150px] appearance-none pr-8"
                  >
                    <option value="">All Users</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
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
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="p-2 border rounded w-[150px] appearance-none pr-8"
                  >
                    <option value="">Sort By</option>
                    <option value="points">Points</option>
                    <option value="createdAt">Date</option>
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
                    <option value="">Sort Order</option>
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

              <div className="overflow-x-auto">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Index
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Phone
                      </th>
                      <th className="text-left px-6 py-3 text-gray-600 font-medium">
                        Email
                      </th>
                      <th className="text-center px-6 py-3 text-gray-600 font-medium">
                        Loyalty Points
                      </th>
                      <th className="text-center px-6 py-3 text-gray-600 font-medium">
                        Role
                      </th>
                      <th className="text-center px-6 py-3 text-gray-600 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users &&
                      users.map((user, index) => {
                        // Calculate the starting index based on the current page
                        // const currentIndex =
                        // (filters.page - 1) * filters.limit + index + 1;

                        return (
                          <tr
                            key={user._id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 text-gray-700">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {user.phone}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700">
                              {user.loyaltyPoints}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700">
                              <div className="inline-block bg-blue-100 border-2 border-blue-500 text-blue-500 rounded px-2 py-1">
                                {user.role}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {users && users.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredUsers;
