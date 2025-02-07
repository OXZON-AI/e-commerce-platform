import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import placeholderImage from "../../assets/images/placeholder_image.png";
import {
  clearBrands,
  clearProductError,
  clearProducts,
} from "../../store/slices/product-slice";
import { fetchCategories } from "../../store/slices/category-slice";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../store/slices/product-slice";
import AdminCategoryManagement from "./AdminCategoryManagement";
import ProductModal from "./Modals/ProductCreateModal";
import DeleteModal from "./Modals/DeleteModal";
import { createVariant, updateVariant } from "../../store/slices/variant-slice";

const AdminProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items = [],
    brands = [],
    loading,
    error,
  } = useSelector((state) => state.product);
  const {
    categories = [],
    loadingCategories,
    errorCategory,
  } = useSelector((state) => state.categories);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorValidation, setErrorValidation] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "All Categories",
    brand: "All Brands",
    sortBy: "", // Field to sort by (ratings or price)
    sortOrder: "", // Sort order (ascending or descending)
    priceRange: [0, 1000000], // Price range filter (min, max)
    page: 1, // Current page for pagination
    limit: 10, // Number of products per page
  });

  console.log("selected product : ", selectedProduct);

  const buildFilters = (filters) => {
    const query = {};

    if (filters.search) query.search = filters.search.trim();
    if (filters.category && filters.category !== "All Categories")
      query.category = filters.category.trim();
    if (filters.brand && filters.brand !== "All Brands")
      query.brand = filters.brand.trim();
    if (filters.sortBy) {
      query.sortBy = filters.sortBy.trim();
      query.sortOrder = filters.sortOrder
        ? filters.sortOrder.trim()
        : undefined;
    }
    if (filters.priceRange[0] < filters.priceRange[1])
      query.minPrice = filters.priceRange[0];
    if (filters.priceRange[1]) query.maxPrice = filters.priceRange[1];

    query.page = filters.page;
    query.limit = filters.limit;

    return query;
  };

  useEffect(() => {
    const filterQuery = buildFilters(filters);
    dispatch(fetchProducts(filterQuery));

    // Cleanup function to clear products when component unmounts or filters change
    return () => {
      dispatch(clearProducts()); // This is called whenever the component is about to unmount or when the filters object changes. This is useful for clearing any previous product data before new products are fetched based on updated filters.
      clearProductError();
    };
  }, [dispatch, filters]);

  // Effect hook to fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories()); // Dispatch the fetchCategories action
  }, [dispatch]);

  // Clear brands when the component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearBrands());
    };
  }, [dispatch]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1) return; // Prevent going below page 1
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const isNextPageDisabled = items.length < 10; // If the length of the current items is less than 10, disable next

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    detailedDescription: "",
    price: "",
    compareAtPrice: "",
    cost: "",
    category: "",
    brand: "",
    image: "",
    attributes: [{ name: "color", value: "" }],
    isDefault: true,
  });

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setFormData(
      product
        ? {
            name: product.name || "",
            slug: product.slug || "",
            shortDescription: product.description?.short || "",
            detailedDescription: product.description?.detailed || "",
            price: product.defaultVariant?.price || null,
            compareAtPrice: product.defaultVariant?.compareAtPrice || null,
            cost: product.defaultVariant?.cost || null,
            stock: product.defaultVariant?.stock || null,
            category: product.category?._id || "",
            brand: product.brand || "",
            image: product.defaultVariant?.image?.url || "",
            attributes: product.defaultVariant?.attributes || [],
            isDefault: product.defaultVariant?.isDefault,
          }
        : {
            name: "",
            slug: "",
            shortDescription: "",
            detailedDescription: "",
            price: null,
            compareAtPrice: null,
            cost: null,
            stock: null,
            category: "",
            brand: "",
            image: "",
            attributes: [{ name: "color", value: "" }],
            isDefault: true,
          }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setErrorValidation("");
    clearProductError();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (index, e) => {
    const newAttributes = [...formData.attributes];
    newAttributes[index][e.target.name] = e.target.value;
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleSave = async () => {
    console.log("handleSave called");
    console.log("Form Data:", formData);

    // Check if we are updating or creating a product
    const isUpdating = !!selectedProduct;

    // Separate validation logic for Create & Update
    if (!formData.name || !formData.shortDescription || !formData.category) {
      setErrorValidation("Missing required fields");
      return;
    }

    if (!isUpdating && (!formData.price || !formData.image)) {
      setErrorValidation("For new products, price and image are required");
      return;
    }

    if (!isUpdating && !formData.detailedDescription?.trim()) {
      setErrorValidation("Detailed description is required for new products");
      return;
    }

    try {

      // if create new product
      if (!isUpdating) {
        console.log("Creating new product");

        // format new product for backend
        const formattedNewProduct = {
          name: formData.name,
          description: {
            short: formData.shortDescription,
            ...(formData.detailedDescription?.trim() && {
              detailed: formData.detailedDescription,
            }), // Only include if detailedDescription not empty
          },
          category: formData.category,
          brand: formData.brand,
          variants: [
            {
              price: parseFloat(formData.price),
              compareAtPrice: formData.compareAtPrice
                ? parseFloat(formData.compareAtPrice)
                : undefined,
              cost: formData.cost ? parseFloat(formData.cost) : undefined,
              images: formData.image
                ? [
                    {
                      url: formData.image,
                      alt: "Product Image",
                      isDefault: true,
                    },
                  ]
                : [],
              attributes: formData.attributes.filter(
                (attr) => attr.name && attr.value
              ),
              isDefault: formData.isDefault,
              ...(isUpdating && { stock: parseInt(formData.stock) || 0 }), // Only add stock when updating
            },
          ],
        };

        await dispatch(createProduct(formattedNewProduct)).unwrap();

        setSuccessMessage("Product and variant added successfully!");
      }

      // If update product
      if (isUpdating) {
        console.log("Updating product");

        // format selected product for backend
        const formattedUpdateProduct = {
          name: formData.name,
          description: {
            short: formData.shortDescription,
            ...(formData.detailedDescription?.trim() && {
              detailed: formData.detailedDescription,
            }), // Only include if detailedDescription not empty
          },
          category: formData.category,
          brand: formData.brand,
        };

        // update product
        await dispatch(
          updateProduct({
            productId: selectedProduct._id,
            ...formattedUpdateProduct,
          })
        ).unwrap();

        // Update variant separately if needed
        if (selectedProduct.defaultVariant._id) {
          // format selected product variant for backend
          const updatedVariant = {
            productId: selectedProduct._id,
            variantId: selectedProduct.defaultVariant._id,
            price: parseFloat(formData.price),
            compareAtPrice: formData.compareAtPrice
              ? parseFloat(formData.compareAtPrice)
              : undefined,
            cost: formData.cost ? parseFloat(formData.cost) : undefined,
            // stock: parseInt(formData.stock) || 0,
            // image: formData.image
            //   ? [{ url: formData.image, alt: "Product Image", isDefault: true }]
            //   : [],
            // attributes: formData.attributes.filter(
            //   (attr) => attr.name && attr.value
            // ),
            isDefault: formData.isDefault,
          };

          await dispatch(updateVariant(updatedVariant)).unwrap();
        }

        setSuccessMessage("Product updated successfully!");
      }

      dispatch(fetchProducts());
      closeModal();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving product : ", err);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    await dispatch(deleteProduct(selectedProduct._id)).unwrap();
    setDeleteModalOpen(false);
    setSuccessMessage("Product deleted successfully!");
    dispatch(fetchProducts());
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

        {/* Filters -----------------------------------------------------------------*/}
        <div className="p-4 bg-gray-100 rounded-lg">
          {/* Top Row: Search, Price Range, Reset */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
              className="px-3 py-2 border rounded-md w-60"
            />

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [Number(e.target.value), prev.priceRange[1]],
                    page: 1,
                  }))
                }
                className="px-3 py-2 border rounded-md w-24"
                placeholder="Min Price"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], Number(e.target.value)],
                    page: 1,
                  }))
                }
                className="px-3 py-2 border rounded-md w-24"
                placeholder="Max Price"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  category: "All Categories",
                  brand: "All Brands",
                  sortBy: "",
                  sortOrder: "",
                  priceRange: [0, 1000000],
                  page: 1,
                  limit: 10,
                })
              }
              className="px-4 py-2 bg-purple-500 text-white rounded-md"
            >
              Reset All Filters
            </button>
          </div>

          {/* Bottom Row: Category, Brand, Sorting, Order */}
          <div className="flex justify-between items-center gap-4 mb-4">
            {/* Category Dropdown */}
            <div className="flex-1">
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value,
                    page: 1,
                  }))
                }
                className="px-3 py-2 border rounded-md w-full"
              >
                <option>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div className="flex-1">
              <select
                value={filters.brand}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    brand: e.target.value,
                    page: 1,
                  }))
                }
                className="px-3 py-2 border rounded-md w-full"
              >
                <option>All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex-1">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value,
                    page: 1,
                  }))
                }
                className="px-3 py-2 border rounded-md w-full"
              >
                <option value="">Sort By</option>
                <option value="ratings">Ratings</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Sort Order Dropdown */}
            <div className="flex-1">
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortOrder: e.target.value,
                    page: 1,
                  }))
                }
                className="px-3 py-2 border rounded-md w-full"
                disabled={!filters.sortBy}
              >
                <option value="">Order</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table -----------------------------------------------------------------*/}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                No.
              </th>
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
                Brand
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((product, index) => (
              <tr key={product._id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <img
                    src={product.defaultVariant?.image?.url || placeholderImage}
                    alt={product.defaultVariant?.image?.alt || "Product Image"}
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                    className="w-12 h-12 object-cover rounded-lg shadow-md"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.description?.short ? (
                    <span className="text-gray-700">Description Provided</span>
                  ) : (
                    <span className="text-yellow-500">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.defaultVariant?.price || "N/A"} MVR
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.defaultVariant?.stock || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.category?.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.brand || "N/A"}
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
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-gray-300 rounded-md mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {filters.page}</span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={isNextPageDisabled}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {modalOpen && (
        <ProductModal
          isOpen={openModal}
          onClose={closeModal}
          selectedProduct={selectedProduct}
          formData={formData}
          handleChange={handleChange}
          handleAttributeChange={handleAttributeChange}
          handleSave={handleSave}
          errorValidation={errorValidation}
          error={error}
          categories={categories}
          setFormData={setFormData}
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          handleDelete={handleDelete}
        />
      )}

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
