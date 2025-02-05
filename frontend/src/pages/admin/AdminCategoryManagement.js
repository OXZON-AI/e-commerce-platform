import { useState } from "react";
import { Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faMicrochip,
  faMemory,
  faTabletAlt,
  faServer,
  faDesktop,
  faBolt,
  faGamepad,
  faKeyboard,
  faMouse,
  faHeadphones,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const iconOptions = [
  { label: "Laptop", value: faLaptop },
  { label: "Processor", value: faMicrochip },
  { label: "Memory (RAM)", value: faMemory },
  { label: "Graphics Tablets", value: faTabletAlt },
  { label: "Motherboards", value: faServer },
  { label: "Graphics Card", value: faDesktop },
  { label: "Power Supply", value: faBolt },
  { label: "Gaming Consoles", value: faGamepad },
  { label: "Keyboards", value: faKeyboard },
  { label: "Mice", value: faMouse },
  { label: "Headphones", value: faHeadphones },
  { label: "Monitors", value: faTv },
];

export default function CategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", icon: faLaptop },
    { id: 2, name: "Processors", icon: faMicrochip },
    { id: 3, name: "Memory (RAM)", icon: faMemory },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [newIcon, setNewIcon] = useState(faLaptop);
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState(faLaptop);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        { id: Date.now(), name: newCategory, icon: newIcon },
      ]);
      setNewCategory("");
      setNewIcon(faLaptop);
      setSuccessMessage("Category added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
    setSuccessMessage("Category deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEditCategory = (category) => {
    setEditCategory(category.id);
    setEditName(category.name);
    setEditIcon(category.icon);
  };

  const handleUpdateCategory = () => {
    setCategories(
      categories.map((category) =>
        category.id === editCategory
          ? { ...category, name: editName, icon: editIcon }
          : category
      )
    );
    setEditCategory(null);
    setEditName("");
    setEditIcon(faLaptop);
    setSuccessMessage("Category updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
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
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <select
            value={newIcon}
            onChange={(e) =>
              setNewIcon(
                iconOptions.find((icon) => icon.label === e.target.value).value
              )
            }
            className="border p-3 rounded-lg w-48 focus:ring-2 focus:ring-blue-500"
          >
            {iconOptions.map((icon) => (
              <option key={icon.label} value={icon.label}>
                {icon.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCategory}
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
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="border p-3 text-center text-lg">
                  <FontAwesomeIcon icon={category.icon} className="text-xl" />
                </td>
                <td className="border p-3 text-sm text-gray-700">
                  {editCategory === category.id ? (
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
                  {editCategory === category.id ? (
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
                    onClick={() => handleDeleteCategory(category.id)}
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
  );
}
