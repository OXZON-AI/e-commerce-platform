import { Fragment, React } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaQuestionCircle,
} from "react-icons/fa";
import LayoutOne from "../../layouts/LayoutOne";

const ContactUs = () => {
  return (
    <Fragment>
      <LayoutOne>
        <div className="bg-gray-50 text-gray-800 min-h-screen p-4">
          {/* Hero Section */}
          <section className="text-center py-20 md:py-24 bg-purple-500 text-white">
            <motion.h1
              className="text-4xl md:text-5xl font-bold leading-tight"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              We are here to help you. Reach out to us and we will assist you
              with your needs!
            </motion.p>
          </section>

          {/* Combined Section */}
          <section className="container mx-auto mt-10 grid grid-cols-1 gap-8 space-y-8">
            <div className="flex justify-center items-center w-full h-full p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-10 sm:gap-28 p-10 transition-shadow duration-300">
                {/* Get In Touch Section */}
                <motion.div
                  className="space-y-6 w-full sm:w-1/3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <FaEnvelope className="text-blue-500" />
                    Get In Touch
                  </h2>
                  <p className="text-gray-600 flex items-center gap-3">
                    <FaMapMarkerAlt className="text-green-500" />
                    Orchid Magu, Thinadhoo, Maldives
                  </p>
                  <p className="text-gray-600 flex items-center gap-3">
                    <FaPhoneAlt className="text-red-500" />
                    <a href="tel:+9607898085" className="hover:text-blue-600">
                      +960 7898085
                    </a>
                  </p>
                  <p className="text-gray-600 flex items-center gap-3">
                    <FaEnvelope className="text-yellow-500" />
                    <a
                      href="mailto:info@genuineelectronics.com"
                      className="hover:text-blue-600"
                    >
                      genuineelectronics8@gmail.com
                    </a>
                  </p>
                </motion.div>

                {/* Operation Hours Section */}
                <motion.div
                  className="space-y-6 w-full sm:w-1/3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <FaClock className="text-blue-500" />
                    Operation Hours
                  </h3>
                  <p className="text-gray-600">Mon - Sat: 09:00 – 18:00</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </motion.div>

                {/* Follow Us Section */}
                <motion.div
                  className="space-y-6 w-full sm:w-1/3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h4 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <FaUsers className="text-blue-500" />
                    Follow Us
                  </h4>
                  <div className="flex gap-6 justify-start">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-600 transform transition-all duration-300 hover:scale-110"
                    >
                      <FaFacebook className="text-3xl" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-pink-600 transform transition-all duration-300 hover:scale-110"
                    >
                      <FaInstagram className="text-3xl" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-400 transform transition-all duration-300 hover:scale-110"
                    >
                      <FaTwitter className="text-3xl" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-700 transform transition-all duration-300 hover:scale-110"
                    >
                      <FaLinkedinIn className="text-3xl" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="w-full rounded-none overflow-hidden shadow-lg">
              {/* <iframe className="w-full h-72" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345097647!2d144.95373541531582!3d-37.81627977975139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577e8bfa5c98ab0!2sOrchid%20Magu%2C%20Thinadhoo!5e0!3m2!1sen!2smv!4v1696839243654!5m2!1sen!2smv" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
              <iframe
                title="Google Maps Location"
                className="w-full h-72"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345097647!2d144.95373541531582!3d-37.81627977975139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577e8bfa5c98ab0!2sOrchid%20Magu%2C%20Thinadhoo!5e0!3m2!1sen!2smv!4v1696839243654!5m2!1sen!2smv"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <form className="bg-white rounded-none shadow-md p-8 space-y-6 transition duration-300 hover:shadow-lg">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 text-center">
                Send Us a Message
              </h2>

              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-1/2 p-4 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-1/2 p-4 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Your Contact Number"
                  className="w-1/2 p-4 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                />
                <input
                  type="subject"
                  placeholder="Subject"
                  className="w-1/2 p-4 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                />
              </div>

              <textarea
                placeholder="Your Message"
                className="w-full p-4 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                rows="5"
                required
              ></textarea>

              <div className="flex justify-center">
                <button className="bg-purple-600 text-white py-3 px-8 rounded-sm hover:bg-purple-700 hover:shadow-md transition duration-300">
                  Submit
                </button>
              </div>
            </form>

            <div className="mt-6 flex space-x-4 justify-start">
              <a
                href="http://localhost:5000/faqs"
                className="text-blue-600 font-bold text-xl flex items-center gap-2 hover:text-blue-800 transition-all duration-300"
              >
                <FaQuestionCircle className="text-2xl" />
                FAQs
              </a>
            </div>
          </section>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ContactUs;
