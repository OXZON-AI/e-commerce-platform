import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProducts, fetchProducts } from "../../store/slices/product-slice";

const SampleProductCatalogue = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.product);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    sortBy: "",
    sortOrder: "",
    priceRange: [0, 1000],
    page: 1,
    limit: 10,
  });

  const buildFilters = (filters) => {
    const query = {};
    if (filters.search) query.search = filters.search.trim();
    if (filters.category) query.category = filters.category.trim();
    if (filters.brand) query.brand = filters.brand.trim();
    if (filters.sortBy) {
      query.sortBy = filters.sortBy.trim();
      query.sortOrder = filters.sortOrder
        ? filters.sortOrder.trim()
        : undefined;
    }
    if (
      filters.priceRange[0] &&
      (!filters.priceRange[1] || filters.priceRange[0] < filters.priceRange[1])
    ) {
      query.minPrice = filters.priceRange[0];
    }
    if (filters.priceRange[1]) {
      query.maxPrice = filters.priceRange[1];
    }
    query.page = filters.page || 1;
    query.limit = filters.limit || 10;
    return query;
  };

  useEffect(() => {
    const query = buildFilters(filters);
    dispatch(fetchProducts(query));

    return () => {
      dispatch(clearProducts());
    };
  }, [dispatch, filters]);

  return (
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
          <p className="col-span-4 text-center text-gray-500">Loading...</p>
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
          <div
            key={product._id}
            className="product-item p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="inline-block bg-blue-100 border-2 border-blue-500 text-blue-500 rounded px-1 py-1 text-sm font-bold text-blue-600 mt-2">
              {product.brand}
            </p>
            <p className="text-gray-600 mt-2">
              {product.description?.short || "No description available"}
            </p>
            <p className="text-lg font-bold mt-2">
              Price: ${product.defaultVariant?.price || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleProductCatalogue;
