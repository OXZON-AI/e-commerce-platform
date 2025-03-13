import React from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutUser } from "../../store/slices/user-slice";

const UnauthorizedClientPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  // Handle logout as admin
  const handleLogout = async () => {
    try {
      await dispatch(signoutUser()).unwrap();
      navigate("/"); // Redirect to Client Home AFTER successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center max-w-md">
        {/* Back to Dashboard Button */}
        <div className="w-full flex justify-start">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
        </div>

        <Lock className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this{" "}
          <span className="text-yellow-500 font-semibold">client page</span>.
          Please log in as a client or log out as an admin.
        </p>

        {/* Inline Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className={`px-6 py-2 rounded-lg shadow-md transition ${
              loading
                ? "bg-yellow-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
          >
            Back To Dashboard
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className={`px-6 py-2 rounded-lg shadow-md transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            {loading ? "Logging out..." : "Logout as Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedClientPage;
