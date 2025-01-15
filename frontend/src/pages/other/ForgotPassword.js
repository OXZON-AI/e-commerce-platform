import React, { Fragment } from "react";

import LayoutOne from "../../layouts/LayoutOne";

const ForgotPassword = () => {
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
                      <form>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className="w-full p-3 border border-gray-300 rounded-lg"
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
