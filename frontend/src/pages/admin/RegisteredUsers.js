import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../../store/slices/admin-user-slice";

import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";

const RegisteredUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers()); // Fetch all registered users on component mount
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
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
        <div className="overflow-x-auto">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
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
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 text-gray-700">{user.phone}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
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
                ))}
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
