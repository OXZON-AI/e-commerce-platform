import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa"; // Icons
import AdminNavbar from "./components/AdminNavbar"; // Assuming this is already created
import Sidebar from "./components/Sidebar"; // Assuming this is already created
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewsletters,
  publishNewsletter,
  uploadImage,
} from "../../store/slices/news-slice";

function AdminNewsletter() {
  const dispatch = useDispatch();
  const { newsletters, totalNews, status, imageUrl, error } = useSelector(
    (state) => state.news
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "date",
    sortOrder: "desc",
  });
  const [search, setSearch] = useState("");

  // Effect hook for fetch newsletters from the backend
  useEffect(() => {
    dispatch(fetchNewsletters(filters));
  }, [dispatch, filters]);

  // Handle newsletter submission (upload image & publish)
  const handlePublish = async () => {
    if (!title || !body || !imageUrl) {
      alert("Please fill in all fields before publishing.");
      return;
    }

    try {
      dispatch(publishNewsletter({ title, body, image: imageUrl }))
        .unwrap()
        .then(() => {
          alert("Newsletter published successfully!");
          setIsModalOpen(false);
          dispatch(fetchNewsletters(filters)); // Refresh data
        })
        .catch((err) => alert(err));
    } catch (error) {
      console.error("Error publishing newsletter", error);
      alert("Failed to publish the newsletter");
    }
  };

  // Handle image upload and set the image URL
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    console.log("image file : ", file);

    // Check if a file was selected and validate if it's an image (optional)
    if (file) {
      const fileType = file.type.split("/")[0]; // Get the type (image, video, etc.)
      if (fileType !== "image") {
        alert("Please select a valid image file.");
        return;
      }

      // Dispatch the action to upload the image
      dispatch(uploadImage(file)).unwrap();
    } else {
      alert("No file selected.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar on Top */}
      <AdminNavbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-0 overflow-y-auto">
          <div className="p-0 sm:p-8 md:p-10 lg:p-12 w-full mx-auto">
            <div className="p-6 space-y-6 bg-gray-50">
              {/* Page Title */}
              <h2 className="text-4xl font-bold text-gray-800 text-center">
                Manage Newsletters
              </h2>

              {/* Search Options */}
              <div className="flex flex-wrap justify-between items-center gap-6 p-6 bg-white shadow-sm rounded-lg">
                {/* Search Input */}
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="text"
                    placeholder="Search newsletters..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  />
                  <button className="flex items-center justify-center w-36 px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                    <FaSearch className="mr-2" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Add Newsletter Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center w-full px-5 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition mt-6"
              >
                <FaPlus className="mr-2" />
                <span>Add Newsletter</span>
              </button>

              {/* Newsletters Table */}
              <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                <thead className="bg-gray-100 text-base">
                  <tr>
                    <th className="p-4 text-left">Index</th>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Image</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters &&
                    newsletters.map((news, index) => {
                      const currentIndex =
                        (filters.page - 1) * filters.limit + index + 1;

                      return (
                        <tr
                          key={news._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-4 px-6 text-gray-800">
                            {currentIndex}
                          </td>
                          <td className="p-4">{news.title}</td>
                          <td className="p-4">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-end items-center mt-4 space-x-4">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Page Indicator */}
                <span className="text-gray-700">Page {filters.page}</span>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={newsletters?.length < filters.limit}
                  className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              {/* Modal for Publishing Newsletter */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      &times;
                    </button>
                    <h3 className="text-xl font-semibold mb-4">
                      Publish Newsletter
                    </h3>

                    {/* Form to submit newsletter */}
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium"
                        >
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Enter newsletter title"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="body"
                          className="block text-sm font-medium"
                        >
                          Body
                        </label>
                        <textarea
                          id="body"
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Enter newsletter body"
                        ></textarea>
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium mb-2"
                        >
                          Image
                        </label>
                        <div className="flex justify-center items-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg">
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="text-gray-500">
                            Click to choose a file
                          </div>
                        </div>
                        {imageUrl && (
                          <div className="mt-4 text-center">
                            <img
                              src={imageUrl}
                              alt="Uploaded"
                              className="w-24 h-24 object-cover rounded-full mx-auto"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handlePublish}
                        className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Publish Newsletter
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNewsletter;
