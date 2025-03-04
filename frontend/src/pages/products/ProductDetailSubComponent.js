import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedProducts } from "../../store/slices/product-slice";
import { toast } from "react-toastify";
import placeholderImage from "../../assets/images/placeholder_image.png";
import { Link } from "react-router-dom";
import { createReview, fetchReviews } from "../../store/slices/review-slice";
import axios from "axios";
import { fetchOrders } from "../../store/slices/order-slice";
import { Info, Upload } from "lucide-react";
import { HashLoader } from "react-spinners";

const ProductDetailSubComponent = ({ prodDetails }) => {
  const dispatch = useDispatch();
  const {
    reviews,
    counts,
    reviewsPaginationInfo,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.reviews);
  const { orders, status: orderStatus } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState("specs");
  const [relatedProdFilters, setRelatedProdFilters] = useState({
    cid: prodDetails.category._id,
    limit: 5,
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: "",
    comment: "",
    variant: prodDetails.variants?.[0]?._id,
    order: "",
    images: [],
  });
  const [reviewsFilters, setReviewsFilters] = useState({
    rating: null,
    sortOrder: "desc",
    limit: 2,
    page: 1,
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tabs = [
    { id: "specs", label: "Specifications" },
    { id: "description", label: "Description" },
    {
      id: "reviews",
      label: `Reviews ${
        reviewsLoading || orderStatus === "fetch-loading"
          ? ""
          : reviews.length <= 0 && orderStatus === "fetch-succeeded"
          ? "(No Reviews)"
          : `(${reviewsPaginationInfo.totalCount})`
      }`,
    },
  ];

  // effect hook for fetch orders
  useEffect(() => {
    const orderFilters = {
      limit: 1000, // set limit higher ammount to go in all orders.
    };
    dispatch(fetchOrders(orderFilters));
  }, [dispatch]);

  // effect hook for fetch product reviews
  useEffect(() => {
    if (orders?.length > 0) {
      // Find the order ID where the product variant matches
      const matchedOrder = orders.find((order) =>
        order.items.some(
          (item) => item.variant._id === prodDetails.variants[0]._id
        )
      );

      // If matched order then set order id to order in reviewData
      if (matchedOrder) {
        setReviewData((prevData) => ({
          ...prevData,
          order: matchedOrder._id,
        }));
      }

      dispatch(
        fetchReviews({ productSlug: prodDetails.slug, filters: reviewsFilters })
      ).unwrap(); // fetch reviews
    }
  }, [dispatch, prodDetails.slug, reviewsFilters, orders]);

  // effect hook for fetch related products by category
  useEffect(() => {
    setRelatedProducts([]);
    dispatch(fetchRelatedProducts(relatedProdFilters))
      .unwrap()
      .then((products) => {
        const filteredProducts = products.filter(
          (product) => product._id !== prodDetails._id
        );
        setRelatedProducts(filteredProducts); // Set related products excluding the current product.
        console.log("related products - ", filteredProducts);
      })
      .catch(() => {
        toast.error("Faield to fetch related products!");
      }); // fetch products only realted category for productDetail page
  }, [dispatch]);

  // Handler for star ratings to reviewData
  const handleStarClick = (index) => {
    setReviewData((prev) => ({ ...prev, rating: index + 1 }));
  };

  // Handler for multiple image upload to cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files); // multiple images
    setUploading(true);
    // set local prev image url to prev images
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
        ); // Set in Cloudinary settings

        try {
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
          );
          return {
            url: response.data.secure_url,
            alt: "Uploaded review image",
          };
        } catch (error) {
          console.error("Image upload failed", error);
          return null;
        }
      })
    );

    // set uploaded images to reviewData object
    setReviewData((prev) => ({
      ...prev,
      images: uploadedImages.filter((img) => img !== null),
    }));
    setUploading(false);
  };

  // Handler for submit reviews
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log("review data : ", reviewData);

    try {
      await dispatch(createReview(reviewData)).unwrap();

      await dispatch(fetchOrders({ limit: 1000 })).unwrap(); // Fetch orders again
      await dispatch(fetchReviews(prodDetails.slug)).unwrap(); // fetch reviews

      setSubmitted(true);

      // Reset review data but not order id.
      setReviewData((prev) => ({
        ...prev,
        rating: 5,
        title: "",
        comment: "",
        variant: prodDetails.variants?.[0]?._id,
        images: [],
      }));
      setPreviewImages([]);
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error on review submit : ", error.message || error);
    }
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
          <>
            {/* Success Message */}
            {submitted && (
              <div className="mb-4 p-3 text-green-700 bg-green-100 border-1 border-green-500 rounded-lg text-center transition-opacity duration-500">
                ✅ Review submitted successfully!
              </div>
            )}
            {reviewsError && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 border-1 border-red-500 rounded-lg text-center transition-opacity duration-500">
                🤖 {reviewsError}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1.8fr] gap-4">
              {/* Left Side: Customer Reviews */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Customer Reviews
                  </h3>

                  <div className="space-y-4">
                    {/* Filter Options */}
                    <div className="mb-4 flex justify-between gap-4 items-center w-full">
                      <select
                        className="p-2 border border-gray-300 rounded-md"
                        value={reviewsFilters.rating}
                        onChange={(e) =>
                          setReviewsFilters({
                            ...reviewsFilters,
                            rating: parseInt(e.target.value) || null,
                          })
                        }
                      >
                        <option value="">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>

                      <select
                        className="p-2 border border-gray-300 rounded-md"
                        value={reviewsFilters.sortOrder}
                        onChange={(e) =>
                          setReviewsFilters({
                            ...reviewsFilters,
                            sortOrder: e.target.value,
                          })
                        }
                      >
                        <option value="desc">Highest Rating</option>
                        <option value="asc">Lowest Rating</option>
                      </select>
                    </div>

                    {reviewsLoading ? (
                      <div className="flex justify-center items-center gap-2">
                        <HashLoader size={18} color="#a749ff" />
                        <p className="text-purple-500">Loading reviews...</p>
                      </div>
                    ) : (
                      <>
                        {/* Review cards */}
                        {reviews && reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div
                              key={review._id}
                              className="pb-3 border-b border-gray-200"
                            >
                              <p className="font-semibold">
                                {review.user.name}
                              </p>
                              <div className="flex text-yellow-500 text-lg">
                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}
                              </div>
                              <h5 className="text-gray-700 font-semibold italic">
                                "{review.title || "No Title!"}"
                              </h5>
                              <p className="text-gray-700 italic">
                                {review.comment || "No comment!"}
                              </p>
                              {review.images.length > 0 && (
                                <div className="flex space-x-2 mt-2">
                                  {review.images.map((img, index) => (
                                    <img
                                      key={index}
                                      src={img.url}
                                      alt={img.alt}
                                      className="w-16 h-16 object-cover border-1 rounded-md p-2"
                                    />
                                  ))}
                                </div>
                              )}
                              {/* <button className="text-blue-500 text-sm mt-2">
                              Reply
                            </button> */}
                            </div>
                          ))
                        ) : (
                          <div className="mb-4 p-3 text-violet-700 bg-violet-100 border-1 border-violet-500 rounded-sm flex text-center justify-center gap-2 transition-opacity duration-500">
                            <Info className="w-5 h-5" />
                            <span>No reviews yet.</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      className={`px-4 py-2 border rounded-md ${
                        reviewsFilters.page === 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        setReviewsFilters({
                          ...reviewsFilters,
                          page: Math.max(1, reviewsFilters.page - 1),
                        })
                      }
                      disabled={reviewsFilters.page === 1}
                    >
                      Previous
                    </button>

                    <span className="px-4 py-2 border rounded-md">
                      Page {reviewsFilters.page} of{" "}
                      {reviewsPaginationInfo.totalPages}
                    </span>

                    <button
                      className={`px-4 py-2 border rounded-md ${
                        reviewsPaginationInfo.totalPages <= reviewsFilters.page
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        setReviewsFilters({
                          ...reviewsFilters,
                          page: reviewsFilters.page + 1,
                        })
                      }
                      disabled={
                        reviewsPaginationInfo.totalPages <= reviewsFilters.page
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Add a Review (More Extended) */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                {reviewData.order ? (
                  <>
                    <h3 className="text-2xl font-semibold mb-4">
                      Add a Review
                    </h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium">
                          Your Rating:
                        </label>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, index) => (
                            <span
                              key={index}
                              className={`cursor-pointer text-2xl ${
                                index < reviewData.rating
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }`}
                              onClick={() => handleStarClick(index)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          {/* <label className="block mb-1 font-medium">Title</label> */}
                          <input
                            type="text"
                            placeholder="Title"
                            value={reviewData.title}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) =>
                              setReviewData({
                                ...reviewData,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        {/* <label className="block mb-1 font-medium">Message</label> */}
                        <textarea
                          placeholder="Write your review..."
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows="4"
                          value={reviewData.comment}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              comment: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        {/* <label className="block mb-1 font-medium">
                        Upload Images
                      </label> */}
                        <input
                          type="file"
                          multiple
                          id="fileInput"
                          className="hidden"
                          onChange={handleImageUpload}
                        />

                        {/* Custom Upload Button */}
                        <label
                          htmlFor="fileInput"
                          className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl focus:ring focus:ring-purple-300 cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                        >
                          <Upload className="w-5 h-5 text-purple-500" />
                          <span className="text-gray-700">Upload Images</span>
                        </label>

                        <div className="flex space-x-2 mt-2">
                          {previewImages.map((src, index) => (
                            <img
                              key={index}
                              src={src}
                              alt="Preview"
                              className="w-16 h-16 object-cover border rounded-md"
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-purple-600 text-white rounded-md"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Submit Review"}
                      </button>
                    </form>
                  </>
                ) : (
                  <p className="text-gray-500 mt-4">
                    You must have purchased this product to leave a review.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

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
