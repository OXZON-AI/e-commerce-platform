import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/react-stripe-js";
import { XMarkIcon } from "@heroicons/react/20/solid";
import LayoutOne from "../../layouts/LayoutOne";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  fetchCart,
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
    status,
    error,
  } = useSelector((state) => state.cart);
  const { loading: checkoutLoading, error: checkoutError } = useSelector(
    (state) => state.checkout
  );
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearCheckoutError()); // Clear checkout error
    dispatch(fetchCart()); // Fetch cart when component mounts
  }, [dispatch]);

  const handleQuantityChange = (variantId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ variantId, quantity }));
  };

  const handleRemoveItem = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  const clearCartHandler = () => {
    dispatch(clearCart()); // Dispatch Redux action to clear cart
  };

  // Checkout button handler - Payment Integration - Stripe Payment Gateway
  const checkoutHandler = async (e) => {
    if (e?.preventDefault) e.preventDefault(); // Prevent errors

    if (!userInfo) {
      navigate("/login-register");
      return;
    }

    if (checkoutLoading || checkoutError) {
      if (checkoutError) {
        dispatch(processCheckout()); // Retry on error
      }
      return;
    }

    dispatch(processCheckout());
  };

  // const handleQuantityChange = (id, quantity) => {
  //   setCartItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
  //     )
  //   );
  // };

  // const handleRemoveItem = (id) => {
  //   setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  // };

  // const clearCart = () => {
  //   setCartItems([]);
  // };

  return (
    <Fragment>
      <LayoutOne>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">Your Cart Items</h2>
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
                          {cartItem.variant?.price.toFixed(2)} MVR
                        </td>
                        <td className="p-4 text-gray-700">
                          {cartItem.quantity}{" "}
                          {/* Displaying only the selected quantity */}
                        </td>
                        <td className="p-4 text-gray-700">
                          {cartItem.subTotal.toFixed(2)} MVR
                        </td>
                        <td className="p-4 text-gray-700">
                          <div className="flex items-center justify-evenly">
                            {/* Quantity input on the left side */}
                            <input
                              type="number"
                              value={cartItem.quantity}
                              min="1"
                              onChange={(e) =>
                                handleQuantityChange(
                                  cartItem.variant?._id,
                                  parseInt(e.target.value, 10)
                                )
                              }
                              className="w-16 px-2 py-1 border rounded-md"
                            />
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
              Total: {total.toFixed(2)} MVR
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-40 p-4">
            {/* Use Coupon Code */}
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="font-semibold text-lg text-gray-800">
                Use Coupon Code
              </h4>

              <input
                type="text"
                placeholder="Enter Coupon"
                className="w-full p-2 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button className="w-full mt-4 bg-purple-500 text-white font-medium p-2 rounded-md hover:bg-purple-600 transition">
                Apply Coupon
              </button>
            </div>

            {/* Cart Total */}
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="font-semibold text-lg text-gray-800 border-b pb-3">
                Cart Total
              </h4>

              <h5 className="text-md text-gray-700 mt-3 flex justify-between">
                Total Products:
                <span className="font-semibold text-gray-900">
                  {total.toFixed(2)} MVR
                </span>
              </h5>

              <h4 className="text-xl font-bold text-gray-900 mt-4 border-t pt-4 flex justify-between">
                Grand Total:
                <span className="text-purple-600">{total.toFixed(2)} MVR</span>
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
