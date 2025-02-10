import React from "react";
import { motion } from "framer-motion";

const DeleteModal = ({ deleteModalOpen, setDeleteModalOpen, handleDelete, productId }) => {
  if (!deleteModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto max-h-[90vh] sm:max-h-[95vh] lg:max-h-screen overflow-auto"
      >
        <h3 className="text-xl font-semibold mb-4">Delete Product</h3>
        <p className="mb-4">Are you sure you want to delete this product?</p>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleDelete(productId)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteModal;
