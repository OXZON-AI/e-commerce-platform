import React, { Fragment } from "react";

import LayoutOne from "../../layouts/LayoutOne";

const ResetPassword = () => {
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
                      <form>
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="New Password"
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
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
