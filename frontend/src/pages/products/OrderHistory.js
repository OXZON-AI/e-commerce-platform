import React, { Fragment } from "react";
import LayoutOne from "../../layouts/LayoutOne";

const orders = [
  {
    id: 1,
    products: [
      {
        name: "Samsung 4K Smart TV",
      },
    ],
    quantity: 1,
    date: "15/02/2024",
    price: "£599.99",
  },
  {
    id: 2,
    products: [
      {
        name: "Apple MacBook Pro 14-inch",
      },
      {
        name: "Logitech Wireless Mouse",
      },
    ],
    quantity: 2,
    date: "10/02/2024",
    price: "£1,499.00",
  },
  {
    id: 3,
    products: [
      {
        name: "Sony WH-1000XM4 Headphones",
      },
    ],
    quantity: 1,
    date: "05/02/2024",
    price: "£279.99",
  },
  {
    id: 4,
    products: [
      {
        name: "Samsung Galaxy S24 Ultra",
      },
      {
        name: "Anker 20W Fast Charger",
      },
      {
        name: "Wireless Earbuds",
      },
    ],
    quantity: 3,
    date: "01/02/2024",
    price: "£1,099.00",
  },

  {
    id: 5,
    products: [
      {
        name: "Dell XPS 15 Laptop",
      },
      {
        name: "Logitech MX Keys Keyboard",
      },
    ],
    quantity: 2,
    date: "20/01/2024",
    price: "£1,799.00",
  },
  {
    id: 6,
    products: [
      {
        name: "Apple iPad Pro 11-inch",
      },
    ],
    quantity: 1,
    date: "10/01/2024",
    price: "£899.99",
  },
];

const OrderHistory = () => {
  return (
    <Fragment>
      <LayoutOne>
        <div className="min-h-full bg-purple-100 flex items-center justify-center p-6">
          <div className="w-full lg:w-3/4 xl:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Order History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-200 transition"
                    >
                      <td className="p-3">
                        {order.products.map((product, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2 last:mb-0"
                          >
                            <span>{product.name}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3">{order.quantity}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3 font-semibold">{order.price}</td>
                      <td className="p-3">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                          Reorder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default OrderHistory;
