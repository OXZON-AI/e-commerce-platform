import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, ArrowLeft, Upload } from "lucide-react";
import { PuffLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../store/slices/category-slice";
import placeholderImage from "../../assets/images/placeholder_image.png";

import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";
import { Cloudinary } from "@cloudinary/url-gen/index";
import axios from "axios";
import DeleteModal from "./Modals/DeleteModal";

export default function AdminCategoryManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loadingCategories, errorCategory } = useSelector(
    (state) => state.categories
  );
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    parent: "",
    image: {
      url: "",
      alt: "category image",
    },
    level: 0,
  });
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsActive, setEditIsActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLocalPreview, setImageLocalPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setErrors({}); // clear error state on component mounting
    dispatch(fetchCategories());
  }, [dispatch]);

  // effect hook for asign error in state to servererror local state
  useEffect(() => {
    setServerError(errorCategory);
  });

  // setup cloudinary configuration
  const cld = new Cloudinary({
    cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME },
  });

  // Image upload to cloudinary & taking the URL handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    // set selected image to local state
    setSelectedImage(file);

    // Show local preview before upload
    const previewUrl = URL.createObjectURL(file);
    setImageLocalPreview(previewUrl); // For temporarily preview image

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

  // handler for set create form values to categoryData object
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  // handler for set image url inside categoryData object
  const handleImageChange = (e) => {
    setCategoryData((prev) => ({
      ...prev,
      image: { ...prev.image, url: e.target.value },
    }));
  };

  // Helper function to validate category create form
  const validateCategoryCreateForm = () => {
    const newErrors = {};

    if (!categoryData.name) {
      newErrors.name = "Name Required!";
    }

    if (!categoryData.description) {
      newErrors.description = "Description Required!";
    }

    if (!categoryData.image) {
      newErrors.image = "Image Required!";
    }

    if (!imageUrl) {
      newErrors.image = "Image Required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; //If newErrors has no keys (i.e., it's an empty object {}), it returns true. If newErrors has at least one key (i.e., it contains errors), it returns false.
  };

  // Helper function to validate category update form
  const validateCategoryUpdateForm = () => {
    const newErrors = {};

    if (!editName) {
      newErrors.updateName = "Name Required!";
    }

    if (!editDescription) {
      newErrors.updateDescription = "Description Required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; //If newErrors has no keys (i.e., it's an empty object {}), it returns true. If newErrors has at least one key (i.e., it contains errors), it returns false.
  };

  // handler for creating new category
  const handleSubmit = () => {
    // clear previous error state
    setErrors({});

    // calling form validation handler
    if (!validateCategoryCreateForm()) {
      return;
    }

    // format new category object with relavant data
    const formattedCategoryData = {
      name: categoryData.name,
      description: categoryData.description,
      parent: "",
      image: {
        url: imageUrl,
        alt: "category image",
      },
      level: 0,
    };

    const { parent, level, ...rest } = formattedCategoryData;

    // If level is 0 then there not should be parent in category data which is send to backend
    const categoryPayload = level === 0 ? { ...rest } : { ...categoryData };

    dispatch(createCategory(categoryPayload))
      .then(() => {
        setCategoryData({
          name: "",
          description: "",
          parent: "",
          image: {
            url: "",
            alt: "category image",
          },
          level: 0,
        });

        setImageUrl("");
        setSelectedImage(null);
        setImageLocalPreview("");
        setSuccessMessage("Category added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        dispatch(fetchCategories());
      })
      .catch((error) => {
        console.error("Error creating category: ", error);
      });
  };

  // handler for set category id to editCategory
  const handleEditCategory = (category) => {
    setEditCategory(category._id);
    setEditName(category.name);
    setEditDescription(category.description);
    setEditIsActive(category.isActive);
  };

  // handler for update a category
  const handleUpdateCategory = () => {
    // clear previous error state
    setErrors({});

    // calling form validation handler
    if (!validateCategoryUpdateForm()) {
      return;
    }

    dispatch(
      updateCategory({
        cid: editCategory,
        name: editName,
        description: editDescription,
        image: {
          url: imageUrl ? imageUrl : undefined,
          alt: "category image",
        },
        isActive: editIsActive,
      })
    )
      .unwrap()
      .then(() => {
        setImageUrl("");
        setSelectedImage(null);
        setImageLocalPreview("");
        setEditCategory(null);
        setEditName("");
        setEditDescription("");
        setEditIsActive(false);
        setSuccessMessage("Category updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        dispatch(fetchCategories());
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  // Cancel update form
  const closeUpdateForm = () => {
    setEditCategory(null);
  };

  // Handler for category active status toggle button
  const handleToggle = (categoryStatus) => {
    if (categoryStatus === false) {
      setEditIsActive(true);
    } else {
      setEditIsActive(false);
    }

    console.log("Toggled category active status : ", editIsActive);
  };

  // handler for open delete modal
  const openDeleteModal = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setDeleteModalOpen(true);
  };

  // handler for close delete modal
  const closeDeleteModal = () => {
    setServerError(""); // clear server errors when modal close
    setDeleteModalOpen(false);
  };

  // handler for delete a category
  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        setDeleteCategoryId(null);
        setDeleteModalOpen(false);
        setSuccessMessage("Category deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
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
            <div className="w-full max-w-full bg-white shadow-md rounded-none p-8">
              <button
                onClick={() => navigate("/admin-product")}
                className="flex items-center mb-6 text-purple-500 hover:text-purple-600 transition text-base font-semibold"
              >
                <ArrowLeft size={24} className="mr-2" /> Back to Product
                Management
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                Manage Categories
              </h2>
              {successMessage && (
                <div className="fixed bottom-4 right-4 mb-4 p-3 text-green-800 bg-green-200 rounded-lg text-center shadow-lg">
                  {successMessage}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
                <input
                  type="text"
                  name="name"
                  placeholder="Add new category"
                  value={categoryData.name}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <input
                  type="text"
                  name="description"
                  placeholder="Add Description"
                  value={categoryData.description}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                {/* <label>Parent Category:</label>
          <select
            name="parent"
            value={categoryData.parent}
            onChange={handleChange}
          >
            <option value="">None</option>
            {categories.map((category, index) => (
              <option key={category._id || index} value={category._id}>
                {category.name}
              </option>
            ))}
          </select> */}
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
                {/* Image upload button */}
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
                    <span className="text-gray-700">Upload Category Image</span>
                  </label>

                  {/* Show preview near input */}
                  {imageLocalPreview && (
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                      <img
                        src={imageLocalPreview}
                        alt="Selected"
                        className="w-10 h-10 rounded-full border border-gray-400 object-cover"
                      />
                    </div>
                  )}
                </div>

                {selectedImage && !imageUrl ? (
                  <PuffLoader size={30} color="#9333ea" />
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition w-full sm:w-auto"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>

              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-3 text-left text-sm font-medium text-gray-600">
                      Icon
                    </th>
                    <th className="border p-3 text-left text-sm font-medium text-gray-600">
                      Category Name
                    </th>
                    <th className="border p-3 text-left text-sm font-medium text-gray-600">
                      Category Description
                    </th>
                    <th className="border p-3 text-left text-sm font-medium text-gray-600">
                      Active Status
                    </th>
                    <th className="border p-3 text-left text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category._id || index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="border p-3 text-center text-lg">
                        {/* <FontAwesomeIcon icon={category.icon} className="text-xl" /> */}
                        {editCategory === category._id ? (
                          <div className="relative w-12">
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
                              {/* <span className="text-gray-700">
                                Upload Category Image
                              </span> */}
                            </label>

                            {/* Show preview near input */}
                            {imageLocalPreview && (
                              <div className="absolute top-1/2 justify-center transform -translate-y-1/2">
                                <img
                                  src={imageLocalPreview}
                                  alt="Selected"
                                  className="w-10 h-10 border rounded-2 m-auto border-gray-400 object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <img
                            src={category.image?.url || placeholderImage}
                            alt={category.image?.url || "category image"}
                            onError={(e) => {
                              e.target.src = placeholderImage;
                            }}
                            className="text-xl w-[50px]"
                          />
                        )}
                      </td>
                      <td className="border p-3 text-sm text-gray-700">
                        {editCategory === category._id ? (
                          <>
                            {errors.updateName && (
                              <p className="text-red-500 text-sm">
                                {errors.updateName}
                              </p>
                            )}
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                            />
                          </>
                        ) : (
                          category.name
                        )}
                      </td>
                      <td className="border p-3 text-sm text-gray-700">
                        {editCategory === category._id ? (
                          <>
                            {errors.updateDescription && (
                              <p className="text-red-500 text-sm">
                                {errors.updateDescription}
                              </p>
                            )}
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                            />
                          </>
                        ) : (
                          category.description
                        )}
                      </td>
                      <td className="border p-3 text-sm text-gray-700">
                        {editCategory === category._id ? (
                          <>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editIsActive}
                                onChange={() => handleToggle(editIsActive)}
                                className="sr-only peer"
                              />
                              <div
                                className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer
                                  peer-checked:bg-green-500 peer-checked:after:translate-x-5
                                  after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white
                                  after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}
                              ></div>
                            </label>
                          </>
                        ) : category.isActive ? (
                          "🟢 Active"
                        ) : (
                          "🟡 Inactive"
                        )}
                      </td>
                      <td className="border p-3 flex justify-center gap-4 items-center">
                        {editCategory === category._id ? ( // If the editCategory has id then show save button otherwise edit button
                          selectedImage && !imageUrl ? ( // If image selected and still imageUrl not recieved from cloudinary then show waiting spinner. otherwise show add category button
                            <PuffLoader size={30} color="#9333ea" />
                          ) : (
                            <>
                              <button
                                onClick={handleUpdateCategory}
                                className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={closeUpdateForm}
                                className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
                              >
                                Cancel
                              </button>
                            </>
                          )
                        ) : (
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => openDeleteModal(category._id)}
                          className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {deleteModalOpen && (
              <DeleteModal
                loading={loadingCategories}
                deleteModalOpen={deleteModalOpen}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDeleteCategory}
                categoryId={deleteCategoryId} // add category id
                serverError={serverError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
