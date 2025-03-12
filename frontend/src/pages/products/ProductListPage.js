import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProducts,
  fetchProducts,
  clearBrands,
} from "../../store/slices/product-slice";
import { fetchCategories } from "../../store/slices/category-slice";
import { useNavigate, useParams } from "react-router-dom";
import { FaTh, FaThList, FaThLarge, FaEye } from "react-icons/fa"; // Import icons for grid views
import placeholderImage from "../../assets/images/placeholder_image.png";
import LayoutOne from "../../layouts/LayoutOne";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // Import search icon

const ProductListPage = () => {
  const { categoryUrl } = useParams(); // Get category slug from url
  const dispatch = useDispatch(); // Dispatch function to interact with Redux store
  const navigate = useNavigate();
  const {
    items = [],
    pagination,
    brands = [],
    loading,
    error,
  } = useSelector((state) => state.product); // Selecting the product state from the Redux store
  console.log("products : ", items);

  const {
    categories = [],
    loadingCategories,
    errorCategory,
  } = useSelector((state) => state.categories); // selecting the category state from Redux store
  const [viewLayout, setViewLayout] = useState("grid"); // New state for view layout

  // Local state to manage the filters
  const [filters, setFilters] = useState({
    search: "",
    category: categoryUrl || "All Categories", // Use category from URL if there is or default to "All Categories"
    brand: "All Brands",
    sortBy: "", // Field to sort by (ratings or price)
    sortOrder: "", // Sort order (ascending or descending)
    priceRange: [0, 1000000], // Price range filter (min, max)
    page: 1, // Current page for pagination
    limit: 12, // Number of products per page
  });

  // Function to build query params based on the selected filters
  const buildFilters = (filters) => {
    const query = {};

    // Search term
    if (filters.search) query.search = filters.search.trim(); // If a search term exists, add it to the query

    // Category filter (omit if "All Categories" is selected)
    if (filters.category && filters.category !== "All Categories") {
      query.category = filters.category.trim(); // If a category is selected, add it to the query
    }

    // Brand filter (omit if "All Brands" is selected)
    if (filters.brand && filters.brand !== "All Brands") {
      query.brand = filters.brand.trim(); // If a brand is selected, add it to the query
    }

    // Sorting Options
    if (filters.sortBy) {
      query.sortBy = filters.sortBy.trim();
      query.sortOrder = filters.sortOrder
        ? filters.sortOrder.trim()
        : undefined;
    } // If sorting is enabled, add sort options to the query

    // Price range filter
    if (
      filters.priceRange[0] &&
      (!filters.priceRange[1] || filters.priceRange[0] < filters.priceRange[1])
    ) {
      query.minPrice = filters.priceRange[0];
    }
    if (filters.priceRange[1]) {
      query.maxPrice = filters.priceRange[1];
    } // If a price range is defined, add the min and max prices to the query

    // Add pagination info to the query
    query.page = filters.page || 1;
    query.limit = filters.limit || 10;

    return query;
  };

  // Effect hook to update categoryUrl inside filter when URL changes
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: categoryUrl || "All Categories", // Use category from URL if there is or default to "All Categories"
      page: 1, // Reset pagination
    }));
  }, [categoryUrl]);

  // Effect hook to fetch products when filters change or component mounts
  useEffect(() => {
    const query = buildFilters(filters); // Generate the query based on the current filters
    dispatch(fetchProducts(query)); // Dispatch the fetchProducts action with the generated query

    // Cleanup function to clear products when component unmounts or filters change
    return () => {
      dispatch(clearProducts()); // This is called whenever the component is about to unmount or when the filters object changes. This is useful for clearing any previous product data before new products are fetched based on updated filters.
    };
  }, [filters, dispatch]); // Dependencies: dispatch and filters, so it triggers when either changes

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

  const handleCategoryChange = (slug) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: slug,
      page: 1, // Reset page
    }));
  };

  const handlePriceChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "minPrice") {
      const newMin = Number(value);
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: [
          Math.min(newMin, prevFilters.priceRange[1] - 1), // Ensure minPrice < maxPrice
          prevFilters.priceRange[1],
        ],
      }));
    } else if (name === "maxPrice") {
      const newMax = Number(value);
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: [
          prevFilters.priceRange[0],
          Math.max(newMax, prevFilters.priceRange[0] + 1), // Ensure maxPrice > minPrice
        ],
      }));
    }
  };

  const handleBrandChange = (brand) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      brand: brand,
    }));
  };

  const handleLayoutChange = (layout) => {
    setViewLayout(layout); // Update layout based on the selected view
  };

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

  const totalPages = Math.ceil(items?.length / filters.limit);

  return (
    <Fragment>
      <LayoutOne>
        <div className="flex flex-col lg:flex-row p-6 gap-6 bg-gray-50 min-h-screen">
          {/* Sidebar */}
          <div className="lg:w-1/6 w-full md:w-1/3 sm:w-1/2 border rounded-none shadow-sm p-4 bg-white">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Search</h3>
              <div className="relative flex">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  value={filters.search || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full p-4 pr-14 pl-5 text-gray-900 bg-white border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-300 ease-in-out"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray p-2 rounded-md transition duration-300">
                  <MagnifyingGlassIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Categories</h3>

            {/* Category List */}
            <ul className="space-y-3">
              {loadingCategories && (
                <p className="col-span-4 text-center text-gray-500">
                  Loading categories...
                </p>
              )}
              {errorCategory && (
                <p className="col-span-4 text-center text-red-500">
                  Error: {errorCategory}
                </p>
              )}
              {categories?.length === 0 && !loadingCategories && (
                <p className="col-span-4 text-center text-gray-500">
                  No Categories to show!
                </p>
              )}
              {categories &&
                [
                  {
                    _id: "all",
                    name: "All Categories",
                    slug: "All Categories",
                  },
                  ...categories,
                ]?.map(
                  (
                    category // Add 'All Categories' name to all categories name. so I can show it on categories list.
                  ) => (
                    <li
                      key={category._id}
                      className={`text-center cursor-pointer px-4 py-2 rounded-sm text-sm ${
                        filters.category === category.slug
                          ? "bg-purple-600 text-white font-semibold"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => handleCategoryChange(category.slug)} // Backend requireing category slug instead of name to filter.
                    >
                      {category.name}
                    </li>
                  )
                )}
            </ul>

            {/* Price Range Filter */}
            <div className="mt-6">
              <h4 className="text-xl font-bold mb-3">Filter by Price</h4>
              <div className="flex flex-col">
                <div className="flex justify-between text-sm">
                  <span>{filters.priceRange[0]} MVR</span>
                  <span>{filters.priceRange[1]} MVR</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={"1000000"}
                  step="10"
                  name="minPrice"
                  value={filters.priceRange[0]}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max={"1000000"}
                  step="10"
                  name="maxPrice"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Filter by Brand */}
            <div className="mt-6">
              <h4 className="text-xl font-bold mb-3">Filter by Brand</h4>
              <ul className="space-y-2">
                {brands.map((brand) => (
                  <li
                    key={brand}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm ${
                      filters.brand === brand
                        ? "bg-purple-600 text-white font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => handleBrandChange(brand)}
                  >
                    {brand}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sorting, and View Layout Options */}
            <div className="flex flex-col md:flex-row justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
              {/* Sort By Dropdown */}
              <select
                name="sortBy"
                className="w-full sm:w-60 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                value={filters.sortBy || ""}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
                style={{
                  boxSizing: "border-box",
                }}
              >
                <option value="">Sort By</option>
                <option value="ratings">Ratings</option>
                <option value="price">Price</option>
              </select>

              {/* Sort Order Dropdown */}
              <select
                name="sortOrder"
                className="w-full sm:w-60 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-ms"
                value={filters.sortOrder || ""}
                onChange={(e) =>
                  setFilters({ ...filters, sortOrder: e.target.value })
                }
                style={{
                  boxSizing: "border-box",
                }}
                disabled={!filters.sortBy}
              >
                <option value="">Sort Order</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              {/* View Layout Options */}
              <div className="flex space-x-4 mt-4 md:mt-0 justify-end w-full">
                <button
                  onClick={() => handleLayoutChange("grid")}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    viewLayout === "grid"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => handleLayoutChange("compact-grid")}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    viewLayout === "compact-grid"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaThLarge />
                </button>
                {/* <button
                  onClick={() => handleLayoutChange("list")}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    viewLayout === "list"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaThList />
                </button> */}
              </div>
            </div>

            {/* Showing Results */}
            <p className="mb-6 text-gray-600 text-lg">
              Showing {items?.length} results
            </p>

            {/* Product Grid View */}
            <div
              className={`grid gap-8 ${
                viewLayout === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : ""
              } 
  ${
    viewLayout === "compact-grid"
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      : ""
  }
  ${viewLayout === "list" ? "grid-cols-1" : ""}
`}
            >
              {loading && (
                <p className="col-span-4 text-center text-gray-500">
                  Loading products...
                </p>
              )}
              {error && (
                <p className="col-span-4 text-center text-red-500">
                  Error: {error}
                </p>
              )}
              {items?.length === 0 && !loading && (
                <p className="col-span-4 text-center text-gray-500">
                  No results found
                </p>
              )}
              {items?.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow-lg bg-white p-6 hover:shadow-2xl transition-shadow"
                  style={{ minHeight: "400px" }} // Ensuring uniform card sizes
                >
                  {/* For List Layout */}
                  {viewLayout === "list" ? (
                    <div className="flex flex-col md:flex-row items-start">
                      {/* Product Image */}
                      <div className="flex-shrink-0 mb-4 md:mb-0 mr-4">
                        <div className="h-48 w-48 bg-gray-100 rounded-lg flex items-center justify-center">
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
                            className="h-40 object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-gray-800 mb-2 truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {product.category.name.charAt(0).toUpperCase() +
                            product.category.name.slice(1)}
                        </p>

                        {/* Pricing Section */}
                        <div className="text-lg mb-2">
                          <span className="text-green-600 font-bold">
                            {product.defaultVariant?.price || "N/A"} MVR
                          </span>
                          {/* <span className="line-through text-gray-500 ml-2">
                            {product.price.toFixed(2)} MVR
                          </span> */}
                          {/* <span className="ml-2 text-green-600">
                            ({product.discount}% OFF)
                          </span> */}
                        </div>

                        {/* Additional Product Details */}
                        <div className="mt-4 text-sm text-gray-600">
                          <p>
                            {product.description.short ||
                              "No description available"}
                          </p>
                          {/* <p>SKU: {product.sku}</p> */}
                        </div>
                      </div>

                      {/* View Details Button - Right Aligned */}
                      <div className="flex justify-end mt-4 md:mt-0 md:ml-4 w-full">
                        <button
                          className="py-2 px-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          <FaEye className="text-white" />{" "}
                          {/* FontAwesome Eye Icon */}
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // For Grid Layout
                    <div>
                      {/* Product Image */}
                      <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
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
                          className="h-40 object-contain"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2 truncate">
                        {product.name}
                      </h4>
                      {/* <p className="text-sm text-gray-600 mb-4">
                        {product.category.name.charAt(0).toUpperCase() +
                          product.category.name.slice(1) || "N/A"}
                      </p> */}

                      {/* Pricing Section */}
                      <div className="text-lg mb-2">
                        <span className="text-green-600 font-bold">
                          {product.defaultVariant?.price || "N/A"} MVR
                        </span>
                        {/* <span className="line-through text-gray-500 ml-2">
                          {product.price.toFixed(2)} MVR
                        </span>
                        <span className="ml-2 text-green-600">
                          ({product.discount}% OFF)
                        </span> */}
                      </div>

                      {/* View Details Button */}
                      <div className="flex justify-end mt-4">
                        <button
                          className="py-2 px-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          <FaEye className="text-white" />{" "}
                          {/* FontAwesome Eye Icon */}
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center mt-4 space-x-4">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className={`px-4 py-2 rounded-md ${
                  filters.page === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-purple-600 text-white"
                }`}
              >
                Previous
              </button>

              {/* Page Indicator */}
              <span className="text-black-700">
                Page {filters.page} of {pagination.totalPages}
              </span>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= pagination.totalPages}
                className={`px-4 py-2 rounded-md ${
                  filters.page >= pagination.totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-purple-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ProductListPage;
