import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

import { motion } from "framer-motion";
import { FiUpload } from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import AdminCategoryManagement from "./AdminCategoryManagement";

const AdminProductManagement = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleChange(event);
    }
  };

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Laptop",
      description: "Powerful laptop",
      price: 1200,
      stock: 10,
      category: "Electronics",
      vendor: "Tech Corp",
      image: "https://dummyimage.com/600x800/808080/fff.png",
    },
    {
      id: 2,
      name: "Smartphone",
      description: "Latest model with a great camera",
      price: 800,
      stock: 20,
      category: "Electronics",
      vendor: "Gadget World",
      image: "https://dummyimage.com/600x800/cccccc/000.png",
    },
    {
      id: 3,
      name: "Headphones",
      description: "Noise-canceling over-ear headphones",
      price: 200,
      stock: 50,
      category: "Accessories",
      vendor: "Audio Tech",
      image: "https://dummyimage.com/600x800/ffffff/000.png",
    },
    {
      id: 4,
      name: "Smartwatch",
      description: "Stylish smartwatch with fitness tracking",
      price: 250,
      stock: 15,
      category: "Wearables",
      vendor: "WearTech",
      image: "https://dummyimage.com/600x800/333333/fff.png",
    },
  ]);

  const [categories, setCategories] = useState([
    "Laptops",
    "Smartphones",
    "Headphones",
    "Smartwatches",
    "Accessories",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    vendor: "",
    image: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  //const [newCategory, setNewCategory] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setFormData(
      product || {
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        vendor: "",
        image: "",
      }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) return;

    if (selectedProduct) {
      // Edit existing product
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id ? { ...formData, id: p.id } : p
        )
      );
      setSuccessMessage("Product updated successfully!"); // Show edit message
    } else {
      // Add new product
      setProducts([...products, { ...formData, id: products.length + 1 }]);
      setSuccessMessage("Product added successfully!"); // Show add message
    }

    closeModal(); // Close the modal

    // Automatically hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setDeleteModalOpen(false);
    setSuccessMessage("Product deleted successfully!"); // Show success message

    // Automatically hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openCategoryModal = () => {
    // Navigate to the category management page
    navigate("/manage-categories");
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 lg:p-12 max-w-full sm:max-w-md md:max-w-lg lg:max-w-6xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Product Management
          </h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={openCategoryModal}
              className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 w-full sm:w-auto"
            >
              Manage Categories
            </button>

            <button
              onClick={() => openModal()}
              className="flex items-center justify-center bg-teal-500 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Product
            </button>
          </div>
        </div>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Vendor
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-700">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg shadow-md"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.vendor}
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <button
                    onClick={() => openModal(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-400 transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
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
              {/* <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
                Add New Product
              </h2> */}

              <form className="space-y-4">
                {/* Name Field */}
                <div className="flex flex-col">
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

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2">
                      <FiUpload /> Upload Image
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Description Field */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                  />
                </div>

                {/* Price & Stock Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
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
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
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
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vendor Field */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Vendor
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
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
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto max-h-[90vh] sm:max-h-[95vh] lg:max-h-screen overflow-auto"
          >
            <h3 className="text-xl font-semibold mb-4">Delete Product</h3>
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
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
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Message Popup */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          {successMessage}
        </motion.div>
      )}

      {categoryModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto max-h-[80vh] overflow-y-auto"
          >
            <AdminCategoryManagement />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
