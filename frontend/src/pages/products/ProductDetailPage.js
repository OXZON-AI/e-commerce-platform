import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductDetailSubComponent from "./ProductDetailSubComponent";

import LayoutOne from "../../layouts/LayoutOne";

const sampleProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    description:
      "Experience premium sound quality with these high-fidelity wireless headphones featuring advanced noise cancellation technology. Designed for comfort and long listening sessions, they offer crystal-clear audio, deep bass, and seamless Bluetooth connectivity. Ideal for work, travel, and gaming, with up to 30 hours of battery life on a single charge.",
    price: 99.99,
    stock: 12,
    mainImage: "https://dummyimage.com/600x800/808080/fff.png",
    images: [
      "https://dummyimage.com/600x800/808080/fff.png",
      "https://dummyimage.com/600x800/808080/fff.png",
      "https://dummyimage.com/600x800/808080/fff.png",
      "https://dummyimage.com/600x800/808080/fff.png",
    ],
    reviews: [
      { user: "Alice", rating: 5, comment: "Amazing sound quality!" },
      { user: "Bob", rating: 4, comment: "Great value for the price." },
    ],
  },
  {
    id: 2,
    name: "Smartphone",
    description: "Latest 5G smartphone with stunning display.",
    price: 699.99,
    stock: 0,
    mainImage: "https://dummyimage.com/300x200/808080/fff.png",
    images: [
      "https://dummyimage.com/100x100/808080/fff.png",
      "https://dummyimage.com/100x100/808080/fff.png",
      "https://dummyimage.com/100x100/808080/fff.png",
      "https://dummyimage.com/100x100/808080/fff.png",
    ],
    reviews: [
      { user: "John", rating: 5, comment: "Best phone I've ever owned." },
      {
        user: "Emma",
        rating: 4,
        comment: "Fast performance and great camera.",
      },
    ],
  },
];

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchedProduct = sampleProducts.find(
      (item) => item.id === parseInt(productId, 10)
    );
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    } else {
      setError("Failed to fetch product details");
    }
  }, [productId]);

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    if (product.stock > 0) {
      setNotification({
        type: "success",
        message: `${quantity} item(s) added to cart!`,
      });
    } else {
      setNotification({ type: "error", message: "Out of stock!" });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const calculateOverallRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const overallRating = calculateOverallRating(product.reviews);

  return (
    <Fragment>
      <LayoutOne>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row gap-10 mt-16">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <img
                src={product.mainImage}
                alt={product.name}
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <Slider {...sliderSettings}>
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full rounded-lg shadow-lg"
                  />
                ))}
              </Slider>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-2xl font-semibold mb-2">${product.price}</p>
              <p className="text-yellow-500 mb-2">
                {"★".repeat(Math.round(overallRating))}
                {"☆".repeat(5 - Math.round(overallRating))} ({overallRating})
              </p>
              <hr class="my-6 h-0.5 border-t-0 bg-indigo-950" />
              {product.stock > 0 ? (
                <p className="text-green-500 font-medium mb-4">
                  In Stock ({product.stock} left)
                </p>
              ) : (
                <p className="text-red-500 font-medium mb-4">Out of Stock</p>
              )}
              <div className="flex items-center gap-4 mb-4">
                <button
                  className="px-3 py-1 border rounded-md"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  className="px-3 py-1 border rounded-md"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>

                <button
                  className={`px-4 py-2 rounded-none text-white font-medium ${
                    product.stock > 0
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={product.stock === 0}
                  onClick={addToCart}
                >
                  {product.stock > 0
                    ? `Add ${quantity} to Cart`
                    : "Unavailable"}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <ProductDetailSubComponent />
          </div>
          {notification && (
            <div
              className={`fixed bottom-4 left-4 px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform ${
                notification ? "translate-x-0" : "-translate-x-full"
              } ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {notification.message}
            </div>
          )}
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ProductDetailPage;
