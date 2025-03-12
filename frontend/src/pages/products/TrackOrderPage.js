// import React, { Fragment, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaTruck,
//   FaCheckCircle,
//   FaClock,
//   FaTimes,
//   FaPhoneAlt,
// } from "react-icons/fa";

// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import LayoutOne from "../../layouts/LayoutOne";

// const TrackOrderPage = () => {
//   const sampleOrders = [
//     // Sample order data (same as provided)
//     {
//       id: "ORD123",
//       status: "Processing",
//       timestamp: "2025-02-20 10:00 AM",
//       orderNo: "25-02-11-1076785-36",
//       orderDate: "11/02/2025",
//       deliveryDate: "14/02/2025",
//       deliveryTime: "8:00 AM - 5:00 PM",
//       customerName: "Ravindu Jayasinghe",
//       customerAddress: "45/1, Main Street, Negombo.",
//       customerPhone: "0762 111 223",
//       products: [
//         {
//           name: "Samsung 24-inch Monitor",
//           price: 45000,
//           quantity: 1,
//           total: 45000,
//         },
//         {
//           name: "Logitech Wireless Keyboard & Mouse",
//           price: 8500,
//           quantity: 1,
//           total: 8500,
//         },
//       ],
//       subTotal: 53500,
//       discount: 500,
//       additionalCharges: 0,
//       deliveryCharge: 1500,
//       totalAmount: 54500,
//     },
//     {
//       id: "ORD124",
//       status: "Dispatched",
//       timestamp: "2025-02-18 12:30 PM",
//       orderNo: "26-02-14-1076786-37",
//       orderDate: "14/02/2025",
//       deliveryDate: "17/02/2025",
//       deliveryTime: "10:00 AM - 4:00 PM",
//       customerName: "Tharindu Perera",
//       customerAddress: "23/B, Galle Road, Colombo.",
//       customerPhone: "0778 334 556",
//       products: [
//         {
//           name: "Apple AirPods Pro (2nd Gen)",
//           price: 78900,
//           quantity: 1,
//           total: 78900,
//         },
//         {
//           name: "Anker Power Bank 20,000mAh",
//           price: 12000,
//           quantity: 1,
//           total: 12000,
//         },
//       ],
//       subTotal: 90900,
//       discount: 1000,
//       additionalCharges: 500,
//       deliveryCharge: 2000,
//       totalAmount: 92400,
//     },
//     {
//       id: "ORD125",
//       status: "Delivered",
//       timestamp: "2025-02-19 05:45 PM",
//       orderNo: "27-02-15-1076787-38",
//       orderDate: "15/02/2025",
//       deliveryDate: "18/02/2025",
//       deliveryTime: "9:00 AM - 2:00 PM",
//       customerName: "Kavindu Silva",
//       customerAddress: "56/A, New Town, Kurunegala.",
//       customerPhone: "0783 456 999",
//       products: [
//         {
//           name: "Sony WH-1000XM5 Headphones",
//           price: 129900,
//           quantity: 1,
//           total: 129900,
//         },
//         {
//           name: "SanDisk 1TB Portable SSD",
//           price: 35000,
//           quantity: 1,
//           total: 35000,
//         },
//       ],
//       subTotal: 164900,
//       discount: 2000,
//       additionalCharges: 1000,
//       deliveryCharge: 2500,
//       totalAmount: 166400,
//     },
//     {
//       id: "ORD126",
//       status: "Processing",
//       timestamp: "2025-02-20 03:00 PM",
//       orderNo: "28-02-16-1076788-39",
//       orderDate: "16/02/2025",
//       deliveryDate: "19/02/2025",
//       deliveryTime: "11:00 AM - 3:00 PM",
//       customerName: "Nuwan Wijesinghe",
//       customerAddress: "67/2, Greenfield Road, Kandy.",
//       customerPhone: "0795 789 777",
//       products: [
//         {
//           name: "Dell XPS 13 Laptop",
//           price: 275000,
//           quantity: 1,
//           total: 275000,
//         },
//         {
//           name: "Logitech MX Master 3S Mouse",
//           price: 23000,
//           quantity: 1,
//           total: 23000,
//         },
//       ],
//       subTotal: 298000,
//       discount: 5000,
//       additionalCharges: 0,
//       deliveryCharge: 3000,
//       totalAmount: 296000,
//     },
//     {
//       id: "ORD127",
//       status: "Shipped",
//       timestamp: "2025-02-22 10:30 AM",
//       orderNo: "28-02-18-1076790-42",
//       orderDate: "18/02/2025",
//       deliveryDate: "21/02/2025",
//       deliveryTime: "9:00 AM - 12:00 PM",
//       customerName: "Ravindu Perera",
//       customerAddress: "12/5, Lakeview Street, Colombo 07.",
//       customerPhone: "0774 123 456",
//       products: [
//         {
//           name: "iPhone 15 Pro",
//           price: 410000,
//           quantity: 1,
//           total: 410000,
//         },
//         {
//           name: "Apple AirPods Pro 2",
//           price: 78000,
//           quantity: 1,
//           total: 78000,
//         },
//       ],
//       subTotal: 488000,
//       discount: 8000,
//       additionalCharges: 0,
//       deliveryCharge: 5000,
//       totalAmount: 485000,
//     },
//     {
//       id: "ORD128",
//       status: "Delivered",
//       timestamp: "2025-02-25 02:45 PM",
//       orderNo: "28-02-20-1076793-51",
//       orderDate: "20/02/2025",
//       deliveryDate: "24/02/2025",
//       deliveryTime: "1:00 PM - 5:00 PM",
//       customerName: "Dilini Fernando",
//       customerAddress: "45/B, Rosewood Avenue, Galle.",
//       customerPhone: "0712 567 890",
//       products: [
//         {
//           name: "Samsung Galaxy S24 Ultra",
//           price: 395000,
//           quantity: 1,
//           total: 395000,
//         },
//       ],
//       subTotal: 395000,
//       discount: 10000,
//       additionalCharges: 2000,
//       deliveryCharge: 3500,
//       totalAmount: 390500,
//     },
//     {
//       id: "ORD129",
//       status: "Pending",
//       timestamp: "2025-02-28 05:15 PM",
//       orderNo: "28-02-25-1076799-61",
//       orderDate: "25/02/2025",
//       deliveryDate: "28/02/2025",
//       deliveryTime: "10:00 AM - 2:00 PM",
//       customerName: "Shehan Madushanka",
//       customerAddress: "22/1, Ocean Drive, Negombo.",
//       customerPhone: "0765 345 678",
//       products: [
//         {
//           name: "Sony PlayStation 5",
//           price: 265000,
//           quantity: 1,
//           total: 265000,
//         },
//         {
//           name: "DualSense Wireless Controller",
//           price: 32000,
//           quantity: 1,
//           total: 32000,
//         },
//         {
//           name: "Spider-Man 2 PS5 Game",
//           price: 18000,
//           quantity: 1,
//           total: 18000,
//         },
//       ],
//       subTotal: 315000,
//       discount: 5000,
//       additionalCharges: 0,
//       deliveryCharge: 4000,
//       totalAmount: 314000,
//     },
//   ];

