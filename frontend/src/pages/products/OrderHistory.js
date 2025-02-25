import React, { Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutOne from "../../layouts/LayoutOne";

const orders = [
  {
    id: 1,
    products: [
      { name: "Samsung 4K Smart TV", price: "£599.99", points: 50 },
    ],
    quantity: 1,
    date: "15/02/2024",
    status: "shipped",
  },
  {
    id: 2,
    products: [
      { name: "Apple MacBook Pro 14-inch", price: "£1,499.00", points: 120 },
      { name: "Logitech Wireless Mouse", price: "£29.99", points: 10 },
    ],
    quantity: 2,
    date: "10/02/2024",
    status: "processing",
  },
  {
    id: 3,
    products: [
      { name: "Sony WH-1000XM4 Headphones", price: "£279.99", points: 30 },
    ],
    quantity: 1,
    date: "05/02/2024",
    status: "delivered",
  },
  {
    id: 4,
    products: [
      { name: "Samsung Galaxy S24 Ultra", price: "£1,099.00", points: 90 },
      { name: "Anker 20W Fast Charger", price: "£19.99", points: 5 },
      { name: "Wireless Earbuds", price: "£49.99", points: 15 },
    ],
    quantity: 3,
    date: "01/02/2024",
    status: "cancelled",
  },
];

const handleReorder = (productName) => {
  toast.success(`${productName} has been reordered successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { top: '80px' }
  });
};

const OrderHistory = () => {
  return (
    <Fragment>
      <LayoutOne>
        <div className="min-h-full bg-purple-100 flex items-center justify-center p-6">
          <div className="w-full lg:w-3/4 xl:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Order History</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Order Status</th>
                    <th className="p-3 text-left">Loyalty Points</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) =>
                    order.products.map((product, index) => (
                      <tr key={`${order.id}-${index}`} className="border-b hover:bg-gray-200 transition">
                        <td className="p-3">{product.name}</td>
                        <td className="p-3">1</td>
                        <td className="p-3">{order.date}</td>
                        <td className="p-3 font-semibold">{product.price}</td>
                        <td className="p-3">{order.status}</td>
                        <td className="p-3">{product.points}</td>
                        <td className="p-3">
                          <button 
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                            onClick={() => handleReorder(product.name)}
                          >
                            Reorder
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutOne>
      <ToastContainer />
    </Fragment>
  );
};

export default OrderHistory;
