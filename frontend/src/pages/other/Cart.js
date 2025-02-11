import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";
import LayoutOne from "../../layouts/LayoutOne";

const Cart = () => {
  let cartTotalPrice = 0;
  let { pathname } = useLocation();

  const initialCartItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 120,
      discount: 15,
      quantity: 2,
      image: ["https://dummyimage.com/600x800/808080/fff.png"],
      selectedProductColor: "Black",
      selectedProductSize: "One Size",
    },
    {
      id: 2,
      name: "Smartphone Charger",
      price: 30,
      discount: 5,
      quantity: 1,
      image: ["https://dummyimage.com/600x800/808080/fff.png"],
      selectedProductColor: "White",
      selectedProductSize: "One Size",
    },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQuantityChange = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((cartItem, key) => {
                    const discountedPrice =
                      cartItem.price -
                      (cartItem.price * cartItem.discount) / 100;
                    cartTotalPrice += discountedPrice * cartItem.quantity;

                    return (
                      <tr key={key} className="border-b">
                        <td className="p-4">
                          <img
                            className="w-16 h-16 rounded-none object-cover"
                            src={cartItem.image[0]}
                            alt={cartItem.name}
                          />
                        </td>
                        <td className="p-4">
                          <Link
                            to={`/product/${cartItem.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            {cartItem.name}
                          </Link>
                          <div className="text-sm text-gray-500">
                            Color: {cartItem.selectedProductColor} | Size:{" "}
                            {cartItem.selectedProductSize}
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">
                          ${discountedPrice.toFixed(2)}
                        </td>
                        <td className="p-4 text-gray-700">
                          <input
                            type="number"
                            value={cartItem.quantity}
                            min="1"
                            onChange={(e) =>
                              handleQuantityChange(
                                cartItem.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-16 px-2 py-1 border rounded-md"
                          />
                        </td>
                        <td className="p-4 text-gray-700">
                          ${(discountedPrice * cartItem.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-gray-700">
                          <button
                            onClick={() => handleRemoveItem(cartItem.id)}
                            className="bg-gray-400 text-white p-2 rounded-md hover:bg-black"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
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
              onClick={clearCart}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-purple-500"
            >
              Continue Shopping
            </button>
            <button
              onClick={clearCart}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-red-500"
            >
              Clear Shopping Cart
            </button>
            <span className="text-lg font-semibold">
              Total: ${cartTotalPrice.toFixed(2)}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Estimate Shipping And Tax */}
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h4 className="font-semibold text-lg text-gray-800">
                Estimate Shipping And Tax
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Enter your destination to get a shipping estimate.
              </p>

              <select className="w-full p-2 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>United States</option>
                <option>Canada</option>
              </select>

              <input
                type="text"
                placeholder="Zip/Postal Code"
                className="w-full p-2 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="w-full mt-4 bg-purple-500 text-white font-medium p-2 rounded-md hover:bg-purple-600 transition">
                Get A Quote
              </button>
            </div>

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
                  ${cartTotalPrice.toFixed(2)}
                </span>
              </h5>

              <h4 className="text-xl font-bold text-gray-900 mt-4 border-t pt-4 flex justify-between">
                Grand Total:
                <span className="text-purple-600">
                  ${cartTotalPrice.toFixed(2)}
                </span>
              </h4>

              <Link
                to={process.env.PUBLIC_URL + "/checkout"}
                className="mt-5 block text-center bg-purple-500 text-white font-medium px-6 py-2 rounded-md hover:bg-purple-600 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
