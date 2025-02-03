import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProducts, fetchProducts } from "../../store/slices/product-slice";
import { Link } from "react-router-dom";
import placeholderImage from "../../assets/images/placeholder_image.png";
import LayoutOne from "../../layouts/LayoutOne";

const SampleProductCatalogue = () => {
  const dispatch = useDispatch(); // Dispatch function to interact with Redux store
  const { items = [], loading, error } = useSelector((state) => state.product); // Selecting the product state from the Redux store

  // Local state to manage the filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    sortBy: "", // Field to sort by (ratings or price)
    sortOrder: "", // Sort order (ascending or descending)
    priceRange: [0, 1000], // Price range filter (min, max)
    page: 1, // Current page for pagination
    limit: 10, // Number of products per page
  });

  // Function to build query params based on the selected filters
  const buildFilters = (filters) => {
    const query = {};
    if (filters.search) query.search = filters.search.trim(); // If a search term exists, add it to the query
    if (filters.category) query.category = filters.category.trim(); // If a category is selected, add it to the query
    if (filters.brand) query.brand = filters.brand.trim(); // If a brand is selected, add it to the query
    if (filters.sortBy) {
      query.sortBy = filters.sortBy.trim();
      query.sortOrder = filters.sortOrder
        ? filters.sortOrder.trim()
        : undefined;
    } // If sorting is enabled, add sort options to the query
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

  // Effect hook to fetch products when filters change or component mounts
  useEffect(() => {
    console.log("Fetching products with filters:", filters);
    const query = buildFilters(filters); // Generate the query based on the current filters
    dispatch(fetchProducts(query)); // Dispatch the fetchProducts action with the generated query

    // Cleanup function to clear products when component unmounts or filters change
    return () => {
      dispatch(clearProducts()); // This is called whenever the component is about to unmount or when the filters object changes. This is useful for clearing any previous product data before new products are fetched based on updated filters.
    };
  }, [dispatch, filters]); // Dependencies: dispatch and filters, so it triggers when either changes

  return (
    <Fragment>
      <LayoutOne>

      
    <div className="product-catalogue max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Product Catalogue
      </h1>

      {/* Filter Section */}
      <div className="filters grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category || ""}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={filters.brand || ""}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.priceRange[0] || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: [Number(e.target.value), filters.priceRange[1]],
              })
            }
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.priceRange[1] || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          name="sortBy"
          value={filters.sortBy || ""}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="ratings">Ratings</option>
          <option value="price">Price</option>
        </select>
        <select
          name="sortOrder"
          value={filters.sortOrder || ""}
          onChange={(e) =>
            setFilters({ ...filters, sortOrder: e.target.value })
          }
          disabled={!filters.sortBy}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort Order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Product List */}
      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && (
          <p className="col-span-4 text-center text-gray-500">Loading products...</p>
        )}
        {error && (
          <p className="col-span-4 text-center text-red-500">Error: {error}</p>
        )}
        {items?.length === 0 && !loading && (
          <p className="col-span-4 text-center text-gray-500">
            No results found
          </p>
        )}
        {items?.map((product) => (
          <Link to={`/sampleproduct/${product.slug}`} key={product._id}>
            <div
              key={product._id}
              className="product-item p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                className="w-full h-48 object-cover rounded-lg mb-4"
                src={product.defaultVariant?.image?.url || placeholderImage}
                alt={product.defaultVariant?.image?.alt || "Product Image"}
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="inline-block bg-blue-100 border-2 border-blue-500 text-blue-500 rounded px-1 py-1 text-sm font-bold text-blue-600 mt-2">
                {product.brand}
              </p>
              <p className="inline-block bg-blue-100 border-2 border-blue-500 text-blue-500 rounded px-1 py-1 text-sm font-bold text-blue-600 mt-2">
                {product.category.name}
              </p>
              <p className="text-gray-600 mt-2">
                {product.description?.short || "No description available"}
              </p>
              <p className="text-lg font-bold mt-2">
                Price: ${product.defaultVariant?.price || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>

    </LayoutOne>
    </Fragment>
  );
};

export default SampleProductCatalogue;