//   const [orderStatus, setOrderStatus] = useState("Processing");
//   const [orderId, setOrderId] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [currentTab, setCurrentTab] = useState("processing");
//   const [isTabClickable, setIsTabClickable] = useState(true);

//   const fetchOrderStatus = (orderId) => {
//     const order = sampleOrders.find((order) => order.id === orderId);
//     if (order) {
//       setOrderStatus(order.status);
//       setErrorMessage("");
//       setCurrentTab(order.status.toLowerCase());
//       setIsTabClickable(false);
//       toast.success(`Order ${orderId} found!`, { autoClose: 2000 });
//     } else {
//       toast.error("Order ID not found!", { autoClose: 3000 });
//       setErrorMessage("Order ID not found");
//       setOrderStatus("");
//       setIsTabClickable(true);
//     }
//   };

//   const handleTrackOrder = (e) => {
//     // e.preventDefault();
//     // fetchOrderStatus(orderId);
//     e.preventDefault();
//     if (!orderId) {
//       toast.warn("Please enter an Order ID!", { autoClose: 2000 });
//       return;
//     }
//     fetchOrderStatus(orderId);
//   };

//   return (
//     <Fragment>
//       <LayoutOne>
//         <ToastContainer position="top-right" />

//         {/* <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
//       <div className="w-full max-w-7xl bg-white shadow-lg overflow-hidden"> */}

