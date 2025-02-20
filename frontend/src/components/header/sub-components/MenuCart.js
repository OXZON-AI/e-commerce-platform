import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { getDiscountPrice } from "../../../helpers/product";
import {
  fetchCart,
  removeFromCart,
} from "../../../store/slices/cart-slice";
import {
  clearCheckoutError,
} from "../../../store/slices/checkout-slice";

const MenuCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: cartItems,
    total,
    status: cartStatus,
    error: cartError,
  } = useSelector((state) => state.cart);
  // const { loading: checkoutLoading, error: checkoutError } = useSelector(
  //   (state) => state.checkout
  // );

  useEffect(() => {
    dispatch(clearCheckoutError()); // Clear Checkour errors on page mounting
    dispatch(fetchCart()); // Fetch the latest cart on load
  }, [dispatch]);

  // quantity handler
  // const handleQuantityChange = (variantId, newQuantity) => {
  //   dispatch(updateCartItem({ variantId, quantity: newQuantity }));
  // };

  // cart item remove handler
  const cartItemDeleteHandler = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  // Checkout button handler - Payment Integration - Stripe Payment Gateway
  // const checkoutHandler = async (e) => {
  //   if (e?.preventDefault) e.preventDefault(); // Prevent errors

  //   if (checkoutLoading || checkoutError) {
  //     if (checkoutError) {
  //       dispatch(processCheckout()); // Retry on error
  //     }
  //     return;
  //   }

  //   dispatch(processCheckout());
  // };

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
                      {/* <h6 className="flex items-center gap-2">
                        Qty:
                        <div className="flex items-center">
                          <button
                            className="px-2 py-1 border rounded-md"
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.variant?._id,
                                cartItem.quantity - 1
                              )
                            }
                            disabled={cartItem.quantity === 1}
                          >
                            -
                          </button>
                          <span className="text-lg font-medium mx-2">
                            {cartItem.quantity}
                          </span>
                          <button
                            className="px-2 py-1 border rounded-md"
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.variant?._id,
                                cartItem.quantity + 1
                              )
                            }
                            disabled={
                              cartItem.quantity >= cartItem.variant?.stock
                            }
                          >
                            +
                          </button>
                        </div>
                      </h6> */}
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
                {/* <Link
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
                </Link> */}
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
