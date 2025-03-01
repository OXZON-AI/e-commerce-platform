import {
  LocalShippingOutlined,
  Star,
  CreditCardOutlined,
  ShieldOutlined,
} from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaCartPlus } from "react-icons/fa";
import { Fragment, React } from "react";
import Slider from "react-slick";
import LayoutOne from "../../layouts/LayoutOne";
const HomeElectronics = () => {
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

  return (
    <Fragment>
      <LayoutOne>
        <div className="bg-gray-100">
          {/* Hero Section with Swiping Images */}

          <div className="relative w-full h-[600px] overflow-hidden">
            {/* Image Slider */}
            <Slider {...sliderSettings}>
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
            </Slider>

            {/* Animated Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-center bg-gradient-to-b from-purple-800 to-transparent p-6">
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
          </div>

          {/* Categories Section */}
          <div className="container mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-6">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Laptops", "Smartphones", "Accessories", "Gaming"].map(
                (category, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 transition-all transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out"
                  >
                    <img
                      src={`https://dummyimage.com/300x350/000/fff`}
                      alt={category}
                      className=" mx-auto"
                    />
                    <h3 className="text-xl font-semibold text-center mt-3">
                      {category}
                    </h3>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Featured Products with Sliding Effect */}
          <div className="container mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-6">
              Featured Products
            </h2>
            <Slider {...productSliderSettings}>
              {[1, 2, 3, 4, 5, 6].map((product) => (
                <div key={product} className="p-4">
                  <div className="bg-white p-4 rounded-none hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out text-center">
                    <img
                      src={`https://dummyimage.com/300x200/000/fff`}
                      alt={`Product ${product}`}
                      className=" mb-4"
                    />
                    <h3 className="text-lg font-semibold">
                      Product Name {product}
                    </h3>
                    <p className="text-gray-500">$299.99</p>
                    <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
                      <FaCartPlus className="inline mr-2" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Just for You Section */}
          <div className="container mx-auto py-12">
            <h2 className="text-4xl font-bold text-center text-black mb-10">
              Just for You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(16)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out text-center"
                >
                  <img
                    src={`https://dummyimage.com/300x300/979797/fff&text=Product+${
                      index + 1
                    }`}
                    alt={`Product ${index + 1}`}
                    className="w-full h-64 object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold text-purple-800">
                    Product Name {index + 1}
                  </h3>
                  <p className="text-gray-600 text-lg">$299.99</p>
                  <button className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">
                    <FaCartPlus className="inline mr-2" /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Promotional Banner */}
          <div
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
          </div>

          {/* Testimonials with Auto Swiping Effect */}
          <div className="container mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-6">
              Customer Reviews
            </h2>
            <Slider
              {...{
                autoplay: true, // Enables auto sliding
                autoplaySpeed: 3000, // Time between slides (in milliseconds)
                infinite: true, // Loops the slides infinitely
                slidesToShow: 1, // Number of slides to show at a time
                slidesToScroll: 1, // Number of slides to scroll at a time
                arrows: true, // Display arrows for navigation
                dots: true, // Show navigation dots below the slider
                speed: 500, // Speed of transition between slides
                pauseOnHover: true, // Pauses the sliding when the user hovers over the slider
              }}
            >
              {[
                { text: "Great product! Highly recommend.", rating: 5 },
                { text: "Amazing quality, will buy again!", rating: 4 },
                {
                  text: "Satisfactory experience, good value for money.",
                  rating: 4,
                },
                {
                  text: "Excellent customer service and fast delivery.",
                  rating: 5,
                },
                {
                  text: "It exceeded my expectations, totally worth it!",
                  rating: 5,
                },
                { text: "Good product but needs some improvement.", rating: 3 },
              ].map((review, index) => (
                <div
                  key={index}
                  className=" p-6 rounded-none shadow-none hover:shadow-xl transition-transform transform hover:scale-110 duration-300 ease-in-out flex flex-col items-center"
                >
                  <p className="text-gray-700 italic text-center text-xl md:text-2xl">
                    “{review.text}”
                  </p>
                  <div className="flex mt-3 items-center justify-center">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="text-yellow-500" />
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <Star key={i} className="text-gray-300" />
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
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

          {/* Newsletter Subscription */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 py-12 text-center rounded-lg shadow-xl">
            <h2 className="text-4xl font-extrabold mb-4 text-white">
              Stay Updated
            </h2>
            <p className="text-lg text-white mb-6">
              Subscribe to receive exclusive offers and the latest news!
            </p>

            <div className="flex justify-center items-center w-full max-w-lg mx-auto">
              <form className="flex w-full space-x-4 max-w-md">
                {/* Email Input Field */}
                <input
                  className="w-full px-4 py-2 text-lg rounded-md border-2 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                  id="mce-EMAIL"
                  placeholder="Enter your email"
                  required
                  type="email"
                  value=""
                  aria-required="true"
                />

                {/* Subscribe Button */}
                <button
                  className="w-full sm:w-auto px-4 py-2 text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default HomeElectronics;
