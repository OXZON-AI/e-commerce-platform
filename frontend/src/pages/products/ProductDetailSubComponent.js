import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedProducts } from "../../store/slices/product-slice";
import { toast } from "react-toastify";
import placeholderImage from "../../assets/images/placeholder_image.png";
import { Link } from "react-router-dom";
import { createReview, fetchReviews } from "../../store/slices/review-slice";

const ProductDetailSubComponent = ({ prodDetails }) => {
  const dispatch = useDispatch();
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.reviews);
  const [activeTab, setActiveTab] = useState("specs");
  const [filters, setFilters] = useState({
    cid: prodDetails.category._id,
    limit: 5,
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: "",
    comment: "",
    variant: prodDetails.variants?.[0]?._id,
    order: "order_id",
    images: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const tabs = [
    { id: "specs", label: "Specifications" },
    { id: "description", label: "Description" },
    { id: "reviews", label: `Reviews (5)` },
  ];

  // effect hook for fetch product reviews
  useEffect(() => {
    if (activeTab === "reviews") {
      dispatch(fetchReviews(prodDetails.slug));
    }
  }, [dispatch, activeTab, prodDetails.slug]);

  // efect hook for fetch related products by category
  useEffect(() => {
    setRelatedProducts([]);
    dispatch(fetchRelatedProducts(filters))
      .unwrap()
      .then((products) => {
        const filteredProducts = products.filter(
          (product) => product._id !== prodDetails._id
        );
        setRelatedProducts(filteredProducts); // Set related products excluding the current product.
        console.log("related products - ", relatedProducts);
      })
      .catch(() => {
        toast.error("Faield to fetch related products!");
      }); // fetch products only realted category for productDetail page
  }, [dispatch]);

  // Handler for submit reviews
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview(reviewData));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Tabs Section */}
      <div className="flex justify-center border-b mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`p-4 text-xl font-semibold ${
              activeTab === tab.id ? "border-b-2 border-black" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "specs" && (
          // <div>
          //   <p>
          //     <strong>Brand</strong> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
          //     {prodDetails.brand}
          //   </p>
          //   <p>
          //     <strong>Category</strong> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
          //     {prodDetails.category?.name}
          //   </p>

          //   {prodDetails &&
          //     prodDetails.variants?.[0]?.attributes.map((attr) => (
          //       <p key={attr.name}>
          //         <strong>
          //           {attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}
          //         </strong>
          //         &nbsp;&nbsp; : &nbsp;&nbsp;
          //         {attr.value}
          //       </p>
          //     ))}
          // </div>
          <table className="w-full border-collapse mt-2">
            <tbody>
              <tr>
                <td className="border p-2 font-semibold">Brand</td>
                <td className="border p-2">{prodDetails.brand}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Category</td>
                <td className="border p-2">{prodDetails.category?.name}</td>
              </tr>
              {prodDetails?.variants?.[0]?.attributes.map((attr) => (
                <tr key={attr.name}>
                  <td className="border p-2 font-semibold">
                    {attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}
                  </td>
                  <td className="border p-2">{attr.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === "description" && (
          <p>{prodDetails.description.detailed}</p>
        )}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1.8fr] gap-4">
            {/* Left Side: Customer Reviews */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
              {reviewsLoading ? (
                <p>Loading reviews...</p>
              ) : reviewsError ? (
                <p className="text-red-500">{reviewsError}</p>
              ) : (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Customer Reviews
                  </h3>
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-gray-200">
                      <p className="font-semibold">John Doe</p>
                      <div className="flex text-yellow-500 text-lg">
                        {"★".repeat(4)}
                        {"☆".repeat(1)}
                      </div>
                      <p className="text-gray-700">
                        Great laptop for gaming and productivity! Highly
                        recommended.
                      </p>
                      <button className="text-blue-500 text-sm mt-2">
                        Reply
                      </button>
                    </div>
                    <div className="pb-3 border-b border-gray-200">
                      <p className="font-semibold">Jane Smith</p>
                      <div className="flex text-yellow-500 text-lg">
                        {"★".repeat(5)}
                      </div>
                      <p className="text-gray-700">
                        Excellent build quality and performance. Worth every
                        penny!
                      </p>
                      <button className="text-blue-500 text-sm mt-2">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Add a Review (More Extended) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
              <h3 className="text-2xl font-semibold mb-4">Add a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Your Rating:</label>
                  <div className="flex space-x-1">
                    {"★"
                      .repeat(5)
                      .split("")
                      .map((_, index) => (
                        <button
                          key={index}
                          className="text-yellow-500 text-2xl"
                          type="button"
                        >
                          ★
                        </button>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Message</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Write your review"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Success Message */}
      {submitted && (
        <div className="mt-4 p-3 text-green-700 bg-green-100 border border-green-500 rounded-lg text-center transition-opacity duration-500">
          ✅ Review submitted successfully!
        </div>
      )}

      {/* Related Products Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Related Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedProducts &&
            relatedProducts.map((product) => (
              <Link key={product._id} to={`/product/${product.slug}`}>
                <div className="relative bg-white shadow-md rounded-2xl overflow-hidden p-5 transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col h-full">
                  <div className="w-full h-44 flex items-center justify-center rounded-lg">
                    <img
                      src={
                        product?.defaultVariant?.image?.url || placeholderImage
                      }
                      alt={
                        product?.defaultVariant?.image?.alt || "Product Image"
                      }
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* {product.discount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {product.discount}
                </span>
              )} */}
                  {/* {product.newTag && (
                <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  New
                </span>
              )} */}

                  {/* Product Name */}
                  <p className="mt-4 text-lg font-semibold text-gray-700 min-h-[3rem] text-center line-clamp-2">
                    {product.name}
                  </p>

                  {/* Product Price */}
                  <p className="mt-2 text-base font-medium text-gray-700 text-center">
                    {product?.defaultVariant?.price || "N/A"} MVR
                  </p>

                  {/* Ratings */}
                  <div className="flex justify-center mt-3 text-yellow-500">
                    {"★".repeat(Math.floor(product.ratings.average))}
                    {"☆".repeat(5 - Math.floor(product.ratings.average))}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSubComponent;
