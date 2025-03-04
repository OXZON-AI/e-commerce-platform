// // import React from "react";

// // import Sidebar from "./components/Sidebar";
// // import AdminNavbar from "./components/AdminNavbar";

// // const Dashboard = () => {
// //   return (
// //     <div className="flex flex-col h-screen">
// //       {/* Admin Navbar placed on top */}
// //       <AdminNavbar />

// //       <div className="flex flex-1">
// //         {/* Sidebar on the left */}
// //         <Sidebar />
// //         <div>Dashboard</div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// import { Card, CardContent } from "../../components/ui/card/Card";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { useState } from "react";

// const salesPerformanceData = [
//   { name: "Jan", sales: 5000 },
//   { name: "Feb", sales: 7000 },
//   { name: "Mar", sales: 4000 },
// ];

// const salesExportData = [
//   { id: 1, date: "2024-02-01", product: "iPhone 15", amount: "$999" },
//   { id: 2, date: "2024-02-02", product: "MacBook Air", amount: "$1299" },
// ];

// const productsData = [
//   { id: 1, name: "iPhone 15", category: "Smartphone", price: "$999" },
//   { id: 2, name: "MacBook Air", category: "Laptop", price: "$1299" },
// ];

// const Dashboard = () => {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>

//       {/* Cards Row */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//         <Card>
//           <CardContent className="p-4">
//             <h2 className="text-gray-500 text-sm">Total Sales</h2>
//             <p className="text-2xl font-bold">$25,000</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <h2 className="text-gray-500 text-sm">Total Orders</h2>
//             <p className="text-2xl font-bold">450</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <h2 className="text-gray-500 text-sm">Sales Growth</h2>
//             <p className="text-2xl font-bold">15%</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <h2 className="text-gray-500 text-sm">Returning Customers</h2>
//             <p className="text-2xl font-bold">320</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Bar Chart */}
//       <div className="bg-white p-6 shadow rounded-lg mb-6">
//         <h2 className="text-lg font-bold mb-4">Sales Performance</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={salesPerformanceData}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="sales" fill="#4F46E5" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Sales Export & Products Export Tables */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Sales Export Table */}
//         <div className="bg-white p-6 shadow rounded-lg">
//           <h2 className="text-lg font-bold mb-4">Sales Export</h2>
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 border">Date</th>
//                 <th className="p-2 border">Product</th>
//                 <th className="p-2 border">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesExportData.map((sale) => (
//                 <tr key={sale.id}>
//                   <td className="p-2 border">{sale.date}</td>
//                   <td className="p-2 border">{sale.product}</td>
//                   <td className="p-2 border">{sale.amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Products Export Table */}
//         <div className="bg-white p-6 shadow rounded-lg">
//           <h2 className="text-lg font-bold mb-4">Products Export</h2>
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Category</th>
//                 <th className="p-2 border">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {productsData.map((product) => (
//                 <tr key={product.id}>
//                   <td className="p-2 border">{product.name}</td>
//                   <td className="p-2 border">{product.category}</td>
//                   <td className="p-2 border">{product.price}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const [salesSummary, setSalesSummary] = useState({});
//   const [salesPerformance, setSalesPerformance] = useState([]);
  
//   const API_BASE_URL = "http://localhost:3000/v1/analytics";

//   useEffect(() => {
//     // Fetch Sales Summary
//     axios.get(`${API_BASE_URL}/sales/summary?status=pending&userType=customer&startDate=2025/1/2&endDate=2025/2/26`)
//       .then(response => setSalesSummary(response.data))
//       .catch(error => console.error("Error fetching sales summary:", error));

//     // Fetch Sales Performance
//     axios.get(`${API_BASE_URL}/sales/performance?userType=customer&interval=day&startDate=2025/1/2&endDate=2025/2/26`)
//       .then(response => setSalesPerformance(response.data))
//       .catch(error => console.error("Error fetching sales performance:", error));
//   }, []);

//   return (
    

// //     <div className="flex flex-col h-screen">
// //        {/* Admin Navbar placed on top */}
// //        <AdminNavbar />

// // <div className="flex flex-1">
// //   {/* Sidebar on the left */}
// //   <Sidebar />
// //  </div>
// //     </div>
   
