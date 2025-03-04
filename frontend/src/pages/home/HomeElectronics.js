import {
  LocalShippingOutlined,
  Star,
  CreditCardOutlined,
  ShieldOutlined,
} from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaCartPlus } from "react-icons/fa";
import { Fragment, React, useEffect } from "react";
import Slider from "react-slick";
import LayoutOne from "../../layouts/LayoutOne";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/category-slice";
import { Link, useNavigate } from "react-router-dom";
import bannerImg from "../../assets/images/bannerv2.png";
import {
  fetchProducts,
  fetchRecommendProducts,
} from "../../store/slices/product-slice";
import placeholderImage from "../../assets/images/placeholder_image.png";
import recommendsImg from "../../assets/images/recommends.svg";
import { addToCart, fetchCart } from "../../store/slices/cart-slice";
import { toast } from "react-toastify";

const HomeElectronics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loadingCategories, errorCategory } = useSelector(
    (state) => state.categories
  );
  const {
    recommendProducts,
    items,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.product);
  const {
    userInfo,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);
  const { status: cartStatus, error: cartError } = useSelector(
    (state) => state.cart
  );

  // effect hook for fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // effect hook for fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // effect hook for fetch user recommend products
  useEffect(() => {
    dispatch(fetchRecommendProducts());
  }, [dispatch]);

  // handler for addToCart
  const addToCartHandler = async (product) => {
    if (product.defaultVariant?.stock > 0) {
      try {
        await dispatch(
          addToCart({
            variantId: product.defaultVariant?._id,
            quantity: 1,
          })
        ).unwrap(); // Ensures we get the resolved response of the async thunk

        toast.success("item added to cart!");

        await dispatch(fetchCart()).unwrap(); // Wait for addToCart to complete, then fetch the latest cart
      } catch (error) {
        toast.error("Something went wrong!");
      }
    } else {
      toast.error("Out of stock!");
    }
  };

  // Slick slider settings for the product carousel
  const productSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const brandSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  // Slick slider settings for the hero and testimonials sections
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
    pauseOnHover: true,
  };

  const offers = [
    {
      id: 1,
      title: "Limited-Time Offer",
      description: "Get up to 50% off on select items!",
      image: "https://dummyimage.com/400x250/FF9D8B/fff",
      link: "/shop-now",
    },
    {
      id: 2,
      title: "Buy 1 Get 1 Free",
      description: "Exclusive BOGO offer on selected products!",
      image: "https://dummyimage.com/400x250/64B1EF/fff",
      link: "/bogo-deals",
    },
    {
      id: 3,
      title: "Flash Sale!",
      description: "Limited stocks available, hurry up!",
      image: "https://dummyimage.com/400x250/65F565/fff",
      link: "/flash-sale",
    },
  ];

  return (
    <Fragment>
      <LayoutOne>
        <div className="bg-gray-100">
          {/* Hero Section with Swiping Images */}

          {/* <div className="relative w-full h-[600px] overflow-hidden"> */}
          {/* Image Slider */}
          {/* <Slider {...sliderSettings}>
              <div className="w-full h-full">
                <img
                  src="https://dummyimage.com/1920x600/ff6347/fff"
                  alt="Hero 1"
                  className="w-full h-full object-cover object-center transition-transform transform hover:scale-110 duration-700"
                />
              </div>
              <div className="w-full h-full">
                <img
                  src="https://dummyimage.com/1920x600/6b21a8/fff"
                  alt="Hero 2"
                  className="w-full h-full object-cover object-center transition-transform transform hover:scale-110 duration-700"
                />
              </div>
              <div className="w-full h-full">
                <img
                  src="https://dummyimage.com/1920x600/5b21b8/fff"
                  alt="Hero 3"
                  className="w-full h-full object-cover object-center transition-transform transform hover:scale-110 duration-700"
                />
              </div>
              <div className="w-full h-full">
                <img
                  src="https://dummyimage.com/1920x600/a96232/fff"
                  alt="Hero 4"
                  className="w-full h-full object-cover object-center transition-transform transform hover:scale-110 duration-700"
                />
              </div>
              <div className="w-full h-full">
                <img
                  src="https://dummyimage.com/1920x600/8b5cf6/fff"
                  alt="Hero 5"
                  className="w-full h-full object-cover object-center transition-transform transform hover:scale-110 duration-700"
                />
              </div>
            </Slider> */}

          {/* Animated Text Overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center text-white text-center bg-gradient-to-b from-purple-800 to-transparent p-6">
              <div className="space-y-4 animate-fade-down">
                <h1 className="text-5xl font-extrabold animate-slide-down">
                  Discover the Future of Electronics
                </h1>
                <p className="text-lg animate-slide-down-delay">
                  Exclusive gadgets & unbeatable deals.
                </p>
                <button className="mt-6 px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
                  Shop Now
                </button>
              </div>
            </div>
          </div> */}

          {/* Hero Section with Swiping Images */}
          <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
            {/* Static Images */}
            <div className="w-full h-full">
              <img
                src={bannerImg}
                alt="Hero 1"
                className="w-full h-full object-cover object-center transition-transform transform hover:scale-110 duration-700"
              />
            </div>

            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-center bg-[linear-gradient(to_bottom,_transparent,_#000000)] p-6">
              <div className="space-y-4 animate-fade-down">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white text-shadow-md font-extrabold animate-slide-down">
                  Discover the Future of Electronics
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 text-shadow-md animate-slide-down-delay">
                  Exclusive gadgets & unbeatable deals.
                </p>
                <button
                  className="mt-6 px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                  onClick={() => navigate("/product-catalogue")}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="container mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-6">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories &&
                categories.map((category, index) => (
                  <Link key={index} to={`/product-catalogue/${category.slug}`}>
                    <div className="bg-white p-4 transition-all transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
                      <img
                        src={category.image.url}
                        alt={category.image.alt}
                        className="h-[200px] mx-auto"
                      />
                      <h3 className="text-xl font-semibold text-center mt-3">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Featured Products with Sliding Effect */}
          {/* Featured Products with Sliding Effect */}
          <div className="container mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-6">
              Featured Products
            </h2>
            <Slider {...productSliderSettings}>
              {items &&
                items.map((product) => (
                  <div key={product._id} className="p-4">
                    <div className="bg-white p-4 rounded-lg hover:shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out text-center">
                      <Link to={`/product/${product.slug}`}>
                        {/* Product Image (Centered) */}
                        <div className="flex justify-center items-center mb-4">
                          <div className="h-48 w-48 bg-white rounded-lg flex items-center justify-center">
                            <img
                              src={
                                product.defaultVariant?.image?.url ||
                                placeholderImage
                              }
                              alt={
                                product.defaultVariant?.image?.alt ||
                                "Recommended product image"
                              }
                              onError={(e) => {
                                e.target.src = placeholderImage;
                              }}
                              className="h-40 object-contain"
                            />
                          </div>
                        </div>
                      </Link>

                      {/* Product Details */}
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="text-md font-semibold text-gray-800 text-center truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-md text-center">
                        {product.defaultVariant?.price || "N/A"} MVR
                      </p>

                      {/* Centered Add to Cart Button */}
                      <div className="flex justify-center mt-3">
                        <button
                          className={`px-5 py-2 bg-blue-600 text-white font-semibold rounded-md ${
                            product.defaultVariant?.stock > 0
                              ? "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300"
                              : "bg-gray-400 cursor-not-allowed"
                          } transition duration-300 ease-in-out flex items-center`}
                          disabled={
                            product.defaultVariant?.stock === 0 ||
                            cartStatus === "loading-add-to-cart"
                          }
                          onClick={() => addToCartHandler(product)}
                        >
                          <FaCartPlus className="mr-2" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>

          {/* Just for You Section */}
          {userInfo && userInfo ? (
            <div className="container mx-auto py-12">
              <h2 className="text-4xl font-bold text-center text-black mb-10">
                Just for You
              </h2>
              <div className="space-y-8">
                {recommendProducts &&
                  recommendProducts.map((categoryItem) => (
                    <div
                      key={categoryItem._id}
                      className="bg-white p-6 rounded-lg"
                    >
                      {/* Category Name Container */}
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {categoryItem.category.name} for you!
                      </h2>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categoryItem.products &&
                          categoryItem.products.map((product) => (
                            <div
                              key={product._id}
                              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 ease-in-out"
                            >
                              {/* Product Image (Centered) */}
                              <Link to={`/product/${product.slug}`}>
                                <div className="flex justify-center items-center mb-4">
                                  <div className="h-48 w-48 bg-whhite rounded-lg flex items-center justify-center">
                                    <img
                                      src={
                                        product.defaultVariant?.image?.url ||
                                        placeholderImage
                                      }
                                      alt={
                                        product.defaultVariant?.image?.alt ||
                                        "Recommen product image"
                                      }
                                      onError={(e) => {
                                        e.target.src = placeholderImage;
                                      }}
                                      className="h-40 object-contain"
                                    />
                                  </div>
                                </div>
                              </Link>

                              {/* Product Details */}
                              <Link to={`/product/${product.slug}`}>
                                <h3 className="text-lg font-semibold text-purple-800 text-center">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-md text-center">
                                {product.defaultVariant?.price || "N/A"} MVR
                              </p>

                              {/* Centered Add to Cart Button */}
                              <div className="flex justify-center mt-3">
                                <button
                                  className={`px-5 py-2 bg-blue-600 text-white font-semibold rounded-md ${
                                    product.defaultVariant?.stock > 0
                                      ? "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300"
                                      : "bg-gray-400 cursor-not-allowed"
                                  } transition duration-300 ease-in-out flex items-center`}
                                  disabled={
                                    product.defaultVariant?.stock === 0 ||
                                    cartStatus === "loading-add-to-cart"
                                  }
                                  onClick={() => addToCartHandler(product)}
                                >
                                  <FaCartPlus className="mr-2" /> Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="w-full bg-white py-16 flex items-center justify-center">
              <div className="container mx-auto flex flex-col md:flex-row items-center">
                {/* Left Side - Vector Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <img
                    src={recommendsImg} // Replace with your actual vector image path
                    alt="Recommend vector Image"
                    className="max-w-sm md:max-w-md"
                  />
                </div>

                {/* Right Side - Instruction Text */}
                <div className="w-full md:w-1/2 text-start md:text-left px-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Log in or Sign up for Recommendations
                  </h2>
                  <p className="text-gray-600 mt-3">
                    <span className="font-medium">
                      We will recommend the best products based on your
                      experience with us.
                    </span>{" "}
                    Sign up or log in now to get personalized suggestions!
                  </p>

                  {/* Login Button */}
                  <div className="mt-5">
                    <button
                      className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                      onClick={() => navigate("/login-register")}
                    >
                      Log In / Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Promotional Banner */}
          {/* <div
            className="relative w-full h-[300px] bg-cover bg-center flex items-center justify-center text-white text-center transition-all duration-300 hover:bg-opacity-70"
            style={{
              backgroundImage:
                "url('https://dummyimage.com/1920x300/ff6347/fff')",
            }}
          >
            <div className="bg-black bg-opacity-50 p-6 rounded-xl">
              <h2 className="text-4xl font-bold">Limited-Time Offer</h2>
              <p className="text-lg mt-2">Get up to 50% off on select items!</p>
              <button className="mt-4 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
                Shop Now
              </button>
            </div>
          </div> */}

          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">
              Ongoing Offers
            </h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative bg-cover bg-center rounded-sm overflow-hidden shadow-lg transition-transform transform hover:scale-105 h-[400px]"
                  style={{ backgroundImage: `url(${offer.image})` }}
                >
                  <div className="bg-black bg-opacity-50 p-8 h-full flex flex-col justify-center items-center text-white text-center">
                    <h3 className="text-2xl font-semibold">{offer.title}</h3>
                    <p className="text-lg mt-2">{offer.description}</p>
                    <a
                      href={offer.link}
                      className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Logos */}
          <div className="container mx-auto py-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Trusted Brands</h2>
            <Slider {...brandSliderSettings}>
              {[1, 2, 3, 4, 5, 6].map((brand) => (
                <div key={brand}>
                  <img
                    src="https://dummyimage.com/150x150/9678b6/fff"
                    alt="Brand"
                    className="mx-auto transition-transform transform hover:scale-110 duration-300 ease-in-out"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default HomeElectronics;
