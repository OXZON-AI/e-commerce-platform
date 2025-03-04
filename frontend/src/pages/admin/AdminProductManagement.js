import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";

// imports for cloudinary image upload
import { Cloudinary } from "@cloudinary/url-gen";

// import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import placeholderImage from "../../assets/images/placeholder_image.png";
import {
  clearBrands,
  clearProductDetail,
  clearProductError,
  clearProducts,
  fetchProductDetails,
} from "../../store/slices/product-slice";
import { fetchCategories } from "../../store/slices/category-slice";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../store/slices/product-slice";
import ProductModal from "./Modals/ProductModal";
import DeleteModal from "./Modals/DeleteModal";
import { updateVariant } from "../../store/slices/variant-slice";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

const AdminProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items = [],
    pagination,
    brands = [],
    productDetail,
    loading,
    error,
  } = useSelector((state) => state.product);
  const { categories = [] } = useSelector((state) => state.categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [errorValidation, setErrorValidation] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLocalPreview, setImageLocalPreview] = useState("");
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
    images: [{ url: "", alt: "", isDefault: true }],
    attributes: [{ name: "color", value: "" }],
    isDefault: true,
  });
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

  // setup cloudinary configuration
  const cld = new Cloudinary({
    cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME },
  });

  // Image Upload Handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    // set selected image to local state
    setSelectedImage(file);

    // Show local preview before upload
    const previewUrl = URL.createObjectURL(file);
    setImageLocalPreview(previewUrl); // Temporarily show preview image

    const imgFormData = new FormData();
    imgFormData.append("file", file);
    imgFormData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    ); // Set in Cloudinary settings

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        imgFormData
      );

      setImageUrl(response.data.secure_url); // take saved image url in Cloudinary
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  // effect hook for asign error in state to servererror local state
  useEffect(() => {
    setServerError(error);
  }, [error]);

  useEffect(() => {
    const filterQuery = buildFilters(filters);
    dispatch(fetchProducts(filterQuery));

    // Cleanup function to clear products when component unmounts or filters change
    return () => {
      dispatch(clearProducts()); // This is called whenever the component is about to unmount or when the filters object changes. This is useful for clearing any previous product data before new products are fetched based on updated filters.
      dispatch(clearProductError());
    };
  }, [dispatch, filters]);

  // Effect hook to fetch selected product details and set form data if update. if create formdata empty
  useEffect(() => {
    if (productDetail) {
      setFormData({
        name: productDetail?.name || "",
        slug: productDetail?.slug || "",
        shortDescription: productDetail?.description?.short || "",
        detailedDescription: productDetail?.description?.detailed || "",
        price: productDetail?.variants[0]?.price || null,
        compareAtPrice: productDetail?.variants[0]?.compareAtPrice || null,
        cost: productDetail?.variants[0]?.cost || null,
        stock: productDetail?.variants[0]?.stock || null,
        category: productDetail?.category?._id || "",
        brand: productDetail?.brand || "",
        images: productDetail?.variants[0]?.images || [],
        attributes: productDetail?.variants[0]?.attributes || [],
        isDefault: productDetail?.variants[0]?.isDefault,
      });
    } else {
      setFormData({
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
        images: [{ url: "", alt: "", isDefault: true }],
        attributes: [{ name: "color", value: "" }],
        isDefault: true,
      });
    }
  }, [productDetail]);

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
    const parsedPage = Number(newPage);
    if (
      isNaN(parsedPage) ||
      parsedPage < 1 ||
      parsedPage > pagination.totalPages
    )
      return; // Prevent invalid pages and prevent not number page value
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const openModal = (productSlug = null) => {
    dispatch(clearProductDetail()); // Always clear previous data first

    // get selected product details fom product details endpoint for update form input details only
    if (productSlug) {
      dispatch(fetchProductDetails(productSlug)); // // If editing a product, fetch its details
      console.log("select-prod-detail :::: ", productDetail);
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    if (productDetail) {
      dispatch(clearProductDetail());
    }

    // clear server error
    setServerError("");
    setSelectedImage(null);
    setImageUrl("");
    setImageLocalPreview("");

    // clear the form
    setFormData({
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
      images: [{ url: "", alt: "", isDefault: true }],
      attributes: [{ name: "color", value: "" }],
      isDefault: true,
    });

    setErrorValidation("");
    dispatch(clearProductError());
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (index, e) => {
    const { name, value } = e.target;
    // Create a new array with updated attributes
    const updatedAttributes = formData.attributes.map((attr, i) =>
      i === index ? { ...attr, [name]: value } : attr
    );
    setFormData({
      ...formData,
      attributes: updatedAttributes,
      toChange: { attributes: updatedAttributes },
    });
  };

  // Allow users to add more attribute fields
  const addAttributeField = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { name: "", value: "" }],
      toAdd: {
        attributes: [
          ...(formData.toAdd?.attributes || []),
          { name: "", value: "" },
        ],
      },
    });
  };

  // Let users remove an attribute if necessary
  const removeAttributeField = (index) => {
    const updatedAttributes = formData.attributes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attributes: updatedAttributes,
      toRemove: {
        attributes: [
          ...(formData.toRemove?.attributes || []),
          formData.attributes[index]._id,
        ],
      },
    });
  };

  const validateCreateForm = (formData) => {
    if (
      !formData.name ||
      !formData.shortDescription ||
      !formData.category ||
      !formData.brand
    ) {
      alert(
        "All required fields (name, short description, category, brand) must be filled!"
      );
      return false;
    }

    if (!formData.price || !formData.cost || !formData.compareAtPrice) {
      alert("Each product must have price, compareAtPrice, and cost!");
      return false;
    }

    if (parseFloat(formData.price) >= parseFloat(formData.compareAtPrice)) {
      alert("Price must be less than compareAtPrice!");
      return false;
    }

    if (!formData.images) {
      alert("Each product must have at least one image!");
      return false;
    }

    if (!imageUrl) {
      alert("Product Image Required!");
      return false;
    }

    return true;
  };

  const validateUpdateForm = (formData) => {
    if (!formData.price || !formData.compareAtPrice) {
      alert("Both price and compareAtPrice are required!");
      return false;
    }

    const price = parseFloat(formData.price);
    const compareAtPrice = parseFloat(formData.compareAtPrice);

    if (price > compareAtPrice) {
      alert("Price cannot be greater than CompareAtPrice");
      return false;
    }
    return true;
  };

  // Add the useEffect to fetch products when filters change
