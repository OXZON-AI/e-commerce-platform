import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
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
      url: "https://placehold.co/600x400/000000/FFFFFF/png",
      alt: "category image",
    },
    level: 0,
  });
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("faLaptop");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setCategoryData((prev) => ({
      ...prev,
      image: { ...prev.image, url: e.target.value },
    }));
  };

  const handleSubmit = () => {
    const { parent, level, ...rest } = categoryData;

    // If level is 0 then there not should be parent in category data which is send to backend
    const categoryPayload = level === 0 ? { ...rest } : { ...categoryData };

    dispatch(createCategory(categoryPayload));
    setCategoryData({
      name: "",
      description: "",
      parent: "",
      image: {
        url: "https://placehold.co/600x400/000000/FFFFFF/png",
        alt: "category image",
      },
      level: 0,
    });

    setSuccessMessage("Category added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        setSuccessMessage("Category deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  const handleEditCategory = (category) => {
    setEditCategory(category._id);
    setEditName(category.name);
    setEditIcon(category.icon);
  };

  const handleUpdateCategory = () => {
    dispatch(
      updateCategory({
        cid: editCategory,
        name: editName,
        icon: editIcon,
      })
    )
      .unwrap()
      .then(() => {
        setEditCategory(null);
        setEditName("");
        setEditIcon("faLaptop");
        setSuccessMessage("Category updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error updating category:", error);
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
          <ArrowLeft size={24} className="mr-2" /> Back to Product Management
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
          <input
            type="text"
            name="name"
            placeholder="Add new category"
            value={categoryData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
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

          <label>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={categoryData.image.url}
            onChange={handleImageChange}
          />
          {/* <select
            value={newIcon}
            onChange={handleChange}
            className="border p-3 rounded-lg w-48 focus:ring-2 focus:ring-blue-500"
          > */}
          {/* <select
            value={newIcon}
            onChange={(e) =>
              setNewIcon(
                iconOptions.find((icon) => icon.label === e.target.value).value
              )
            }
            className="border p-3 rounded-lg w-48 focus:ring-2 focus:ring-blue-500"
          >
            {iconOptions.map((icon) => (
              <option key={index} value={icon.value}>
                {icon.label}
              </option>
            ))}
          </select> */}
          <button
            onClick={handleSubmit}
            className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition w-full sm:w-auto"
          >
            <Plus size={18} />
          </button>
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
                  <img
                    src={category.image?.url || placeholderImage}
                    alt={category.image?.url || "category image"}
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                    className="text-xl w-[50px]"
                  />
                </td>
                <td className="border p-3 text-sm text-gray-700">
                  {editCategory === category._id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="border p-3 flex justify-center gap-4">
                  {editCategory === category._id ? (
                    <button
                      onClick={handleUpdateCategory}
                      className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
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
    </div>
    </div>
    </div>
    </div>
    
  );
}
