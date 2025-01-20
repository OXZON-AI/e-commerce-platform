import { Fragment, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";

const MyAccount = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (profile.password !== profile.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!profile.firstName) {
      errors.firstName = "First name is required.";
    }
    if (!profile.lastName) {
      errors.lastName = "Last name is required.";
    }
    if (!profile.phone || !/^\d{10}$/.test(profile.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Profile saved:", profile);
      alert("Profile updated successfully!");
    }
  };

  return (
    <Fragment>
      <LayoutOne>
        <div className="myaccount-area py-10 bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="w-full lg:w-2/3 xl:w-1/2">
                <div className="bg-white shadow-lg rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    My Account
                  </h2>
                  <Accordion defaultActiveKey="0" className="space-y-6">
                    {/* Edit Account Information */}
                    <Accordion.Item
                      eventKey="0"
                      className="rounded-lg overflow-hidden shadow-md"
                    >
                      <Accordion.Header className="bg-gray-100 hover:bg-gray-200 transition p-4">
                        <span className="mr-2 text-gray-500 font-medium">
                          1.
                        </span>
                        Edit Your Profile Information
                      </Accordion.Header>
                      <Accordion.Body className="bg-white p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-700">
                              My Profile Information
                            </h4>
                            <p className="text-sm text-gray-500">
                              Your Personal Details
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                First Name
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                              {errors.firstName && (
                                <p className="text-sm text-red-500 mt-1">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Last Name
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                              {errors.lastName && (
                                <p className="text-sm text-red-500 mt-1">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                            <div className="col-span-full">
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Address
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                              {errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Phone
                              </label>
                              <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                              {errors.phone && (
                                <p className="text-sm text-red-500 mt-1">
                                  {errors.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="px-5 py-2 bg-gray-300 text-black text-sm font-medium rounded-lg shadow-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Change Password */}
                    <Accordion.Item
                      eventKey="1"
                      className="rounded-lg overflow-hidden shadow-md"
                    >
                      <Accordion.Header className="bg-gray-100 hover:bg-gray-200 transition p-4">
                        <span className="mr-2 text-gray-500 font-medium">
                          2.
                        </span>
                        Change Your Password
                      </Accordion.Header>
                      <Accordion.Body className="bg-white p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-700">
                              Change Password
                            </h4>
                            <p className="text-sm text-gray-500">
                              Update your password securely
                            </p>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="password"
                                value={profile.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={profile.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                              {errors.confirmPassword && (
                                <p className="text-sm text-red-500 mt-1">
                                  {errors.confirmPassword}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="px-5 py-2 bg-gray-300 text-black text-sm font-medium rounded-lg shadow-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
