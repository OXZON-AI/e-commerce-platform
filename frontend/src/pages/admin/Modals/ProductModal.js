// ProductModal.js
import React from "react";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import { Upload } from "lucide-react"; // Import Upload icon

const ProductModal = ({
  loading,
  isOpen,
  onClose,
  productDetail,
  formData,
  handleChange,
  handleAttributeChange,
  handleSave,
  errorValidation,
  serverError,
  categories,
  setFormData,
  addAttributeField,
  removeAttributeField,
  imageUrl,
  handleImageUpload,
}) => {
  if (!isOpen) return null;

  const attributeOptions = [
    "color",
    "size",
    "storage",
    "ram",
    "processor",
    "display",
    "battery",
    "operating system",
    "camera",
    "connectivity",
    "gpu",
    "ports",
    "weight",
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-300 rounded-md p-10 sm:p-12 md:p-14 lg:p-16 xl:p-20 max-w-full sm:max-w-5xl lg:max-w-7xl w-full mx-auto">
        <h3 className="text-3xl font-semibold mb-4 text-center">
          {productDetail ? "Edit Product" : "Add Product"}
        </h3>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-h-[90vh] overflow-auto"
        >
          {/* Error Messages */}
          {serverError && (
            <div className="w-full bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-4">
              <p className="text-sm font-medium text-red-700">{serverError}</p>
            </div>
          )}
          {errorValidation && !serverError && (
            <div className="w-full bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-4">
              <p className="text-sm font-medium text-red-700">
                {errorValidation}
              </p>
            </div>
          )}

          {/* Two-Column Layout for Desktop */}
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Side - First 7 Inputs */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                />
              </div>
              <div>
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
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Detailed Description
                </label>
                <textarea
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Cost
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                />
              </div>
              <div>
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
            </div>

            {/* Right Side - Remaining Inputs */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={!productDetail} // if create form disable stock
                  className={`w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300 ${
                    !productDetail
                      ? "bg-gray-100 border-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              <div>
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
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                />
              </div>
              <div className="relative w-full">
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleImageUpload}
                  className="hidden" // Hide the default file input
                />

                {/* Custom Upload Button */}
                <label
                  htmlFor="fileInput"
                  className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300 cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Upload className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Upload Image</span>
                </label>

                {/* Show preview near input */}
                {imageUrl && (
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <img
                      src={imageUrl}
                      alt="Selected"
                      className="w-10 h-10 rounded-full border border-gray-400 object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Attributes
                </label>
                {formData.attributes?.map((attr, index) => (
                  <div key={index} className="flex gap-2 items-center mb-3">
                    <select
                      name="name"
                      value={attr.name}
                      onChange={(e) => handleAttributeChange(index, e)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                    >
                      <option value="">Select Attribute</option>
                      {attributeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="value"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, e)}
                      placeholder="Attribute Value"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttributeField(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAttributeField}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  + Add Attribute
                </button>
              </div>
              {/* <div className="flex items-center space-x-2 mt-4">
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
              </div> */}
            </div>
          </form>

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <div className="relative inline-block">
              {/* HashLoader behind the button */}
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center z-0">
                  <PuffLoader color="#a855f7" size={40} />
                </div>
              )}

              {/* Save button (appears above the loader) */}
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className={`relative bg-purple-500 text-white px-5 py-3 rounded-lg hover:bg-purple-600 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } z-10`}
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductModal;