//         <div className="w-full min-h-screen bg-purple-50 overflow-hidden  justify-center p-6">
//           <div className="w-full min-h-screen bg-white shadow-lg overflow-hidden  justify-center p-6">
//             <div className="p-8">
//               <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">
//                 Track Your Order
//               </h2>

//               {/* Order ID Input */}
//               <form onSubmit={handleTrackOrder} className="mb-8 text-center">
//                 <div className="flex items-center gap-4 justify-center">
//                   <input
//                     type="text"
//                     id="orderId"
//                     className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 h-12"
//                     placeholder="Enter Order ID"
//                     value={orderId}
//                     onChange={(e) => setOrderId(e.target.value)}
//                   />
//                   <button
//                     type="submit"
//                     className="bg-purple-600 text-white px-5 rounded-lg hover:bg-purple-700 transition duration-300 h-12 flex items-center justify-center"
//                   >
//                     Track Order
//                   </button>
//                 </div>
//               </form>

//               {/* Error Message */}
//               {errorMessage && (
//                 <p className="text-red-500 text-center mb-4">{errorMessage}</p>
//               )}

//               {/* Tabs for Order Status */}
//               <div className="flex border-b-2 border-purple-300 mb-6">
//                 <button
//                   disabled={!isTabClickable}
//                   onClick={() => setCurrentTab("processing")}
//                   className={`flex-1 text-center py-3 text-lg ${
//                     currentTab === "processing"
//                       ? "border-b-2 border-purple-600 text-purple-700"
//                       : "text-gray-500 hover:text-purple-500"
//                   }`}
//                 >
//                   <FaClock className="inline mr-2 w-6 h-6" />
//                   Processing
//                 </button>
//                 <button
//                   disabled={!isTabClickable}
//                   onClick={() => setCurrentTab("dispatched")}
//                   className={`flex-1 text-center py-3 text-lg ${
//                     currentTab === "dispatched"
//                       ? "border-b-2 border-purple-600 text-purple-700"
//                       : "text-gray-500 hover:text-purple-500"
//                   }`}
//                 >
//                   <FaTruck className="inline mr-2 w-6 h-6" />
//                   Dispatched
//                 </button>
//                 <button
//                   disabled={!isTabClickable}
//                   onClick={() => setCurrentTab("delivered")}
//                   className={`flex-1 text-center py-3 text-lg ${
//                     currentTab === "delivered"
//                       ? "border-b-2 border-purple-600 text-purple-700"
//                       : "text-gray-500 hover:text-purple-500"
//                   }`}
//                 >
//                   <FaCheckCircle className="inline mr-2 w-6 h-6" />
//                   Delivered
//                 </button>
//               </div>

