import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  clearError,
  clearSuccess,
} from "../../store/slices/user-slice";

const LoginRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const loginCaptchaRef = useRef(null); // used for to refer DOM element that using reRef const. in this case it is login form ReCaptcha element
  const registerCaptchaRef = useRef(null); // used for to refer DOM element that using reRef const. in this case it is register form ReCaptcha element

  const dispatch = useDispatch(); // Get the dispatch function
  const navigate = useNavigate();
  const { loading, error, success, userInfo } = useSelector(
    (state) => state.user
  );

  // Efect hook for if user already on the state redirection
  useEffect(() => {
    if (userInfo) {
      navigate(userInfo.role === "admin" ? "/admin-product" : "/");
    }
  }, [userInfo, navigate]);

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, []);

  // Helper function to validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to validate phone number
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{7}$/; // Matches a 7-digit phone number
    return phoneRegex.test(phone);
  };

  // Helper function to validate password
  const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
  };

  // Validate Login Form
  const validateLoginForm = () => {
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If there are no errors (newErrors is empty), the function will return true, indicating that the form is valid.
  };

  // Validate Register Form
  const validateRegisterForm = () => {
    const newErrors = {};

    if (!firstName) {
      newErrors.firstName = "First name is required.";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required.";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid 7-digit phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // recaptch check
  const executeReCaptcha = async (captchaRef) => {
    if (!captchaRef.current) return null;

    captchaRef.current.reset(); // Reset ReCAPTCHA before executing

    let timeoutId;
    try {
      return await Promise.race([
        captchaRef.current.executeAsync(),
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject("ReCAPTCHA timeout"), 100000); // 100 seconds
        }),
      ]);
    } catch (error) {
      console.error("ReCAPTCHA Error:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        recaptcha:
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred on ReCAPTCHA",
      }));
      return null;
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is cleared when execution finishes
    }
  };

  // Register Form Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // clear previous error state
    clearError(null); // clear previous server error state

    // Calling register form validation to check validations
    if (!validateRegisterForm()) {
      return;
    }
    try {
      // Concatenating name
      const fullName = `${firstName} ${lastName}`;

      // ReCaptcha Token
      const recaptchaToken = await executeReCaptcha(loginCaptchaRef);
      if (!recaptchaToken) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          recaptcha: "ReCAPTCHA verification failed. Please try again.",
        }));
        return;
      }

      const userdata = {
        email,
        password,
        name: fullName, //using concatenated value for name
        phone,
        token: recaptchaToken,
      };
      dispatch(registerUser(userdata)).unwrap();
    } catch (err) {
      console.error("Login Error:", err);
      setErrors((prevErrors) => ({
        ...prevErrors,
        register:
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred on login",
      }));
    }
  };

  // Login Form Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    clearError(null);

    // Calling login form validation to check validations
    if (!validateLoginForm()) {
      return;
    }

    try {
      // ReCaptcha Token
      const recaptchaToken = await executeReCaptcha(registerCaptchaRef);
      if (!recaptchaToken) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          recaptcha: "ReCAPTCHA verification failed. Please try again.",
        }));
        return;
      }
      await dispatch(loginUser({ email, password })).unwrap(); // save user data to redux
    } catch (err) {
      console.error("Login Error:", err);
      setErrors((prevErrors) => ({
        ...prevErrors,
        login:
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred",
      }));
    }
  };

  return (
    <Fragment>
      <LayoutOne>
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      {errors.recaptcha && (
                        <p className="text-red-600 mb-3">{errors.recaptcha}</p>
                      )}

                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            {error && (
                              <p className="text-red-600 mb-3">{error}</p>
                            )}
                            {errors.login && (
                              <p className="text-red-600 mb-3">
                                {errors.login}
                              </p>
                            )}
                            <form onSubmit={handleLoginSubmit}>
                              {errors.email && (
                                <p className="text-red-500 text-sm">
                                  {errors.email}
                                </p>
                              )}
                              <label htmlFor="user-email">Email</label>
                              <input
                                id="user-email"
                                type="email"
                                name="user-email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`${
                                  errors.email ? "border-red-500" : ""
                                }`}
                              />

                              {errors.password && (
                                <p className="text-red-500 text-sm">
                                  {errors.password}
                                </p>
                              )}
                              <label htmlFor="user-password">Password</label>
                              <input
                                id="user-password"
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${
                                  errors.password ? "border-red-500" : ""
                                }`}
                              />

                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/forgot-password"
                                    }
                                  >
                                    Forgot Password?
                                  </Link>
                                </div>

                                <ReCAPTCHA
                                  sitekey={
                                    process.env.REACT_APP_RECAPTCHA_SITE_KEY
                                  }
                                  size="invisible"
                                  ref={loginCaptchaRef}
                                />

                                <div className="button-box flex justify-center">
                                  <button
                                    type="submit"
                                    className="bg-indigo-600 text-black px-6 py-2 rounded-md hover:bg-indigo-700"
                                    disabled={loading}
                                  >
                                    <span>
                                      {loading ? "Logging in..." : "Login"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            {error && (
                              <p className="text-red-600 mb-3">{error}</p>
                            )}
                            {errors.register && (
                              <p className="text-red-600 mb-3">
                                {errors.register}
                              </p>
                            )}
                            <form onSubmit={handleRegisterSubmit}>
                              {errors.firstName && (
                                <p className="text-red-500 text-sm">
                                  {errors.firstName}
                                </p>
                              )}
                              <label htmlFor="first-name">First Name</label>
                              <input
                                id="first-name"
                                type="text"
                                name="first-name"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={`${
                                  errors.firstName ? "border-red-500" : ""
                                }`}
                              />

                              {errors.lastName && (
                                <p className="text-red-500 text-sm">
                                  {errors.lastName}
                                </p>
                              )}
                              <label htmlFor="last-name">Last Name</label>
                              <input
                                id="last-name"
                                type="text"
                                name="last-name"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={`${
                                  errors.lastName ? "border-red-500" : ""
                                }`}
                              />

                              {errors.password && (
                                <p className="text-red-500 text-sm">
                                  {errors.password}
                                </p>
                              )}
                              <label htmlFor="u-password">Password</label>
                              <input
                                id="u-password"
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${
                                  errors.password ? "border-red-500" : ""
                                }`}
                              />

                              {errors.email && (
                                <p className="text-red-500 text-sm">
                                  {errors.email}
                                </p>
                              )}
                              <label htmlFor="u-email">Email</label>
                              <input
                                id="u-email"
                                name="user-email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`${
                                  errors.email ? "border-red-500" : ""
                                }`}
                              />

                              {errors.phone && (
                                <p className="text-red-500 text-sm">
                                  {errors.phone}
                                </p>
                              )}
                              <label htmlFor="phone">Phone Number</label>
                              <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`${
                                  errors.phone ? "border-red-500" : ""
                                }`}
                              />

                              <ReCAPTCHA
                                sitekey={
                                  process.env.REACT_APP_RECAPTCHA_SITE_KEY
                                }
                                size="invisible"
                                ref={registerCaptchaRef}
                              />

                              <div className="button-box flex justify-center">
                                <button
                                  type="submit"
                                  className="bg-indigo-600 text-black px-6 py-2 rounded-md hover:bg-indigo-700"
                                  disabled={loading}
                                >
                                  <span>
                                    {loading ? "Registering..." : "Register"}
                                  </span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
