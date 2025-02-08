import { useState } from "react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";  // Use MagnifyingGlassIcon for search
import { Link } from "react-router-dom";  // Import Link for navigation

const AdminNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg p-4 flex justify-between items-center">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-4">
        <img 
          src="https://dummyimage.com/50x50/000/fff" 
          alt="Logo" 
          className="h-10 w-10 object-cover rounded-full"
        />
        <h1 className="text-2xl font-semibold text-gray-100">Admin Dashboard</h1>
      </div>

      {/* Middle Section - Search Bar */}
      <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-2 w-full max-w-4xl">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" /> {/* Use MagnifyingGlassIcon here */}
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-white focus:outline-none w-full placeholder-gray-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Right Section - User Profile & Logout Button */}
      <div className="flex items-center space-x-6 ml-6">
        {/* User Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <UserIcon className="w-6 h-6" />
            <span className="hidden md:inline">Admin</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl p-2 space-y-2 hidden group-hover:block">
            <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Profile</Link>
            <Link to="/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">Settings</Link>
            <button className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-md">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