//               {/* Order Status Content */}
//               <div className="mb-8">
//                 {currentTab === "processing" && (
//                   <div className="p-4 bg-gray-100 rounded-lg">
//                     <h3 className="text-xl font-semibold text-purple-800 mb-2">
//                       Processing
//                     </h3>
//                     <p className="text-gray-600">
//                       Your order is currently being processed.
//                     </p>
//                   </div>
//                 )}
//                 {currentTab === "dispatched" && (
//                   <div className="p-4 bg-gray-100 rounded-lg">
//                     <h3 className="text-xl font-semibold text-purple-800 mb-2">
//                       Dispatched
//                     </h3>
//                     <p className="text-gray-600">
//                       Your order has been dispatched and is on its way.
//                     </p>
//                   </div>
//                 )}
//                 {currentTab === "delivered" && (
//                   <div className="p-4 bg-gray-100 rounded-lg">
//                     <h3 className="text-xl font-semibold text-purple-800 mb-2">
//                       Delivered
//                     </h3>
//                     <p className="text-gray-600">
//                       Your order has been successfully delivered.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Order Details */}
//               <div className="bg-gray-50 p-6 rounded-md shadow-md">
//                 <h3 className="text-xl font-semibold text-purple-800 mb-6">
//                   Order Details
//                 </h3>
//                 {sampleOrders
//                   .filter((order) => order.id === orderId)
//                   .map((order) => (
//                     <div key={order.id}>
//                       {/* Order Information */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                         <div className="space-y-2">
//                           <p className="text-gray-600">
//                             <span className="font-semibold text-black">
//                               Order No :
//                             </span>{" "}
//                             {order.orderNo}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold text-black">
//                               Order Date :
//                             </span>{" "}
//                             {order.orderDate}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold text-black">
//                               Delivery Date :
//                             </span>{" "}
//                             {order.deliveryDate}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold text-black">
//                               Delivery Time :
//                             </span>{" "}
//                             {order.deliveryTime}
//                           </p>
//                         </div>
//                         <div className="space-y-2">
//                           <p className="text-gray-600">
//                             <span className="font-semibold text-black">
//                               Customer Name :
//                             </span>{" "}
//                             {order.customerName}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold text-black">
//                               Address :
//                             </span>{" "}
//                             {order.customerAddress}
//                           </p>
//                           <p className="text-gray-600">
//                             <span className="font-semibold text-black">
//                               Phone :
//                             </span>{" "}
//                             {order.customerPhone}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Product Details */}
//                       <div className="mb-6">
//                         <h4 className="text-lg font-semibold text-purple-700 mb-4">
//                           Products Information
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <table className="w-full border border-gray-300">
//                             <thead>
//                               <tr className="bg-purple-200 text-gray-700">
//                                 <th className="py-3 px-4 text-left font-semibold">
//                                   Product
//                                 </th>
//                                 <th className="py-3 px-4 text-center font-semibold">
//                                   Unit Price (Rs.)
//                                 </th>
//                                 <th className="py-3 px-4 text-center font-semibold">
//                                   Quantity
//                                 </th>
//                                 <th className="py-3 px-4 text-center font-semibold">
//                                   Total (Rs.)
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {order.products.map((product, idx) => (
//                                 <tr key={idx} className="odd:bg-gray-100">
//                                   <td className="py-3 px-4">{product.name}</td>
//                                   <td className="py-3 px-4 text-center">
//                                     {product.price}
//                                   </td>
//                                   <td className="py-3 px-4 text-center">
//                                     {product.quantity}
//                                   </td>
//                                   <td className="py-3 px-4 text-center">
//                                     {product.total}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>

//                       {/* Order Total */}
//                       <div className="flex flex-col md:flex-row justify-between gap-4">
//                         <p className="py-3 px-6 font-bold bg-purple-600 text-white rounded-lg text-center md:text-left">
//                           Sub Total:{" "}
//                           <span className="font-medium">{order.subTotal}</span>
//                         </p>
//                         <p className="py-3 px-6 font-bold bg-purple-700 text-white rounded-lg text-center md:text-left">
//                           Total Amount:{" "}
//                           <span className="font-medium">
//                             {order.totalAmount}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//               </div>

//               {/* Contact Support and Cancel Order buttons */}
//               <div className="mt-8 flex justify-center space-x-6">
//                 <Link to="/cancel-order">
//                   <button className="flex items-center bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300">
//                     <FaTimes className="inline mr-2 w-5 h-5" />
//                     Cancel Order
//                   </button>
//                 </Link>
//                 <button className="flex items-center bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
//                   <FaPhoneAlt className="inline mr-2 w-5 h-5" />
//                   Contact Support
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </LayoutOne>
//     </Fragment>
//   );
// };

// export default TrackOrderPage;
