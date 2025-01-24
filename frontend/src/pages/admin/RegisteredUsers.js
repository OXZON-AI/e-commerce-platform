import React, { useState } from "react";

const RegisteredUsers = () => {
  // Sample user data
  const [users, setUsers] = useState([
    { id: 1, name: "Kanishka", phone: "077-1234567", email: "kanishka@gmail.com", loyaltyPoints: 150 },
    { id: 2, name: "Yasiru ", phone: "071-9876543", email: "yasiru@gmail.com", loyaltyPoints: 220 },
    { id: 3, name: "Shabnam", phone: "076-5556789", email: "shabnam@gmail.com", loyaltyPoints: 180 },
    { id: 4, name: "Prabashwara", phone: "078-3334444", email: "prabashwara@gmail.com", loyaltyPoints: 95 },
    { id: 5, name: "Dilshan", phone: "072-4445555", email: "dilshan@gmail.com", loyaltyPoints: 125 },
    { id: 6, name: "Mala", phone: "075-6667777", email: "mala@gmail.com", loyaltyPoints: 90 },
  ]);

  // State for notifications
  const [notification, setNotification] = useState("");

  // Delete user function
  const deleteUser = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const deletedUser = users.find((user) => user.id === id)?.name;
      setUsers(users.filter((user) => user.id !== id));
      setNotification(`User "${deletedUser}" has been successfully deleted.`);
      // Hide the notification after 3 seconds
      setTimeout(() => setNotification(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md">
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Registered Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Phone</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-center px-6 py-3 text-gray-600 font-medium">Loyalty Points</th>
                <th className="text-center px-6 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{user.loyaltyPoints}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegisteredUsers;
