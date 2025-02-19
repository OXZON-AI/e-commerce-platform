import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearUser, signoutUser } from "../../store/slices/user-slice";

const IconGroup = ({ iconWhiteClass }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, loading, success, error } = useSelector(
    (state) => state.user
  );

  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };

  const { items: cartItems } = useSelector((state) => state.cart);

  const logoutHandler = async (e) => {
    e.preventDefault();

    try {
      await dispatch(signoutUser()).unwrap();
      dispatch(clearUser()); // Clear user data from Redux state
      toast.success("Signed out successfully!"); // Success toast message

      navigate("/login-register"); // Redirect to login page
    } catch (error) {
      console.error(
        "Error logging out:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to sign out. Please try again."); // Error toast message
    }
  };

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)}>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={(e) => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>

        <div className="account-dropdown">
          {!userInfo ? (
            <ul>
              <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  Login
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  Register
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  my account
                </Link>
              </li>
              <Link to="#" onClick={logoutHandler}>
                Log out
              </Link>
            </ul>
          )}
        </div>
      </div>

      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};

export default IconGroup;
