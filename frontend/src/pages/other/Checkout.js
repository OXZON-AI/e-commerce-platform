import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";

import LayoutOne from "../../layouts/LayoutOne";

const Checkout = () => {
  let cartTotalPrice = 0;

  let { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);
  const { items: cartItems } = useSelector((state) => state.cart);

  return (
    <Fragment>
      <LayoutOne>
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap p-6 bg-white shadow-sm rounded-none">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                      Billing Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* First Name Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* Last Name Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* Email Address Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* Phone Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 234 567 890"
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* Shipping Address Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Shipping Address
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* City Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* State Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* Zip Code Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* Country Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>

                      {/* Additional Information Field */}
                      <div className="billing-info">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Additional Information
                        </label>
                        <input
                          type="text"
                          placeholder="Special delivery instructions or order notes"
                          className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area p-5 bg-white shadow-sm rounded-none">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-5">
                      Your Order
                    </h3>
                    <div className="your-order-wrap bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <div className="your-order-product-info">
                        <div className="your-order-top flex justify-between mb-4">
                          <span className="font-medium text-gray-600">
                            Product
                          </span>
                          <span className="font-medium text-gray-600">
                            Total
                          </span>
                        </div>

                        <div className="your-order-middle mb-4">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountedPrice = getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              );
                              const finalProductPrice = (
                                cartItem.price * currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice = (
                                discountedPrice * currency.currencyRate
                              ).toFixed(2);

                              discountedPrice !== null
                                ? (cartTotalPrice +=
                                    finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice +=
                                    finalProductPrice * cartItem.quantity);

                              return (
                                <li
                                  key={key}
                                  className="flex justify-between items-center py-2 border-b border-gray-200"
                                >
                                  <span className="text-gray-700">
                                    {cartItem.name} x {cartItem.quantity}
                                  </span>
                                  <span className="text-gray-700">
                                    {discountedPrice !== null
                                      ? currency.currencySymbol +
                                        (
                                          finalDiscountedPrice *
                                          cartItem.quantity
                                        ).toFixed(2)
                                      : currency.currencySymbol +
                                        (
                                          finalProductPrice * cartItem.quantity
                                        ).toFixed(2)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="your-order-bottom mb-4 flex justify-between items-center">
                          <span className="text-gray-600">Shipping</span>
                          <span className="text-gray-700">Free shipping</span>
                        </div>

                        <div className="your-order-total flex justify-between items-center mt-4">
                          <span className="font-semibold text-gray-800">
                            Total
                          </span>
                          <span className="font-semibold text-gray-800">
                            {currency.currencySymbol +
                              cartTotalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="place-order mt-6">
                      <button
                        type="submit"
                        className="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />
                      <Link to={process.env.PUBLIC_URL + "/"}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;
