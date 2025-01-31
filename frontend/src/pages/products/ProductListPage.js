import React, { Fragment, useState, useEffect } from "react";
import { FaTh, FaThList, FaThLarge, FaEye } from "react-icons/fa"; // Import icons for grid views

import LayoutOne from "../../layouts/LayoutOne";

const ProductListPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("low-to-high");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewLayout, setViewLayout] = useState("grid"); // New state for view layout
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const productsPerPage = 8;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Furniture",
    "Books",
    "Cosmetics",
  ];

  const brands = ["All Brands", "Brand A", "Brand B", "Brand C", "Brand D"];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    if (name === "minPrice") {
      setMinPrice(value);
    } else if (name === "maxPrice") {
      setMaxPrice(value);
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleLayoutChange = (layout) => {
    setViewLayout(layout); // Update layout based on the selected view
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesPriceRange =
      product.price >= minPrice && product.price <= maxPrice;
    const matchesBrand =
      selectedBrand === "All Brands" || product.brand === selectedBrand;
    return (
      matchesCategory && matchesSearch && matchesPriceRange && matchesBrand
    );
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    return sortOrder === "low-to-high" ? a.price - b.price : b.price - a.price;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (loading) {
    return <div className="text-center text-lg mt-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <Fragment>
      <LayoutOne>
        <div className="flex flex-col lg:flex-row p-6 gap-6 bg-gray-50 min-h-screen">
          {/* Sidebar */}
          <div className="lg:w-1/6 w-full md:w-1/3 sm:w-1/2 border rounded-lg shadow-md p-4 bg-white">
            <h3 className="text-xl font-semibold mb-4">Categories</h3>

            {/* Category List */}
            <ul className="space-y-3">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`text-center cursor-pointer px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            {/* Price Range Filter */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Filter by Price</h4>
              <div className="flex flex-col">
                <div className="flex justify-between text-sm">
                  <span>${minPrice}</span>
                  <span>${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  name="minPrice"
                  value={minPrice}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  name="maxPrice"
                  value={maxPrice}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Filter by Brand */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Filter by Brand</h4>
              <ul className="space-y-2">
                {brands.map((brand) => (
                  <li
                    key={brand}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm ${
                      selectedBrand === brand
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

            {/* Filter Tags */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Filter by Tags</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-all duration-300"
                  onClick={() => handleCategoryChange("All Categories")}
                >
                  All
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-all duration-300"
                  onClick={() => handleCategoryChange("Electronics")}
                >
                  Electronics
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-all duration-300"
                  onClick={() => handleCategoryChange("Fashion")}
                >
                  Fashion
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-all duration-300"
                  onClick={() => handleCategoryChange("Furniture")}
                >
                  Furniture
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-all duration-300"
                  onClick={() => handleCategoryChange("Books")}
                >
                  Books
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-all duration-300"
                  onClick={() => handleCategoryChange("Cosmetics")}
                >
                  Cosmetics
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search, Sorting, and View Layout Options */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 mb-4 md:mb-0"
                  style={{
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <select
                className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  boxSizing: "border-box",
                }}
              >
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>

              {/* View Layout Options */}
              <div className="flex space-x-4 mt-4 md:mt-0">
                <button
                  onClick={() => handleLayoutChange("grid")}
                  className={`p-2 ${
                    viewLayout === "grid"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => handleLayoutChange("compact-grid")}
                  className={`p-2 ${
                    viewLayout === "compact-grid"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => handleLayoutChange("list")}
                  className={`p-2 ${
                    viewLayout === "list"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FaThList />
                </button>
              </div>
            </div>

            {/* Showing Results */}
            <p className="mb-6 text-gray-600 text-lg">
              Showing {currentProducts.length} of {filteredProducts.length}{" "}
              results
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
              {currentProducts.map((product) => (
                <div
                  key={product.id}
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
                            src={product.image}
                            alt={product.title}
                            className="h-40 object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-gray-800 mb-2 truncate">
                          {product.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {product.category.charAt(0).toUpperCase() +
                            product.category.slice(1)}
                        </p>

                        {/* Pricing Section */}
                        <div className="text-lg mb-2">
                          <span className="text-red-600 font-bold">
                            $
                            {product.price *
                              (1 - product.discount / 100).toFixed(2)}
                          </span>
                          <span className="line-through text-gray-500 ml-2">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="ml-2 text-green-600">
                            ({product.discount}% OFF)
                          </span>
                        </div>

                        {/* Additional Product Details */}
                        <div className="mt-4 text-sm text-gray-600">
                          <p>{product.description}</p>
                          <p>SKU: {product.sku}</p>
                        </div>
                      </div>

                      {/* View Details Button - Right Aligned */}
                      <div className="flex justify-end mt-4 md:mt-0 md:ml-4 w-full">
                        <button
                          className="py-2 px-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                          onClick={() =>
                            alert(
                              `Go to product detail page for ${product.title}`
                            )
                          }
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
                          src={product.image}
                          alt={product.title}
                          className="h-40 object-contain"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2 truncate">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </p>

                      {/* Pricing Section */}
                      <div className="text-lg mb-2">
                        <span className="text-red-600 font-bold">
                          $
                          {product.price *
                            (1 - product.discount / 100).toFixed(2)}
                        </span>
                        <span className="line-through text-gray-500 ml-2">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="ml-2 text-green-600">
                          ({product.discount}% OFF)
                        </span>
                      </div>

                      {/* View Details Button */}
                      <div className="flex justify-end mt-4">
                        <button
                          className="py-2 px-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                          onClick={() =>
                            alert(
                              `Go to product detail page for ${product.title}`
                            )
                          }
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
            <div className="flex justify-center mt-8 space-x-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-6 py-3 rounded-lg font-semibold ${
                    currentPage === index + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ProductListPage;
