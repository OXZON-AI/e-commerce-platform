import React from "react";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";

const DeleteModal = ({
  loading,
  deleteModalOpen,
  closeDeleteModal,
  handleDelete,
  productId,
  categoryId,
  serverError,
}) => {
  if (!deleteModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto max-h-[90vh] sm:max-h-[95vh] lg:max-h-screen overflow-auto"
      >
        {/* Error Messages */}
        {serverError && (
          <div className="w-full bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-4">
            <p className="text-sm font-medium text-red-700">{serverError}</p>
          </div>
        )}
        <h3 className="text-xl font-semibold mb-4">{productId ? "Delete Product" : categoryId ? "delete category" : "No Action"}</h3>
        <p className="mb-4">{productId ? "Are you sure you want to delete this product?" : categoryId ? "Are you sure you want to delete this category?" : "This delete popup not deleteing anything!"}</p>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <div className="relative inline-block">
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center z-0">
                <PuffLoader color="#a855f7" size={40} />
              </div>
            )}

            <button
              type="button"
              onClick={() => handleDelete(productId ?? categoryId)} // The ?? (Nullish Coalescing Operator) ensures that false or 0 values are not mistakenly used.
              disabled={loading}
              className={`relative bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } z-10`}
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteModal;
