import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XCircleIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid"; // Import Heroicons

const CancelOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handleConfirmCancel = () => {
    alert(`Order ${orderId} has been canceled.`); // Temporary alert for now
    navigate("/");
  };

  const handleUndoCancel = () => {
    alert(`Undo: Order ${orderId} has been restored.`);
    navigate("/track-order");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 p-6">
      <div className="bg-white shadow-lg p-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold text-red-600 mb-8">
          Are you sure you want to cancel Order{" "}
          <span className="font-bold">{orderId}</span>?
        </h2>

        <p className="text-lg text-gray-700 mb-8">
          Once cancelled, this action cannot be undone unless you choose to
          restore it. Please confirm your choice.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={handleConfirmCancel}
            className="bg-red-600 text-white px-8 py-3 shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <XCircleIcon className="h-6 w-6" /> {/* Icon for cancel */}
            Confirm Cancel
          </button>

          <button
            onClick={handleUndoCancel}
            className="bg-blue-600 text-white px-8 py-3 shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ArrowUturnLeftIcon className="h-6 w-6" /> {/* Icon for undo */}
            Undo Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderPage;
