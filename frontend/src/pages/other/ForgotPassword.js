import React, { Fragment, useState } from "react";

import LayoutOne from "../../layouts/LayoutOne";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Regular expression for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setMessage("");

    // check email empty
    if (!email) {
      setError("Email can't be empty!");
      return;
    }

    // check email is valid pattern
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/v1/auth/request-reset",
        { email }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong in requesting reset token!"
      );
      setMessage("");
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
                  <div className="login-form-container">
                    <h3 className="text-center mb-4">Forgot Password</h3>
                    <div className="login-register-form">
                      {message && (
                        <p className="text-green-600 mb-3">{message}</p>
                      )}
                      {error && <p className="text-red-600 mb-3">{error}</p>}
                      {emailError && <p className="text-red-600 mb-3">{emailError}</p>}
                      <form onSubmit={handleEmailSubmit}>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="button-box flex justify-center">
                          <button
                            type="submit"
                            className="bg-indigo-600 text-black px-5 py-2 rounded-md hover:bg-indigo-700"
                          >
                            <span>Submit</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ForgotPassword;
