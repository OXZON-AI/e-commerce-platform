import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa"; // Icons
import AdminNavbar from "./components/AdminNavbar"; // Assuming this is already created
import Sidebar from "./components/Sidebar"; // Assuming this is already created
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewsletters,
  publishNewsletter,
  resetImageUrl,
  uploadImage,
} from "../../store/slices/news-slice";
import moment from "moment";
import { HashLoader, MoonLoader } from "react-spinners";
import { Newspaper, Paperclip } from "lucide-react";
import NoNewsImg from "../../assets/images/NoNews.svg";

function AdminNewsletter() {
  const dispatch = useDispatch();
  const { newsletters, status, imageUrl, error } = useSelector(
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

  // Effect hook for fetch newsletters from the backend
  useEffect(() => {
    dispatch(resetImageUrl()); //reset image url from redux state
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
          dispatch(resetImageUrl()); //reset image url from redux state when submit completed.
          setTitle("");
          setBody("");
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

              <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg">
                {/* Left Side: Dropdown Filters */}
                <div className="flex items-center gap-4">
                  <select
                    className="p-3 border border-gray-300 rounded-lg w-40"
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                  >
                    <option value="date">Sort by Date</option>
                  </select>
                  <select
                    className="p-3 border border-gray-300 rounded-lg w-40"
                    onChange={(e) =>
                      setFilters({ ...filters, sortOrder: e.target.value })
                    }
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                {/* Right Side: Add Newsletter Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-5 py-[11px] text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  <FaPlus className="mr-2" />
                  <span>Add Newsletter</span>
                </button>
              </div>

              {status === "fetch-news-loading" ? (
                // Show Loading State with Centered HashLoader
                <div className="flex flex-col justify-center items-center py-[50px] mx-auto text-gray-700 font-semibold">
                  <HashLoader color="#a855f7" size={50} />
                  <span className="mt-3">Loading News Letters...</span>
                </div>
              ) : status === "fetch-news-error" ? (
                // Show Error Message Instead of Table
                <div className="my-[50px] text-red-600 font-semibold bg-red-100 p-3 rounded-lg">
                  <span className="mt-3">{error}</span>
                </div>
              ) : newsletters.length === 0 ? (
                // Show no news letters available
                <div className="flex flex-col items-center text-center py-6">
                  <img src={NoNewsImg} alt="empty news" className="w-[150px]" />
                  <p className="text-center text-gray-700 font-semibold py-6">
                    No <span className="text-purple-600">news letters</span>{" "}
                    found.
                  </p>
                </div>
              ) : (
                // Newsletters Table
                <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                  <thead className="bg-gray-100 text-base">
                    <tr>
                      <th className="p-4 text-left">Index</th>
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-left">Detailed Body</th>
                      <th className="p-4 text-left">Created Date</th>
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
                            <td className="p-4">
                              <img
                                src={news.image}
                                alt={news.title}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            </td>
                            <td className="p-4">{news.title}</td>
                            <td
                              className={`p-4 ${
                                news.body ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {news.body ? "Provided" : "Not-Provide"}
                            </td>
                            <td className="p-4">
                              {moment(news.createdAt).format(
                                "DD-MMM-YYYY / h:mm:ss a"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}

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
                    <h3 className="text-xl font-semibold mb-4 flex gap-2">
                      Publish Newsletter <Newspaper color="gray" />
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
                          Letter Title
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
                      <span className="text-gray-400 text-xs font-normal">
                        *Letter title is for email subject & heading
                      </span>
                      <div>
                        <label
                          htmlFor="body"
                          className="block text-sm font-medium"
                        >
                          Letter Body
                        </label>
                        <textarea
                          id="body"
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Enter newsletter body"
                        ></textarea>
                      </div>
                      <span className="text-gray-400 text-xs font-normal">
                        *Letter body is for email body
                      </span>
                      <div className="relative">
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium mb-2"
                        >
                          Banner Image
                        </label>
                        <div className="flex justify-center items-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg">
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                              status === "uploadImage-news-loading"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={status === "uploadImage-news-loading"}
                          />
                          <div className="text-gray-500">
                            {status === "uploadImage-news-loading" ? (
                              <div className="flex items-center text-gray-400">
                                <MoonLoader
                                  size={15}
                                  color="gray"
                                  className="mr-2"
                                />
                                Uploading...
                              </div>
                            ) : (
                              <span className="text flex gap-2">
                                <Paperclip size={20} /> Click to choose a file
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-400 text-xs font-normal">
                          *This is for email body banner image for news article
                        </span>
                        {imageUrl && (
                          <div className="mt-4 text-center">
                            <img
                              src={imageUrl}
                              alt="Uploaded"
                              className="w-full h-24 object-cover border-1 rounded-2 mx-auto"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={
                          status === "uploadImage-news-loading" ||
                          status === "publish-news-loading"
                        }
                        onClick={handlePublish}
                        className={`w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${
                          status === "uploadImage-news-loading" ||
                          status === "publish-news-loading"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {status === "publish-news-loading" ? (
                          <div className="flex items-center justify-center text-white-400">
                            <MoonLoader
                              size={15}
                              color="white"
                              className="mr-2"
                            />
                            Publishing...
                          </div>
                        ) : (
                          "Publish Newsletter"
                        )}
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
