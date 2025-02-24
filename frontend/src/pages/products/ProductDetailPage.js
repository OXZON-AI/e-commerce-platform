import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import PuffLoader from "react-spinners/PuffLoader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductDetailSubComponent from "./ProductDetailSubComponent";
import LayoutOne from "../../layouts/LayoutOne";
import { useDispatch, useSelector } from "react-redux";
import placeholderImage from "../../assets/images/placeholder_image.png";
import {
  clearProductDetail,
  fetchProductDetails,
} from "../../store/slices/product-slice";
import { addToCart, fetchCart } from "../../store/slices/cart-slice";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { productDetail, loading, error } = useSelector(
    (state) => state.product
  );
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);
  const { status: cartStatus, error: cartError } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchProductDetails(slug));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [slug, dispatch]);

  const addToCartHandler = async () => {
    if (productDetail.variants[0]?.stock > 0) {
      try {
        await dispatch(
          addToCart({
            variantId: productDetail.variants[0]._id,
            quantity,
          })
        );
        if (cartStatus === "succeeded-add-to-cart") {
          setNotification({
            type: "success",
            message: `${quantity} item added to your cart!`,
          });

          await dispatch(fetchCart()); // Wait for addToCart to complete, then fetch the latest cart
        } else if (cartError && cartStatus === "failed-add-to-cart") {
          setNotification({ type: "error", message: `${cartError}` });
        }
      } catch (error) {
        setNotification({ type: "error", message: "Something went wrong!" });
      }
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

  // const overallRating = calculateOverallRating(product.reviews);

  return (
    <Fragment>
      <LayoutOne>
        {loading && (
          <p className="col-span-4 text-center text-gray-500">
            Loading product Details...
          </p>
        )}
        {error && (
          <p className="col-span-4 text-center text-red-500">Error: {error}</p>
        )}
        {!productDetail && !loading && (
          <p className="col-span-4 text-center text-gray-500">
            No results found
          </p>
        )}
        {productDetail && (
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col md:flex-row gap-10 mt-16">
              <div className="w-full md:w-2/3 lg:w-1/2">
                <img
                  src={
                    productDetail.variants?.[0]?.images?.[0]?.url ||
                    placeholderImage
                  }
                  alt={productDetail.name}
                  className="w-full rounded-lg shadow-lg mb-4"
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
                {productDetail.variants?.[0]?.images?.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {productDetail.variants[0].images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url || placeholderImage}
                        alt={`${productDetail.name} ${index + 1}`}
                        className="w-full rounded-lg shadow-lg my-2"
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                    ))}
                  </Slider>
                ) : (
                  <p className="text-gray-500">
                    No more images available for this product.
                  </p>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {productDetail.name}
                </h1>
                <p className="text-gray-700 mb-2">
                  {productDetail.description.short}
                </p>
                <p className="text-2xl font-semibold mb-2">
                  {productDetail.variants?.[0]?.price} MVR
                </p>
                {/* <p className="text-yellow-500 mb-2">
                {"★".repeat(Math.round(overallRating))}
                {"☆".repeat(5 - Math.round(overallRating))} ({overallRating})
              </p> */}
                <hr className="my-6 h-0.5 border-t-0 bg-indigo-950" />
                {productDetail.variants?.[0]?.stock > 0 ? (
                  <p className="text-green-500 font-medium mb-4">
                    In Stock ({productDetail.variants?.[0]?.stock} left)
                  </p>
                ) : (
                  <p className="text-red-500 font-medium mb-4">Out of Stock</p>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="ml-auto">
                    <button
                      className={`px-4 py-2 rounded-none text-white font-medium ${
                        productDetail.variants?.[0]?.stock > 0
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={
                        productDetail.variants?.[0]?.stock === 0 ||
                        cartStatus === "loading-add-to-cart"
                      }
                      onClick={addToCartHandler}
                    >
                      {cartStatus === "loading-add-to-cart" ? (
                        <PuffLoader size={20} color="#fff" />
                      ) : productDetail.variants?.[0]?.stock > 0 ? (
                        "Add to Cart"
                      ) : (
                        "Unavailable"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <ProductDetailSubComponent prodDetails={productDetail} />
            </div>
            {notification && (
              <div
                className={`fixed bottom-4 left-4 px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform ${
                  notification ? "translate-x-0" : "-translate-x-full"
                } ${
                  notification.type === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {notification.message}
              </div>
            )}
          </div>
        )}
      </LayoutOne>
    </Fragment>
  );
};

export default ProductDetailPage;
