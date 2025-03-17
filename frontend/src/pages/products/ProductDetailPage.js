import React, { useState, Fragment, useEffect } from "react";
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
import { toast } from "react-toastify";

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

  // State to manage the main image when clicking on a thumbnail
  const [mainImage, setMainImage] = useState(placeholderImage);

  useEffect(() => {
    dispatch(fetchProductDetails(slug));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [slug, dispatch]);

  // Update main image when product details are fetched
  useEffect(() => {
    if (productDetail?.variants?.[0]?.images?.length > 0) {
      setMainImage(productDetail.variants[0].images[0].url);
    }
  }, [productDetail]);

  // Update the main image on thumbnail click
  const handleImageClick = (imgUrl) => {
    setMainImage(imgUrl);
  };

  const addToCartHandler = async () => {
    if (productDetail.variants[0]?.stock > 0) {
      try {
        await dispatch(
          addToCart({
            variantId: productDetail.variants[0]._id,
            quantity,
          })
        ).unwrap();

        toast.success(`${quantity} item(s) added to cart!`);

        await dispatch(fetchCart()).unwrap();
      } catch (error) {
        setNotification({ type: "error", message: "Something went wrong!" });
      }
    } else {
      toast.error("Out of stock!");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

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
              {/* Main Image Section with Hover Zoom Effect */}
              <div className="w-full md:w-2/3 lg:w-1/2 relative">
                <div className="overflow-hidden rounded-lg shadow-lg mb-4">
                  {/* Main image container */}
                  <div className="w-full h-80">
                    <img
                      src={mainImage}
                      alt={productDetail.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-125"
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                    />
                  </div>
                </div>
                {/* Slider for other images */}
                {productDetail.variants?.[0]?.images?.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {productDetail.variants[0].images.map((img, index) => (
                      <div
                        key={index}
                        className="px-1 py-1 cursor-pointer" // Added cursor-pointer for clickable images
                        onClick={() => handleImageClick(img.url)} // Update main image on click
                      >
                        <img
                          src={img.url || placeholderImage}
                          alt={`${productDetail.name} ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.src = placeholderImage;
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <p className="text-gray-500">
                    No more images available for this product.
                  </p>
                )}
              </div>

              {/* Product Details Section */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {productDetail.name}
                </h1>
                <p className="text-gray-700 mb-2">
                  {productDetail.description.short}
                </p>
                <p className="text-2xl font-semibold mb-2">
                  Rf {productDetail.variants?.[0]?.price}
                </p>
                <hr className="my-6 h-0.5 border-t-0 bg-indigo-950" />
                {productDetail.variants?.[0]?.stock > 0 ? (
                  <p className="text-green-500 font-medium mb-4">
                    In Stock ({productDetail.variants?.[0]?.stock} left)
                  </p>
                ) : (
                  <p className="text-red-500 font-medium mb-4">Out of Stock</p>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="ml-0">
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