useEffect(() => {
  const filterQuery = buildFilters(filters);
  console.log("Fetching products with filters:", filters);
  dispatch(fetchProducts(filterQuery));
}, [filters, dispatch]);

  // Handler for create or update product
  const handleSave = async () => {
    console.log("handleSave called");
    console.log("Form Data:", formData);

    // Clear local image preview state
    setImageLocalPreview("");

    // update or not
    const isUpdating = !!productDetail;
    console.log("isUpdating : ", isUpdating);

    // Create from validate
    if (!isUpdating) {
      if (!validateCreateForm(formData)) return;
    }

    // Update form validate
    if (isUpdating) {
      if (!validateUpdateForm(formData)) return;
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
              images: imageUrl
                ? [
                    {
                      url: imageUrl,
                      alt: "Product Image",
                      isDefault: true,
                    },
                  ]
                : [],
              // images: formData.image
              //   ? [
              //       {
              //         url: formData.image,
              //         alt: "Product Image",
              //         isDefault: true,
              //       },
              //     ]
              //   : [],
              attributes: formData.attributes.filter(
                (attr) => attr.name && attr.value
              ),
              isDefault: formData.isDefault,
              ...(isUpdating && { stock: parseInt(formData.stock) || 0 }), // Only add stock when updating
            },
          ],
        };

        await dispatch(createProduct(formattedNewProduct)).unwrap();

        setSuccessMessage("Product added successfully!");
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
            productId: productDetail._id,
            ...formattedUpdateProduct,
          })
        ).unwrap();

        console.log("product-details: ", productDetail);
        console.log("product variant: ", !!productDetail.variants[0]._id);

        // Update variant separately if needed
        if (productDetail.variants?.[0]?._id) {
          // Separate existing attributes and new attributes
          const existingAttributes =
            formData.attributes?.filter((attr) => attr._id) || [];
          const newAttributes =
            formData.attributes?.filter((attr) => !attr._id) || [];

          // Get default image id
          const imgId = productDetail.variants[0].images[0]._id;

          // format selected product variant for backend
          const updatedVariant = {
            productId: productDetail._id,
            variantId: productDetail.variants?.[0]?._id,
            price: parseFloat(formData.price),
            compareAtPrice: formData.compareAtPrice
              ? parseFloat(formData.compareAtPrice)
              : undefined,
            cost: formData.cost ? parseFloat(formData.cost) : undefined,
            stock: parseInt(formData.stock) || 0,
            isDefault: formData.isDefault,
            // Include attributes and images - Only send new attributes & images to `toAdd`
            toAdd: {
              attributes: newAttributes.length
                ? newAttributes.map((attr) => ({
                    name: attr.name,
                    value: attr.value,
                  }))
                : undefined,
              images: formData.toAdd?.images?.length
                ? formData.toAdd.images
                : [],
            },
            // Only send existing attributes to `toChange`
            toChange: {
              attributes: existingAttributes.length
                ? existingAttributes.map((attr) => ({
                    id: attr._id,
                    name: attr.name,
                    value: attr.value,
                  }))
                : undefined,
              images: imageUrl
                ? [
                    {
                      id: imgId,
                      url: imageUrl,
                      alt: "Product Image",
                      isDefault: true,
                    },
                  ]
                : [],
              // images: formData.toChange?.images?.length
              //   ? formData.toChange.images
              //   : [],
            },
            toRemove: {
              // Remove empty or null attributes from `toRemove`
              attributes:
                formData.toRemove?.attributes?.filter((attr) => attr) ||
                undefined,
              images:
                formData.toRemove?.images?.filter((img) => img) || undefined,
            },
            // image: formData.image
            //   ? [{ url: formData.image, alt: "Product Image", isDefault: true }]
            //   : [],
            // attributes: formData.attributes.filter(
            //   (attr) => attr.name && attr.value
            // ),
          };

          console.log("updatd variant details : ", updatedVariant);

          await dispatch(updateVariant(updatedVariant)).unwrap();

          // Clear toAdd, toChange, and toRemove after update
          setFormData((prevData) => ({
            ...prevData,
            toAdd: {},
            toChange: {},
            toRemove: {},
          }));
        }

        setSuccessMessage("Product updated successfully!");
      }

      const filterQuery = buildFilters(filters);
      setSelectedImage(null);
      setImageUrl("");
      setImageLocalPreview("");
      await dispatch(fetchProducts(filterQuery));
      closeModal();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving product : ", err);
    }
  };
  const openDeleteModal = (productId) => {
    setDeleteProductId(productId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setServerError(""); // clear server errors when modal close
    setDeleteModalOpen(false);
  };

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      setDeleteProductId(null);
      setDeleteModalOpen(false);
      setSuccessMessage("Product deleted successfully!");
      const filterQuery = buildFilters(filters);
      await dispatch(fetchProducts(filterQuery)); // filters is need cuz pagination work properly
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.log("Error deleting product : ", err);
    }
  };

  const openCategoryModal = () => {
    // Navigate to the category management page
    navigate("/manage-categories");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Admin Navbar placed on top */}
      <AdminNavbar />

      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 p-0 overflow-y-auto">
          <div className="p-0 sm:p-8 md:p-10 lg:p-12 w-full mx-auto">
            <div className="bg-white shadow-xl rounded-none p-6">
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
                          priceRange: [
                            Number(e.target.value),
                            prev.priceRange[1],
                          ],
                          page: 1,
                        }))
                      }
                      className="px-3 py-2 border rounded-md w-30"
                      placeholder="Min Price"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [
                            prev.priceRange[0],
                            Number(e.target.value),
                          ],
                          page: 1,
                        }))
                      }
                      className="px-3 py-2 border rounded-md w-30"
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

              {loading ? (
                // Show Loading State with Centered HashLoader
                <div className="flex flex-col justify-center items-center py-[50px] mx-auto text-gray-700 font-semibold">
                  <HashLoader color="#a855f7" size={50} />
                  <span className="mt-3">Loading products...</span>
                </div>
              ) : serverError ? (
                // Show Error Message Instead of Table
                <div className="text-center my-[50px] text-red-600 font-semibold bg-red-100 p-3 rounded-lg">
                  <span className="mt-3">Error: {serverError}</span>
                </div>
              ) : (
                // Show Table Only If There’s No Loading/Error -----------------------------------------------------------------
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Active Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((product, index) => (
                      <tr key={product._id} className="border-t">
                        <td className="px-6 py-4 text-sm text-gray-700">
                        {(filters.page - 1) * filters.limit + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <img
                            src={
                              product.defaultVariant?.image?.url ||
                              placeholderImage
                            }
                            alt={
                              product.defaultVariant?.image?.alt ||
                              "Product Image"
                            }
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
                            <span className="text-gray-700">
                              Description Provided
                            </span>
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
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {product.isActive === true
                            ? "🟢 Active"
                            : product.isActive === false
                            ? "🟡 Inactive"
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-right space-x-2">
                          <button
                            onClick={() => openModal(product.slug)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-400 transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="flex justify-end items-center mt-4 space-x-4">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className={
                    "px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                  }
                >
                  Previous
                </button>

                {/* Page Indicator */}
                <span className="text-gray-700">
                  Page {filters.page} of {pagination.totalPages}
                </span>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= pagination.totalPages}
                  className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {modalOpen && (
              <ProductModal
                loading={loading}
                isOpen={openModal}
                onClose={closeModal}
                productDetail={productDetail}
                formData={formData}
                handleChange={handleChange}
                handleAttributeChange={handleAttributeChange}
                handleSave={handleSave}
                errorValidation={errorValidation}
                serverError={serverError}
                categories={categories}
                setFormData={setFormData}
                addAttributeField={addAttributeField}
                removeAttributeField={removeAttributeField}
                imageLocalPreview={imageLocalPreview}
                handleImageUpload={handleImageUpload}
                selectedImage={selectedImage}
                imageUrl={imageUrl}
              />
            )}

            {deleteModalOpen && (
              <DeleteModal
                loading={loading}
                deleteModalOpen={deleteModalOpen}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
                productId={deleteProductId}
                serverError={serverError}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductManagement;
