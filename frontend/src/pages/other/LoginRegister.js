import React, { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import axios from "../../axiosConfig";
import LayoutOne from "../../layouts/LayoutOne";
import ReCAPTCHA from "react-google-recaptcha";

const LoginRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const loginCaptchaRef = useRef(null); // used for to refer DOM element that using reRef const. in this case it is login form ReCaptcha element
  const registerCaptchaRef = useRef(null); // used for to refer DOM element that using reRef const. in this case it is register form ReCaptcha element

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      // Concatenating name
      const fullName = `${firstName} ${lastName}`;

      // ReCaptcha Token
      const token = await loginCaptchaRef.current.executeAsync();
      loginCaptchaRef.current.reset(); // allow to re-excute the reCapture check

      const response = await axios.post(
        "http://localhost:3000/v1/auth/signup",
        {
          email,
          password,
          name: fullName, //using concatenated value for name
          phone,
          token,
        }
      );
      alert(response.data.message);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred during signup.";
      alert(errorMessage);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // ReCaptcha Token
      const token = await registerCaptchaRef.current.executeAsync();
      registerCaptchaRef.current.reset(); // allow to re-excute the reCapture check

      const response = await axios.post(
        "http://localhost:3000/v1/auth/signin",
        {
          email,
          password,
        }
      );
      alert("User signed in as " + response.data.user.name);
      console.log("User signed in:", response.data.user);
    } catch (err) {
      alert(err.response.data.message);
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
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleLoginSubmit}>
                              <input
                                type="email"
                                name="user-email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div>

                                <ReCAPTCHA
                                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                  size="invisible"
                                  ref={loginCaptchaRef}
                                />

                                <div className="button-box flex justify-center">
                                  <button
                                    type="submit"
                                    className="bg-indigo-600 text-black px-6 py-2 rounded-md hover:bg-indigo-700"
                                  >
                                    <span>Login</span>
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
                            <form onSubmit={handleRegisterSubmit}>
                              <input
                                type="text"
                                name="first-name"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                              <input
                                type="text"
                                name="last-name"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <input
                                name="user-email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />

                              <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              />

                              <ReCAPTCHA
                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                size="invisible"
                                ref={registerCaptchaRef}
                              />

                              <div className="button-box flex justify-center">
                                <button
                                  type="submit"
                                  className="bg-indigo-600 text-black px-6 py-2 rounded-md hover:bg-indigo-700"
                                >
                                  <span>Register</span>
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
