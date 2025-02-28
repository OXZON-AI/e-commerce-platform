import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedProducts } from "../../store/slices/product-slice";
import { toast } from "react-toastify";
import placeholderImage from "../../assets/images/placeholder_image.png";
import { Link } from "react-router-dom";

const ProductDetailSubComponent = ({ prodDetails }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("specs");
  const [filters, setFilters] = useState({
    cid: prodDetails.category._id,
    limit: 5,
  });
  const [relatedProducts, setRelatedProducts] = useState([]);

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

  // const relatedProducts = [
  //   { id: 1, name: "Gaming Laptop XYZ", discount: "-10%", rating: 4 },
  //   { id: 2, name: "Smartphone Pro Max", discount: "-15%", rating: 5 },
  //   {
  //     id: 3,
  //     name: "Wireless Headphones",
  //     discount: "-20%",
  //     newTag: true,
  //     rating: 4.5,
  //   },
  //   { id: 4, name: "4K Smart TV 55-inch", newTag: true, rating: 4 },
  // ];

  // efect hook for fetch related products by category
  useEffect(() => {
    setRelatedProducts([]);
    dispatch(fetchRelatedProducts(filters))
      .unwrap()
      .then((products) => {
        const filteredProducts = products.filter(product => product._id !== prodDetails._id);
        setRelatedProducts(filteredProducts); // Set related products excluding the current product.
        console.log("related products - ", relatedProducts);
      })
      .catch(() => {
        toast.error("Faield to fetch related products!");
      }); // fetch products only realted category for productDetail page
  }, [dispatch]);

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
          <div>
            <p>
              <strong>Brand</strong> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
              {prodDetails.brand}
            </p>
            <p>
              <strong>Category</strong> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
              {prodDetails.category?.name}
            </p>

            {prodDetails &&
              prodDetails.variants?.[0]?.attributes.map((attr) => (
                <p key={attr.name}>
                  <strong>
                    {attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}
                  </strong>
                  &nbsp;&nbsp; : &nbsp;&nbsp;
                  {attr.value}
                </p>
              ))}
          </div>
        )}
        {activeTab === "description" && (
          <p>{prodDetails.description.detailed}</p>
        )}
        {activeTab === "reviews" && (
        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1.8fr] gap-4">
        {/* Left Side: Customer Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-200">
              <p className="font-semibold">John Doe</p>
              <div className="flex text-yellow-500 text-lg">
                {"★".repeat(4)}{"☆".repeat(1)}
              </div>
              <p className="text-gray-700">Great laptop for gaming and productivity! Highly recommended.</p>
              <button className="text-blue-500 text-sm mt-2">Reply</button>
            </div>
            <div className="pb-3 border-b border-gray-200">
              <p className="font-semibold">Jane Smith</p>
              <div className="flex text-yellow-500 text-lg">{"★".repeat(5)}</div>
              <p className="text-gray-700">Excellent build quality and performance. Worth every penny!</p>
              <button className="text-blue-500 text-sm mt-2">Reply</button>
            </div>
          </div>
        </div>
      
        {/* Right Side: Add a Review (More Extended) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Add a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Your Rating:</label>
              <div className="flex space-x-1">
                {"★".repeat(5).split("").map((_, index) => (
                  <button key={index} className="text-yellow-500 text-2xl" type="button">
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input type="email" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your email" />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Message</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="4" placeholder="Write your review"></textarea>
            </div>
            <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition">
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
                <div className="relative bg-white shadow-md rounded-2xl overflow-hidden p-5 transition-transform transform hover:scale-100 hover:shadow-2xl">
                  <div className="w-full h-44 flex items-center justify-center rounded-lg">
                    <img
                      src={product?.defaultVariant?.image?.url || placeholderImage}
                      alt={product?.defaultVariant?.image?.alt || "product Image"}
                      className="w-full"
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
                  <p className="mt-4 text-lg font-semibold text-gray-700">
                    {product.name}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-gray-700">
                    {product?.defaultVariant?.price || "N/A"} MVR
                  </p>
                  <div className="flex justify-center mt-2 text-yellow-500">
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
