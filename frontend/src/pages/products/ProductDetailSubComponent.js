import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedProducts } from "../../store/slices/product-slice";
import { toast } from "react-toastify";
import placeholderImage from "../../assets/images/placeholder_image.png";
import add_reviews_negativeImg from "../../assets/images/add_reviews_negative.svg";
import thankyouImg from "../../assets/images/thankyou.svg";
import deliveringImg from "../../assets/images/delivering.svg";
import loginRequiredImg from "../../assets/images/login-required.svg";
import { Link, useNavigate } from "react-router-dom";
import { createReview, fetchReviews } from "../../store/slices/review-slice";
import axios from "axios";
import { fetchOrders } from "../../store/slices/order-slice";
import { Info, Upload } from "lucide-react";
import { HashLoader } from "react-spinners";

const ProductDetailSubComponent = ({ prodDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    reviews,
    counts,
    reviewsPaginationInfo,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.reviews);
  const { orders, status: orderStatus } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("specs");
  const [relatedProdFilters, setRelatedProdFilters] = useState({
    cid: prodDetails.category._id,
    limit: 3,
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
  const [matchedOrder, setMatchedOrder] = useState(null);
  const [isUserReviewd, setIsUserReviewd] = useState(false);

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
    // Clear matchedOrder from local state first
    setMatchedOrder(null);

    // If there is orders, then check matched order and fetch reviews
    if (orders?.length > 0) {
      // Find the order ID where the product variant matches
      const matched_Order = orders.find((order) =>
        // The .some() method in JavaScript is used to check if at least one element in an array satisfies a given condition. It returns a boolean (true or false).
        order.items.some(
          (item) => item.variant?._id === prodDetails.variants?.[0]?._id
        )
      );

      console.log("Order ID : ", matched_Order?._id);

      // If matched order then set order id to order in reviewData
      if (matched_Order) {
        setMatchedOrder(matched_Order); // setting matched order to local state
        setReviewData((prevData) => ({
          ...prevData,
          order: matched_Order?._id,
        }));
      } else {
        setMatchedOrder(null);
        console.error("No matching order found for this variant.");
      }
    }

    // fetch reviews
    dispatch(
      fetchReviews({ productSlug: prodDetails.slug, filters: reviewsFilters })
    ).unwrap();

    console.log("Order : ", matchedOrder);
  }, [dispatch, prodDetails.slug, reviewsFilters, orders]);

  // effect hook for check user reviewd or not
  useEffect(() => {
    if (userInfo) {
      const userHasReviewed = reviews?.some(
        (review) => review.user.name === userInfo.name
      );
      setIsUserReviewd(userHasReviewed);
      console.log("is user reviewed ? ", isUserReviewd);
    } else {
      console.error("user not found to check review or not!");
    }
  }, [userInfo, reviews]);

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
          process.env.REACT_APP_CLOUDINARY_UPLOAD_REVIEWS_PRESET
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
      await dispatch(
        fetchReviews({ productSlug: prodDetails.slug, filters: reviewsFilters })
      ).unwrap(); // fetch reviews

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
                        value={reviewsFilters.rating || ""}
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
                <>
                  <h3 className="text-2xl font-semibold mb-4">Add a Review</h3>
                  {reviewData.order &&
                  matchedOrder.status === "delivered" &&
                  !isUserReviewd ? (
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
                  ) : matchedOrder && isUserReviewd ? (
                    <div className="mt-2 border-none p-2 rounded-sm flex flex-col items-center justify-center gap-4">
                      <img
                        src={thankyouImg}
                        alt="purchasse-to-add-review-image"
                        className="w-[150px]"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-purple-500 text-center">
                          Thank you for your feedback!
                        </p>
                        <p className="text-gray-500 text-center">
                          You have already submitted a review.
                        </p>
                      </div>
                    </div>
                  ) : !userInfo ? (
                    <div className="mt-2 border-none p-2 rounded-sm flex flex-col items-center justify-center gap-4">
                      <img
                        src={loginRequiredImg}
                        alt="login-to-add-review-image"
                        className="w-[100px]"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-purple-500 text-center">
                          Login Required!
                        </p>
                        <p className="text-gray-500 text-center">
                          You must log in to add a review.
                        </p>
                        <button
                          className="mt-4 px-6 py-2 border-1 border-purple-500 bg-purple-100 font-medium text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition"
                          onClick={() => navigate("/login-register")}
                        >
                          Login Now
                        </button>
                      </div>
                    </div>
                  ) : matchedOrder && matchedOrder.status !== "delivered" ? (
                    <div className="mt-2 border-none p-2 rounded-sm flex flex-col items-center justify-center gap-4">
                      <img
                        src={deliveringImg}
                        alt="purchasse-to-add-review-image"
                        className="w-[100px]"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-purple-500 text-center">
                          Wait until delivery to add a review!
                        </p>
                        <p className="text-gray-400 text-center text-xs">
                          Please wait until your order is delivered before
                          adding a review!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 border-none p-2 rounded-sm flex flex-col items-center justify-center gap-4">
                      <img
                        src={add_reviews_negativeImg}
                        alt="purchasse-to-add-review-image"
                        className="w-[100px]"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-purple-500 text-center">
                          Purchase Required
                        </p>
                        <p className="text-gray-400 text-center text-xs">
                          You need to buy this product to leave a review.
                        </p>
                      </div>
                    </div>
                  )}
                </>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap">
          {relatedProducts &&
            relatedProducts.map((product) => (
              <div key={product._id} className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 ease-in-out">
                    {/* Product Image */}

                    <div className="h-52 flex items-center justify-center bg-white rounded-lg overflow-hidden mb-4">
                      <img
                        src={
                          product?.defaultVariant?.image?.url ||
                          placeholderImage
                        }
                        alt={
                          product?.defaultVariant?.image?.alt || "Product Image"
                        }
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Vendor & Quantity */}
                    <p className="mt-3 text-xs text-gray-500 line-clamp-1 overflow-hidden">
                      Brand: {product.brand} . Qty:{" "}
                      {product.defaultVariant?.stock}
                    </p>

                    <hr className="mt-3" />

                    {/* Product Details */}
                    <div className="mt-3">
                      <h4 className="text-md font-semibold text-gray-900 line-clamp-1 overflow-hidden">
                        {product.name}
                      </h4>
                    </div>

                    {/* Reviews Section */}
                    <p className="text-xs text-gray-500 mt-1">
                      ({product.ratings.count} Reviews)
                    </p>

                    {/* Rating Section - Progress Bar Style */}
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{
                            width: `${(product.ratings.average / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-purple-500 font-medium">
                        {product.ratings.average.toFixed(1)}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-2 text-lg font-bold text-gray-900">
                      Rf {product.defaultVariant?.price || "N/A"}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSubComponent;
