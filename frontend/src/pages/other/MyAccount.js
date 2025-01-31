import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  clearSuccess,
  setUser,
  clearError,
} from "../../store/slices/user-slice";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";

const MyAccount = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error, success } = useSelector(
    (state) => state.user
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form1Errors, setForm1Errors] = useState({});
  const [form2Errors, setForm2Errors] = useState({});

  useEffect(() => {
    if (success) {
      setSuccessMessage("Profile updated successfully!");
      dispatch(clearSuccess());
      setPassword("");
      setConfirmPassword("");
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    // If Redux userInfo is empty, try fetching from localStorage
    if (!userInfo || Object.keys(userInfo).length === 0) {
      const persistedData = localStorage.getItem("persist:frontend");
      if (persistedData) {
        const parsedData = JSON.parse(persistedData);
        const user = JSON.parse(parsedData.user);
        if (user) dispatch(setUser(user));
      }
    }

    // Populate form fields if user data exists
    if (userInfo && userInfo.name) {
      const [first, ...rest] = userInfo.name.split(" ");
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
      setEmail(userInfo.email || "");
      setPhone(userInfo.phone || "");
    }
  }, [dispatch, userInfo]);

  // validate user details form
  const validateDetailsForm = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = "First name is required.";
    if (!lastName.trim()) errors.lastName = "Last name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      errors.email = "Please enter valid email.";
    if (!phone.trim() || !/^[0-9]{7}$/.test(phone))
      errors.phone = "Please enter a valid 7-digit phone number.";

    setForm1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // validate password form
  const validatePasswordForm = () => {
    const errors = {};
    if (!password.trim()) errors.password = "Password is required.";
    if (!confirmPassword.trim())
      errors.confirmPassword = "Confirm Password is required.";
    if (password && confirmPassword && password !== confirmPassword)
      errors.passwordMatch = "Passwords do not match.";

    setForm2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle user details update
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      dispatch(clearError());
    }
    setSuccessMessage("");

    // Check validation
    if (!validateDetailsForm()) return;

    // Combine firstName and lastName for the server
    const fullName = `${firstName} ${lastName}`.trim();

    const updatedData = {
      name: fullName,
      email,
      phone,
      // token: userInfo.token,
    };

    dispatch(updateUser({ userId: userInfo._id, userData: updatedData }));

    // Clear form2 errors when success is achieved in form1
    setForm2Errors({});
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      dispatch(clearError());
    }
    setSuccessMessage("");

    // Check validation
    if (!validatePasswordForm()) return;

    const updatedData = {
      password,
    };

    dispatch(updateUser({ userId: userInfo._id, userData: updatedData }));

    // Clear form1 errors when success is achieved in form2
    setForm1Errors({});
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
                  {successMessage && (
                    <div className="w-full bg-green-100 border border-green-500 text-green-700 p-4 rounded-md mb-4">
                      <p className="text-sm font-medium text-green-700">
                        {successMessage}
                      </p>
                    </div>
                  )}
                  {error && (
                    <div className="w-full bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-4">
                      <p className="text-sm font-medium text-red-700">
                        {error}
                      </p>
                    </div>
                  )}
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
                        <form
                          onSubmit={handleDetailsSubmit}
                          className="space-y-6"
                        >
                          <div>
                            <h4 className="text-lg font-semibold text-gray-700">
                              My Profile Information
                            </h4>
                            <p className="text-sm text-gray-500">
                              Your Personal Details
                            </p>
                          </div>
                          {userInfo ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  name="firstName"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                {form1Errors.firstName && (
                                  <p className="text-red-500 text-sm">
                                    {form1Errors.firstName}
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
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                {form1Errors.lastName && (
                                  <p className="text-red-500 text-sm">
                                    {form1Errors.lastName}
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
                                  value={"Ignore for now"}
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
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                {form1Errors.email && (
                                  <p className="text-red-500 text-sm">
                                    {form1Errors.email}
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
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                {form1Errors.phone && (
                                  <p className="text-red-500 text-sm">
                                    {form1Errors.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>Loading...</div>
                          )}
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="px-5 py-2 bg-gray-300 text-black text-sm font-medium rounded-lg shadow-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                              disabled={loading}
                            >
                              {loading ? "Saving..." : "Save"}
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
                        <form
                          onSubmit={handlePasswordSubmit}
                          className="space-y-6"
                        >
                          <div>
                            <h4 className="text-lg font-semibold text-gray-700">
                              Change Password
                            </h4>
                            <p className="text-sm text-gray-500">
                              Update your password securely
                            </p>
                          </div>
                          <div className="space-y-4">
                            {form2Errors.passwordMatch && (
                              <p className="text-sm text-red-500 mt-1">
                                {form2Errors.passwordMatch}
                              </p>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                              {form2Errors.password && (
                                <p className="text-red-500 text-sm">
                                  {form2Errors.password}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                              {form2Errors.confirmPassword && (
                                <p className="text-red-500 text-sm">
                                  {form2Errors.confirmPassword}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="px-5 py-2 bg-gray-300 text-black text-sm font-medium rounded-lg shadow-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                              disabled={loading}
                            >
                              {loading ? "Saving..." : "Save"}
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
