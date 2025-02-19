import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { getDiscountPrice } from "../../../helpers/product";
import {
  fetchCart,
  removeFromCart,
  updateCartItem,
} from "../../../store/slices/cart-slice";
import {
  clearCheckoutError,
  processCheckout,
} from "../../../store/slices/checkout-slice";

const MenuCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const currency = useSelector((state) => state.currency);
  const {
    items: cartItems,
    total,
    error: cartError,
  } = useSelector((state) => state.cart);
  const { loading: checkoutLoading, error: checkoutError } = useSelector(
    (state) => state.checkout
  );
  const { userInfo } = useSelector((state) => state.user);

  console.log("cartItems in cartmenu : ", cartItems);

  useEffect(() => {
    dispatch(clearCheckoutError()); // Clear Checkour errors on page mounting
    dispatch(fetchCart()); // Fetch the latest cart on load
  }, [dispatch]);

  // quantity handler
  const handleQuantityChange = (variantId, newQuantity) => {
    dispatch(updateCartItem({ variantId, quantity: newQuantity }));
  };

  // cart item remove handler
  const cartItemDeleteHandler = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  // Checkout button handler - Payment Integration - Stripe Payment Gateway
  const checkoutHandler = async (e) => {
    if (e?.preventDefault) e.preventDefault(); // Prevent errors

    // if (!userInfo) {
    //   navigate("/login-register");
    //   return;
    // }

    if (checkoutLoading || checkoutError) {
      if (checkoutError) {
        dispatch(processCheckout()); // Retry on error
      }
      return;
    }

    dispatch(processCheckout());
  };

  return (
    <div className="shopping-cart-content">
      {cartError && cartError ? (
        <div className="w-full bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-4">
          <p className="text-sm font-medium text-red-700">{cartError}</p>
        </div>
      ) : (
        <div>
          {cartItems && cartItems.length > 0 ? (
            <Fragment>
              <ul>
                {cartItems.map((cartItem) => (
                  <li key={cartItem._id} className="single-shopping-cart">
                    <div className="shopping-cart-img">
                      <img
                        alt={cartItem.variant?.images?.[0].alt}
                        src={cartItem.variant?.images?.[0].url}
                        className="img-fluid"
                      />
                    </div>
                    <div className="shopping-cart-title">
                      <h4>{cartItem.variant?.product?.name}</h4>
                      <h6 className="flex items-center gap-2">
                        Qty:
                        <input
                          type="number"
                          min="1"
                          value={cartItem.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              cartItem.variant?._id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-12 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </h6>
                      <span>
                        <span>{cartItem.subTotal.toFixed(2)} MVR</span>
                      </span>
                    </div>
                    <div className="shopping-cart-delete">
                      <button
                        onClick={() =>
                          cartItemDeleteHandler(cartItem.variant?._id)
                        }
                      >
                        <i className="fa fa-times-circle" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="shopping-cart-total">
                <h4>
                  Total :{" "}
                  <span className="shop-total">{total.toFixed(2)} MVR</span>
                </h4>
              </div>
              <div className="shopping-cart-btn btn-hover text-center">
                <Link
                  className="default-btn"
                  to={process.env.PUBLIC_URL + "/cart"}
                >
                  view cart
                </Link>
                <Link
                  to={"#"}
                  onClick={checkoutHandler}
                  className="default-btn"
                  // to={process.env.PUBLIC_URL + "/checkout"}
                >
                  {checkoutLoading
                    ? "Processing..."
                    : checkoutError
                    ? "Checkout Failed! [Try Again]"
                    : "Checkout"}
                </Link>
              </div>
            </Fragment>
          ) : (
            <p className="text-center">No items in the cart.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCart;
