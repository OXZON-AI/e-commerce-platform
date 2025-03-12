import { Fragment, React } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  DollarSign,
  Gift,
  Search,
  Shield,
  Headphones,
  Users,
  ShoppingBag,
  Globe,
} from "lucide-react";
import LayoutOne from "../../layouts/LayoutOne";
import { ChevronDown, Mouse } from "lucide-react";
import ExtensiveProductRange from "../../assets/images/AboutUS/Extensive-Product-Range.jpg";
import image1 from "../../assets/images/AboutUS/image1.jpg";
import heroImage from "../../assets/images/AboutUS/image.png";

import image2 from "../../assets/images/AboutUS/image2.jpg";
import AdvancedAdminTools from "../../assets/images/AboutUS/Advanced-Admin-Tools.jpeg";
import UserFriendlyInterface from "../../assets/images/AboutUS/User-Friendly-Interface.avif";

const AboutUs = () => {
  return (
    <Fragment>
      <LayoutOne>
        <div className="bg-gray-50 text-gray-900 overflow-x-hidden">
          {/* Hero Section */}
          <section className="relative w-screen h-screen min-h-[450px] text-white">
            {" "}
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover"
                src={heroImage}
                alt="Genuine Electronics Background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-purple-500/20" />
            </div>
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6 lg:px-16 max-w-7xl mx-auto">
              <motion.h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                About Genuine Electronics
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl  text-white"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{
                  textShadow: `
      1px 1px 2px rgba(0, 0, 0, 0.8),
      -1px -1px 2px rgba(0, 0, 0, 0.8),
      1px -1px 2px rgba(0, 0, 0, 0.8),
      -1px 1px 2px rgba(0, 0, 0, 0.8)
    `,
                }}
              >
                Your premier online destination for high-quality electronic
                products in the Maldives.
              </motion.p>

              {/* Scroll down button */}
              <motion.div
                className="mt-8 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
              >
                <div className="relative inline-block">
                  <Mouse className="text-white w-12 h-12 animate-[scroll-wheel_2s_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center pt-1">
                    <div className="w-1 h-4 bg-white rounded-full animate-[scroll-dot_2s_infinite]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Who We Are Section */}
          <section className="bg-gray-50 py-16 px-4">
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
              {/* Image Section */}
              <motion.div
                className="md:w-1/2 w-full overflow-hidden"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img
                  className="w-full h-full object-cover rounded-none shadow-md"
                  src={image1}
                  alt="Who We Are"
                />
              </motion.div>

              {/* Description Section */}
              <motion.div
                className="md:w-1/2 w-full text-left"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                  Who We Are
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded in 2025, Genuine Electronics has quickly established
                  itself as a trusted name in the Maldivian e-commerce
                  landscape. We are dedicated to providing our customers with
                  access to a wide range of electronic products from renowned
                  international brands. Our commitment to quality and customer
                  satisfaction sets us apart, ensuring that every purchase meets
                  the highest standards.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Our Vision Section */}
          <section className="bg-gray-100 py-16 px-4">
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
              {/* Description Section */}
              <motion.div
                className="md:w-1/2 w-full text-left"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  At Genuine Electronics, we envision a shopping experience that
                  is not only convenient but also enjoyable. We aim to empower
                  our customers by providing them with the tools they need to
                  make informed purchasing decisions. Our platform is designed
                  to cater to both tech enthusiasts and everyday consumers
                  seeking reliable electronics at competitive prices.
                </p>
              </motion.div>

              {/* Image Section */}
              <motion.div
                className="md:w-1/2 w-full  overflow-hidden"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img
                  className="w-full h-full object-cover rounded-none shadow-md"
                  src={image2}
                  alt="Our Vision"
                />
              </motion.div>
            </div>
          </section>

          {/* What We Offer Section */}
          <section className="bg-white py-16 px-4 text-center">
            <motion.h2
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              What We Offer
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
              {[
                {
                  title: "Extensive Product Range",
                  description:
                    "From the latest smartphones and laptops to home appliances and smart gadgets, we offer a comprehensive selection of electronics tailored to meet diverse needs.",
                  img: ExtensiveProductRange,
                },
                {
                  title: "User-Friendly Interface",
                  description:
                    "Our website features an intuitive design that allows customers to easily browse products, manage their shopping carts, and complete transactions securely.",
                  img: UserFriendlyInterface,
                },
                {
                  title: "Advanced Admin Tools",
                  description:
                    "Our system includes robust tools for managing inventory, processing orders efficiently, and gaining insights from sales data, ensuring a smooth operation behind the scenes.",
                  img: AdvancedAdminTools,
                },
              ].map((offer, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-50 shadow-md rounded-lg  overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <img
                    className="rounded-none w-full h-40 object-cover"
                    src={offer.img}
                    alt={offer.title}
                  />
                  <h3 className="font-semibold text-xl mt-4">{offer.title}</h3>
                  <p className="text-gray-600">{offer.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Customer Experience Section */}
          <section className="bg-gray-50 py-16 px-4">
            <motion.h2
              className="text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Customer Experience
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Efficient Navigation",
                  description:
                    "Effortless product search with categories and filters to narrow down options.",
                  icon: <Search className="text-blue-600" size={48} />,
                },
                {
                  title: "Secure Transactions",
                  description:
                    "Reliable payment options with robust data protection measures.",
                  icon: <Shield className="text-green-600" size={48} />,
                },
                {
                  title: "Customer Support",
                  description:
                    "Dedicated support team to assist with inquiries and issues.",
                  icon: <Headphones className="text-purple-600" size={48} />,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-none shadow-lg hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-4 rounded-full">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="bg-white py-16 px-4 text-center">
            <motion.h2
              className="text-4xl font-semibold mb-10 text-gray-800"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Why Choose Us?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                {
                  text: "Quality Assurance: Authentic products from reputable manufacturers.",
                  icon: <CheckCircle className="text-blue-600" size={36} />,
                  direction: "left",
                },
                {
                  text: "Competitive Pricing: Competitive rates through international vendor connections.",
                  icon: <DollarSign className="text-green-600" size={36} />,
                  direction: "center",
                },
                {
                  text: "Exclusive Offers: Special promotions and discounts for an enhanced shopping experience.",
                  icon: <Gift className="text-pink-600" size={36} />,
                  direction: "right",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white text-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  initial={{
                    opacity: 0,
                    x:
                      item.direction === "left"
                        ? -100
                        : item.direction === "right"
                        ? 100
                        : 0,
                    y: item.direction === "center" ? 50 : 0,
                  }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                >
                  <div className="flex items-center justify-center bg-gray-100 p-4 rounded-full mb-6">
                    {item.icon}
                  </div>
                  <p className="text-lg text-center">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Join Us on This Journey Section */}
          <section className="bg-gradient-to-r from-purple-500 to-purple-600 py-16 px-4 text-white text-center">
            <motion.h2
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Join Us on This Journey
            </motion.h2>
            <motion.p
              className="text-lg mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              As we continue to grow and evolve, we invite you to be part of our
              community. Whether you're looking for the latest electronics or
              seeking advice on your next purchase, Genuine Electronics is here
              to help you every step of the way.
            </motion.p>

            {/* Icons with Motion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
              {[
                {
                  title: "Explore Our Offerings",
                  description:
                    "Discover a wide range of the latest electronics and stay ahead with innovation.",
                  icon: <ShoppingBag className="text-white" size={48} />,
                },
                {
                  title: "Community Support",
                  description:
                    "Join a community of tech enthusiasts, get advice, and share experiences.",
                  icon: <Users className="text-white" size={48} />,
                },
                {
                  title: "Global Reach",
                  description:
                    "Shop with ease and enjoy shipping to the Maldives and beyond.",
                  icon: <Globe className="text-white" size={48} />,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white text-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-500 p-4 rounded-full">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Final Call to Action */}
            <motion.a
              href="http://localhost:5000/"
              className="inline-block bg-yellow-500 text-black py-3 px-8 rounded-full text-xl font-semibold transition-transform duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Explore Genuine Electronics
            </motion.a>
          </section>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default AboutUs;
