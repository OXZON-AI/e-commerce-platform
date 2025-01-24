import React, { Fragment, useState } from "react";

import LayoutOne from "../../layouts/LayoutOne";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Extract token from URL
  const token = new URLSearchParams(window.location.search).get("token");

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Both fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axiosInstance.post("/v1/auth/reset-password", {
        password,
        token,
      });

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/login-register");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something Went Wrong with reset password!"
      );
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
                    <h3 className="text-center mb-4">Reset Password</h3>
                    <div className="login-register-form">
                      {success && (
                        <p className="text-green-600 mb-3">{success}</p>
                      )}
                      {error && <p className="text-red-600 mb-3">{error}</p>}
                      <form onSubmit={handleResetSubmit}>
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="New Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <div className="button-box flex justify-center">
                          <button type="submit">
                            <span>Reset Password</span>
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

export default ResetPassword;
