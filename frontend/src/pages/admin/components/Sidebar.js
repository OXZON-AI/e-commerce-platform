import { Link } from "react-router-dom";
import {
  HomeIcon,
  ArchiveBoxIcon,
  UserIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-6 shadow-lg transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">Admin Panel</h2>
      <ul className="space-y-6">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            <HomeIcon className="w-6 h-6 text-gray-400 hover:text-white" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin-product"
            className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            <ArchiveBoxIcon className="w-6 h-6 text-gray-400 hover:text-white" />
            <span className="font-medium">Product Management</span>
          </Link>
        </li>
        {/* <li>
          <Link to="/manage-categories" className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out">
            <Cog6ToothIcon className="w-6 h-6 text-gray-400 hover:text-white" />
            <span className="font-medium">Category Management</span>
          </Link>
        </li> */}
        <li>
          <Link
            to="/manage-orders"
            className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            <ShoppingBagIcon className="w-6 h-6 text-gray-400 hover:text-white" />
            <span className="font-medium">Order Management</span>
          </Link>
        </li>

        <li>
          <Link
            to="/registered-users"
            className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            <UserIcon className="w-6 h-6 text-gray-400 hover:text-white" />
            <span className="font-medium">User Management</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
