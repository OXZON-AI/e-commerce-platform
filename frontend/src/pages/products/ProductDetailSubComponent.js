import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedProducts } from "../../store/slices/product-slice";
import { toast } from "react-toastify";
import placeholderImage from "../../assets/images/placeholder_image.png";
import { Link } from "react-router-dom";
import { createReview, fetchReviews } from "../../store/slices/review-slice";
import axios from "axios";
import { fetchOrders } from "../../store/slices/order-slice";

const ProductDetailSubComponent = ({ prodDetails }) => {
  const dispatch = useDispatch();
  const {
    reviews,
    counts,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.reviews);
  const { orders } = useSelector((state) => state.orders);
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
    order: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tabs = [
    { id: "specs", label: "Specifications" },
    { id: "description", label: "Description" },
    { id: "reviews", label: `Reviews (${counts.count})` },
  ];

  // effect hook for fetch orders
  useEffect(() => {
    const filters = {
      limit: 1000, // set limit higher ammount to go in all orders.
    };
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  // effect hook for fetch product reviews
  useEffect(() => {
    if (activeTab === "reviews" && orders?.length > 0) {
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

      dispatch(fetchReviews(prodDetails.slug)).unwrap(); // fetch reviews
    }
  }, [dispatch, activeTab, prodDetails.slug, orders]);

  // effect hook for fetch related products by category
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
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("review data : ", reviewData);
    dispatch(createReview(reviewData))
      .unwrap()
      .then(() => {
        dispatch(fetchReviews(prodDetails.slug)).unwrap(); // fetch reviews
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
      })
      .catch(() => {
        toast.error(" Review Submition Failed!");
      });
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
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="pb-3 border-b border-gray-200"
                        >
                          <p className="font-semibold">{review.user.name}</p>
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
                                  className="w-16 h-16 object-cover"
                                />
                              ))}
                            </div>
                          )}
                          <button className="text-blue-500 text-sm mt-2">
                            Reply
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Add a Review (More Extended) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
              {reviewData.order ? (
                <>
                  <h3 className="text-2xl font-semibold mb-4">Add a Review</h3>
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
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Title"
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
                      <label className="block mb-1 font-medium">Message</label>
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
                      <label className="block mb-1 font-medium">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        multiple
                        className="block w-full border p-2"
                        onChange={handleImageUpload}
                      />
                      <div className="flex space-x-2 mt-2">
                        {previewImages.map((src, index) => (
                          <img
                            key={index}
                            src={src}
                            alt="Preview"
                            className="w-16 h-16 object-cover"
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
