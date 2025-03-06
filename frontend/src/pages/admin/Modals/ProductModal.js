// ProductModal.js
import React from "react";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import { ClockArrowUp, Upload } from "lucide-react"; // Import Upload icon

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
  previewImages,
  handleImageUpload,
  isImageSelected,
  isUploading,
  handleToggle,
  handleRemoveImage,
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
              {/* if update form load show stock otherwise  dont show */}
              {productDetail ? (
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
              ) : null}

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
                  multiple
                  id="fileInput"
                  onChange={handleImageUpload}
                  className="hidden" // Hide the default file input
                  disabled={isUploading}
                />

                {/* Custom Upload Button */}
                <label
                  htmlFor="fileInput"
                  className={`w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300 cursor-pointer bg-gray-100 hover:bg-gray-200 transition ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <>
                      <ClockArrowUp className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700 opacity-100">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700">Upload Image</span>
                    </>
                  )}
                </label>

                {/* Show preview near input */}
                {previewImages.length > 0 ? (
                  <div className="flex space-x-2 mt-2">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative">
                        {/* Remove Button */}
                        <button
                          onClick={(e) => handleRemoveImage(image, e)}
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                        >
                          ✖
                        </button>

                        {/* Image Preview */}
                        <img
                          src={image.url}
                          alt={image.alt || "Product image"}
                          className="w-16 h-16 object-cover border rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
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
                      onClick={() => removeAttributeField(index, attr)}
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
              {/* if update form load show active status otherwise  dont show */}
              {productDetail ? (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 ">
                    Active Status
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={() => handleToggle(formData.isActive)}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer
                                  peer-checked:bg-green-500 peer-checked:after:translate-x-5
                                  after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white
                                  after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}
                    ></div>
                  </label>
                </div>
              ) : null}

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

              {/* Save button (loadder apears if images uploading to cloudinary) */}
              {isUploading ? (
                <PuffLoader size={30} color="#9333ea" />
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || isUploading}
                  className={`relative bg-purple-500 text-white px-5 py-3 rounded-lg hover:bg-purple-600 transition ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  } z-10`}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductModal;
