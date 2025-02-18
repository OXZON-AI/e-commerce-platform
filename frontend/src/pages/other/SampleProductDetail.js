import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearProductDetail,
  fetchProductDetails,
} from "../../store/slices/product-slice";
import placeholderImage from "../../assets/images/placeholder_image.png";

const SampleProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { productDetail, loading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchProductDetails(slug));

    return () => {
      // cleanup if needed
      dispatch(clearProductDetail());
    };
  }, [slug, dispatch]);

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    productDetail && (
      <div className="max-w-7xl mx-auto p-6 sm:p-12">
        {/* Product Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg shadow-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={
                productDetail.variants[0]?.images[0]?.url || placeholderImage
              }
              alt={productDetail.variants[0]?.images[0]?.alt || "Product Image"}
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{productDetail.name}</h1>
              <p className="text-gray-700 text-lg mb-6">
                {productDetail.description.detailed}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Price:</h2>
              <p className="text-2xl font-bold text-green-500">
                ${productDetail.variants[0]?.price || "N/A"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Stock: {productDetail.variants[0]?.stock || "Out of stock"}
              </p>
              <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Available Variants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productDetail.variants.map((variant) => (
              <div
                key={variant._id}
                className="border rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              >
                <img
                  className="w-32 h-32 object-cover mb-4"
                  src={variant.images[0]?.url || placeholderImage}
                  alt={variant.images[0]?.alt || "Variant Image"}
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
                <h3 className="font-semibold mb-2">Price: ${variant.price}</h3>
                <p className="text-sm text-gray-600">Stock: {variant.stock}</p>
                {/* <button className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg">
                  View Details
                </button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default SampleProductDetail;
