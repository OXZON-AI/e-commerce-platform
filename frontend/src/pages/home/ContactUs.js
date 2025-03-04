import { Fragment, React, useState } from "react";
import axios from "axios"; // 🆕 Added axios to send the form data
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
} from "react-icons/fa";
import LayoutOne from "../../layouts/LayoutOne";

const ContactUs = () => {
  // 🆕 State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiry: "",
  });

  // 🆕 Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🆕 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/v1/contact", formData);
      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        inquiry: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    }
  };

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

          {/* Contact Details */}
          <section className="container mx-auto mt-10 grid grid-cols-1 gap-8 space-y-8">
            <div className="flex justify-center items-center w-full h-full p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-10 sm:gap-28 p-10">
                {/* Get In Touch */}
                <motion.div
                  className="space-y-6 w-full sm:w-1/3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <FaEnvelope className="text-blue-500" />
                    Get In Touch
                  </h2>
                  <p className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-green-500" />
                    Orchid Magu, Thinadhoo, Maldives
                  </p>
                  <p className="flex items-center gap-3">
                    <FaPhoneAlt className="text-red-500" />
                    <a href="tel:+9607898085">+960 7898085</a>
                  </p>
                  <p className="flex items-center gap-3">
                    <FaEnvelope className="text-yellow-500" />
                    <a href="mailto:genuineelectronics8@gmail.com">
                      genuineelectronics8@gmail.com
                    </a>
                  </p>
                </motion.div>

                {/* Operation Hours */}
                <motion.div
                  className="space-y-6 w-full sm:w-1/3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <FaClock className="text-blue-500" />
                    Operation Hours
                  </h3>
                  <p>Mon - Sat: 09:00 – 18:00</p>
                  <p>Sunday: Closed</p>
                </motion.div>

                {/* Follow Us */}
                <motion.div
                  className="space-y-6 w-full sm:w-1/3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h4 className="text-xl font-bold flex items-center gap-3">
                    <FaUsers className="text-blue-500" />
                    Follow Us
                  </h4>
                  <div className="flex gap-6">
                    <a href="https://facebook.com" target="_blank">
                      <FaFacebook className="text-3xl" />
                    </a>
                    <a href="https://instagram.com" target="_blank">
                      <FaInstagram className="text-3xl" />
                    </a>
                    <a href="https://twitter.com" target="_blank">
                      <FaTwitter className="text-3xl" />
                    </a>
                    <a href="https://linkedin.com" target="_blank">
                      <FaLinkedinIn className="text-3xl" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Google Maps */}
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

            {/* 🆕 Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md p-8 space-y-6"
            >
              <h2 className="text-4xl font-bold text-center">Send Us a Message</h2>

              <div className="flex space-x-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-1/2 p-4 border rounded-sm"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-1/2 p-4 border rounded-sm"
                />
              </div>

              <div className="flex space-x-4">
                <input
                  name="phone"
                  type="text"
                  placeholder="Your Contact Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-1/2 p-4 border rounded-sm"
                />
                <input
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-1/2 p-4 border rounded-sm"
                />
              </div>

              <textarea
                name="inquiry"
                placeholder="Your Message"
                value={formData.inquiry}
                onChange={handleChange}
                required
                rows="5"
                className="w-full p-4 border rounded-sm"
              ></textarea>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-3 px-8 rounded-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </section>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ContactUs;
