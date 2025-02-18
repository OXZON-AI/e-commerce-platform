import React from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center max-w-md">
        <Lock className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this page. Please contact your administrator.
        </p>
        <Link
          to="/"
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;