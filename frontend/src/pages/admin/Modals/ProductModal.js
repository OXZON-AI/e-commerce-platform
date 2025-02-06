// ProductModal.js
import React from "react";
import { motion } from "framer-motion";

const ProductModal = ({
  isOpen,
  onClose,
  selectedProduct,
  formData,
  handleChange,
  handleAttributeChange,
  handleSave,
  errorValidation,
  categories,
  setFormData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-300 rounded-lg p-6 sm:p-8 md:p-10 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl w-full mx-auto">
        <h3 className="text-xl font-semibold mb-4">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h3>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto max-h-[90vh] sm:max-h-[95vh] lg:max-h-screen overflow-auto"
        >
          <form className="space-y-4">
            {errorValidation && (
              <div className="w-full bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-4">
                <p className="text-sm font-medium text-red-700">
                  {errorValidation}
                </p>
              </div>
            )}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Detailed Description
              </label>
              <textarea
                type="text"
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                CompareAtPrice
              </label>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Image</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste Image URL"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300 mt-4"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Attributes
              </label>
              {formData.attributes?.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    name="name"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, e)}
                    placeholder="Attribute Name"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                  />
                  <input
                    type="text"
                    name="value"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, e)}
                    placeholder="Attribute Value"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Default Variant
              </label>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto bg-purple-500 text-white px-5 py-3 rounded-lg hover:bg-purple-600 transition"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductModal;