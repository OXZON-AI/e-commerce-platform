import React from "react";

import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";
import SalesSummaryChart from "./components/DashbardAnalytics/SalesSummaryChart";
import SalesPerformanceChart from "./components/DashbardAnalytics/SalesPerformanceChart";
import ProductsExportChart from "./components/DashbardAnalytics/ProductsExportChart";
import SalesExportChart from "./components/DashbardAnalytics/SalesExportChart";
import { Stats } from "./components/DashbardAnalytics/stats";

const Dashboard = () => {
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

          <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            {/* STATS */}
            <Stats />
            {/* CHARTS */}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
              {/* Top Section */}
              <div className="lg:col-span-1">
                <SalesSummaryChart />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <SalesPerformanceChart />
                <ProductsExportChart />
              </div>

              {/* Bottom Section */}
              <div className="lg:col-span-1">
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
