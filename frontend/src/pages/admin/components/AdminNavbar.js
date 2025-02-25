import { useState } from "react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutUser } from "../../../store/slices/user-slice";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle logout as admin
  const handleLogout = async () => {
    try {
      await dispatch(signoutUser()).unwrap();
      navigate("/login-register"); // Redirect to Client Home AFTER successful logout
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
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
        <h1 className="text-2xl font-semibold text-gray-100">
          GENUINE ELECTRONICS
        </h1>
      </div>

      {/* Middle Section - Search Bar */}
      {/* <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-2 w-full max-w-4xl">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-white focus:outline-none w-full placeholder-gray-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div> */}

      {/* Right Section - User Profile & Logout Button */}
      <div className="flex items-center space-x-6 relative">
        {/* User Profile Dropdown */}
        <div className="relative mr-6">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <UserIcon className="w-6 h-6" />
            <span className="hidden md:inline">Admin</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl p-2 space-y-2">
              <Link
                to="/my-account"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-gray-300 hover:text-red-500 hover:bg-gray-700 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
