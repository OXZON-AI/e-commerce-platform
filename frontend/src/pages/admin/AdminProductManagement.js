import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import placeholderImage from "../../assets/images/placeholder_image.png";
import { fetchCategories } from "../../store/slices/category-slice";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../store/slices/product-slice";
import AdminCategoryManagement from "./AdminCategoryManagement";
import ProductModal from "./Modals/ProductModal";
import DeleteModal from "./Modals/DeleteModal";

const AdminProductManagement = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.product);
  const { categories = [] } = useSelector((state) => state.categories);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorValidation, setErrorValidation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

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
            price: product.defaultVariant?.price || "",
            compareAtPrice: product.defaultVariant?.compareAtPrice || "",
            cost: product.defaultVariant?.cost || "",
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
            price: "",
            compareAtPrice: "",
            cost: "",
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

    const formattedProduct = {
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

    // Only send variants if creating a new product
    if (!isUpdating) {
      formattedProduct.variants = [
        {
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice
            ? parseFloat(formData.compareAtPrice)
            : undefined,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
          images: formData.image
            ? [{ url: formData.image, alt: "Product Image", isDefault: true }]
            : [],
          attributes: formData.attributes.filter(
            (attr) => attr.name && attr.value
          ),
          isDefault: formData.isDefault,
        },
      ];
    }

    try {
      if (isUpdating) {
        console.log("Updating product");
        await dispatch(
          updateProduct({ productId: selectedProduct._id, ...formattedProduct })
        ).unwrap();
        setSuccessMessage("Product updated successfully!");
      } else {
        console.log("Creating new product");
        await dispatch(createProduct(formattedProduct)).unwrap();
        setSuccessMessage("Product added successfully!");
      }

      dispatch(fetchProducts());
      closeModal();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorValidation("Error saving product : ", error);
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

          {/* <button
            onClick={() => openModal()}
            className="flex items-center justify-center bg-teal-500 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-600 focus:ring-4 focus:ring-teal-300"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Product
          </button> */}
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
                Brand
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product._id} className="border-t">
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
                  {product.description?.short || "N/A"}
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