//     <div className="p-6">
//          <div ><h1 className="text-3xl font-bold text-center mb-6">
//               Shop by Category
//             </h1>
//             </div>
//       {/* Sales Summary Cards */}
//       <div className="grid grid-cols-4 gap-4">
//         <div className="bg-white shadow p-4 rounded-lg">
//           <h2 className="text-lg font-bold">Total Orders</h2>
//           <p>{salesSummary.orderCount || 0}</p>
//         </div>
//         <div className="bg-white shadow p-4 rounded-lg">
//           <h2 className="text-lg font-bold">Revenue</h2>
//           <p>${salesSummary.revenue || 0}</p>
//         </div>
//         <div className="bg-white shadow p-4 rounded-lg">
//           <h2 className="text-lg font-bold">Profit</h2>
//           <p>${salesSummary.profit || 0}</p>
//         </div>
//         <div className="bg-white shadow p-4 rounded-lg">
//           <h2 className="text-lg font-bold">Avg Order Value</h2>
//           <p>${salesSummary.averageOrderValue || 0}</p>
//         </div>
//       </div>

//       {/* Sales Performance Chart */}
//       <div className="mt-6 bg-white shadow p-4 rounded-lg">
//         <h2 className="text-lg font-bold mb-4">Sales Performance</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={salesPerformance}>
//             <XAxis dataKey="_id" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="revenue" fill="#4CAF50" name="Revenue" />
//             <Bar dataKey="profit" fill="#2196F3" name="Profit" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Export Buttons */}
//       <div className="mt-6 flex gap-4">
//         <button 
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => window.open(`${API_BASE_URL}/sales/export`, "_blank")}
//         >
//           Export Sales
//         </button>
//         <button 
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           onClick={() => window.open(`${API_BASE_URL}/products/export`, "_blank")}
//         >
//           Export Products
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";
import StatCard from "./components/DashbardAnalytics/StatCard";
import SalesSummaryChart from "./components/DashbardAnalytics/SalesSummaryChart";
import SalesPerformanceChart from "./components/DashbardAnalytics/SalesPerformanceChart";
import ProductsExportChart from "./components/DashbardAnalytics/ProductsExportChart";
import SalesExportChart from "./components/DashbardAnalytics/SalesExportChart";

const Dashboard = () => {
  const [salesSummary, setSalesSummary] = useState({});
  const [salesPerformance, setSalesPerformance] = useState([]);
  
  const API_BASE_URL = "http://localhost:3000/v1/analytics";

  useEffect(() => {
    // Fetch Sales Summary
    axios.get(`${API_BASE_URL}/sales/summary?status=pending&userType=customer&startDate=2025/1/2&endDate=2025/2/26`)
      .then(response => setSalesSummary(response.data))
      .catch(error => console.error("Error fetching sales summary:", error));

    // Fetch Sales Performance
    axios.get(`${API_BASE_URL}/sales/performance?userType=customer&interval=day&startDate=2025/1/2&endDate=2025/2/26`)
      .then(response => setSalesPerformance(response.data))
      .catch(error => console.error("Error fetching sales performance:", error));
  }, []);

  return (
    
      <div className="flex flex-col h-screen">
        {/* Admin Navbar placed on top */}
         <AdminNavbar />

         <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar />

        <div className=" ml-6 mt-8">
        <h2 className="text-3xl font-semibold text-gray-800">
        Genuine Electronics Dash Board
        </h2>


        <div className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Sales' icon={Zap} value='$12,345' color='#6366F1' />
					<StatCard name='New Users' icon={Users} value='1,234' color='#8B5CF6' />
					<StatCard name='Total Products' icon={ShoppingBag} value='567' color='#EC4899' />
					<StatCard name='Conversion Rate' icon={BarChart2} value='12.5%' color='#10B981' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 gap-8 lg:grid-cols-1'>
  {/* Top Section */}
  <div className='lg:col-span-1'>
    <SalesSummaryChart />
  </div>

  {/* Middle Section */}
  <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
    <SalesPerformanceChart />
    <ProductsExportChart />
  </div>

  {/* Bottom Section */}
  <div className='lg:col-span-1'>
    <SalesExportChart />
  </div>
</div>

			</div>

      
        </div>
      </div>
      </div>
     
     


  );
};

export default Dashboard;






