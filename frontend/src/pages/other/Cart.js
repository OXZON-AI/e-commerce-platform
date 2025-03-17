import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";
import LayoutOne from "../../layouts/LayoutOne";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import {
  clearCart,
  clearCartError,
  fetchCart,
  removeAllFromCart,
  removeFromCart,
  updateCartItem,
} from "../../store/slices/cart-slice";
import {
  clearCheckoutError,
  processCheckout,
} from "../../store/slices/checkout-slice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: cartItems,
    total,
    status: cartStatus,
    error: cartError,
  } = useSelector((state) => state.cart);
  const { loading: checkoutLoading, error: checkoutError } = useSelector(
    (state) => state.checkout
  );
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearCartError()); // Clear cart error
    dispatch(clearCheckoutError()); // Clear checkout error
    dispatch(fetchCart()); // Fetch cart when component mounts
  }, [dispatch]);

  const handleQuantityChange = (variantId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ variantId, quantity }));
    toast.success("Your shopping cart has been updated.", {
      autoClose: 3000,
    });
  };

  const handleRemoveItem = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  const clearCartHandler = () => {
    // If cart is not empty trigger the API request for clear all items on cart
    if (cartItems.length !== 0) {
      dispatch(removeAllFromCart());
    } else {
      toast.info(
        "Looks like your cart is on a diet—time to feed it some items! 🍕🛒",
        {
          autoClose: 5000,
        }
      );
    }
  };

  // Checkout button handler - Payment Integration - Stripe Payment Gateway
  const checkoutHandler = async (e) => {
    if (e?.preventDefault) e.preventDefault(); // Prevent errors

    if (checkoutLoading || checkoutError) {
      if (checkoutError) {
        dispatch(processCheckout()); // Retry on error
      }
      return;
    }

    dispatch(processCheckout());
  };

  return (
    <Fragment>
      <LayoutOne>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">Your Cart Items</h2>
          {cartError && (
            <div className="w-full bg-red-100 border border-red-500 text-red-700 p-4 rounded-md mb-4">
              <p className="text-sm font-medium text-red-700">{cartError}</p>
            </div>
          )}
          {cartItems.length >= 1 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full border-collapse w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Product Name</th>
                    <th className="p-4 text-left">Unit Price</th>
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Subtotal</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((cartItem, key) => {
                    return (
                      <tr key={key} className="border-b">
                        <td className="p-4">
                          <img
                            className="w-16 h-16 rounded-none object-cover"
                            src={cartItem.variant?.images?.[0].url}
                            alt={cartItem.variant?.images?.[0].alt}
                          />
                        </td>
                        <td className="p-4">
                          <Link
                            to={`/product/${cartItem.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            {cartItem.variant?.product?.name}
                          </Link>
                        </td>
                        <td className="p-4 text-gray-700">
                          Rf {cartItem.variant?.price.toFixed(2)} 
                        </td>
                        <td className="p-4 text-gray-700">
                          {cartItem.quantity}{" "}
                          {/* Displaying only the selected quantity */}
                        </td>
                        <td className="p-4 text-gray-700">
                          Rf {cartItem.subTotal.toFixed(2)} 
                        </td>
                        <td className="p-4 text-gray-700">
                          <div className="flex items-center justify-evenly">
                            {/* Quantity Selector on the left side */}
                            {cartStatus === "loading-update-cart" ? (
                              <PuffLoader size={30} color="#9333ea" />
                            ) : null}
                            <div className="flex items-center">
                              <button
                                className="px-3 py-1 border rounded-md"
                                onClick={() =>
                                  handleQuantityChange(
                                    cartItem.variant?._id,
                                    cartItem.quantity - 1
                                  )
                                }
                                disabled={
                                  cartItem.quantity === 1 ||
                                  cartStatus === "loading-update-cart"
                                }
                              >
                                -
                              </button>
                              <span className="text-lg font-medium mx-2">
                                {cartItem.quantity}
                              </span>
                              <button
                                className="px-3 py-1 border rounded-md"
                                onClick={() =>
                                  handleQuantityChange(
                                    cartItem.variant?._id,
                                    cartItem.quantity + 1
                                  )
                                }
                                disabled={
                                  cartItem.quantity >=
                                    cartItem.variant?.stock ||
                                  cartStatus === "loading-update-cart"
                                }
                              >
                                +
                              </button>
                            </div>

                            {/* X mark icon on the right side */}
                            <button
                              onClick={() =>
                                handleRemoveItem(cartItem.variant?._id)
                              }
                              className="bg-gray-400 text-white p-2 rounded-md hover:bg-black"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">No items found in cart</p>
              <Link
                to="/"
                className="mt-4 inline-block bg-gray-300 font-semibold text-black px-6 py-2 rounded-md hover:bg-purple-500"
              >
                Shop Now
              </Link>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-purple-500"
            >
              Continue Shopping
            </button>
            <button
              onClick={clearCartHandler}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-red-500"
            >
              Clear Shopping Cart
            </button>
            <span className="text-lg font-semibold px-6 py-2 bg-gray-300 rounded-md">
              Total: Rf {total.toFixed(2)} 
            </span>
          </div>

          <div className="mt-8 p-1">
            {/* Cart Total */}
            <div className="ml-auto p-6 bg-gray-100 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/2">
              <h4 className="font-semibold text-lg text-gray-800 border-b pb-3">
                Cart Total
              </h4>

              <h5 className="text-base text-gray-700 mt-3 flex justify-between">
                Total Products:
                <span className="font-semibold text-gray-900">
                  Rf {total.toFixed(2)} 
                </span>
              </h5>

              <h4 className="text-xl font-bold text-gray-900 mt-4 border-t pt-4 flex justify-between">
                Grand Total:
                <span className="text-purple-600">Rf {total.toFixed(2)} </span>
              </h4>

              <Link
                to={"#"}
                onClick={checkoutHandler}
                className={`mt-5 block text-center ${
                  checkoutLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white font-medium px-6 py-2 rounded-md transition`}
              >
                {checkoutLoading
                  ? "Processing..."
                  : checkoutError
                  ? "Try Again"
                  : "Proceed to Checkout"}
              </Link>

              {checkoutError && (
                <div className="mt-4 w-full bg-red-100 border-1 border-red-500 text-red-700 p-4 rounded-md mb-4">
                  <p className="text-sm font-medium text-red-700">
                    {checkoutError}
                  </p>
                </div>
              )}
              {/* <Link
                to={process.env.PUBLIC_URL + "/checkout"}
                className="mt-5 block text-center bg-purple-500 text-white font-medium px-6 py-2 rounded-md hover:bg-purple-600 transition"
              >
                Proceed to Checkout
              </Link> */}
              </div>
            </div>
          </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
