import { useState } from "react";

const ProductDetailSubComponent = ({ prodDetails }) => {
  const [activeTab, setActiveTab] = useState("specs");

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

  const relatedProducts = [
    { id: 1, name: "Gaming Laptop XYZ", discount: "-10%", rating: 4 },
    { id: 2, name: "Smartphone Pro Max", discount: "-15%", rating: 5 },
    {
      id: 3,
      name: "Wireless Headphones",
      discount: "-20%",
      newTag: true,
      rating: 4.5,
    },
    { id: 4, name: "4K Smart TV 55-inch", newTag: true, rating: 4 },
  ];

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
              <strong>Brand</strong> &nbsp;&nbsp; : &nbsp;&nbsp; {prodDetails.brand}
            </p>
            <p>
              <strong>Category</strong> &nbsp;&nbsp; : &nbsp;&nbsp; {prodDetails.category?.name}
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
          <div className="flex flex-wrap justify-between">
            {/* Left Side: Sample Reviews */}
            <div className="w-full lg:w-2/3 pr-4 mb-8 lg:mb-0">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              <div className="border-b pb-4 mb-4">
                <p className="font-semibold">John Doe</p>
                <div className="flex mb-2">
                  {"★".repeat(4)}
                  {"☆".repeat(1)}
                </div>
                <p>
                  Great laptop for gaming and productivity! Highly recommended.
                </p>
                <button className="text-blue-500 text-sm mt-2">Reply</button>
              </div>
              <div className="border-b pb-4 mb-4">
                <p className="font-semibold">Jane Smith</p>
                <div className="flex mb-2">{"★".repeat(5)}</div>
                <p>
                  Excellent build quality and performance. Worth every penny!
                </p>
                <button className="text-blue-500 text-sm mt-2">Reply</button>
              </div>
            </div>

            {/* Right Side: Add a Review Form */}
            <div className="w-full lg:w-1/3 pl-4 border-l p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Add a Review</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Your Rating:</label>
                  <div className="flex">
                    {"★"
                      .repeat(5)
                      .split("")
                      .map((_, index) => (
                        <button
                          key={index}
                          className="text-yellow-500 text-xl"
                          type="button"
                        >
                          ★
                        </button>
                      ))}
                  </div>
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Message</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Write your review"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-none"
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
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white shadow-md rounded-2xl overflow-hidden p-5 transition-transform transform hover:scale-100 hover:shadow-2xl"
            >
              <div className="bg-gray-200 w-full h-44 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 text-lg font-semibold">
                  600x800
                </span>
              </div>
              {product.discount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {product.discount}
                </span>
              )}
              {product.newTag && (
                <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  New
                </span>
              )}
              <p className="mt-4 text-lg font-semibold text-gray-700">
                {product.name}
              </p>
              <div className="flex justify-center mt-2 text-yellow-500">
                {"★".repeat(Math.floor(product.rating))}
                {"☆".repeat(5 - Math.floor(product.rating))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSubComponent;
