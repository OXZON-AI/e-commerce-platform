import React from "react";
import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";
import SalesSummaryChart from "./components/DashbardAnalytics/SalesSummaryChart";
import SalesPerformanceChart from "./components/DashbardAnalytics/SalesPerformanceChart";
import { Stats } from "./components/DashbardAnalytics/stats";
import { FiFileText, FiFile } from "react-icons/fi";
import OrderCountStatusChart from "./components/DashbardAnalytics/OrderCountChart";
import CategoryChart from "./components/DashbardAnalytics/CategoryComparisonChart";
import SalesComparisonChart from "./components/DashbardAnalytics/SalesComparisonChart";

const Dashboard = () => {
  const handleExcelExport = () => {
    alert("Excel export triggered");
  };

  const handleCSVExport = () => {
    alert("CSV export triggered");
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="ml-6 mt-8 flex-1 pr-6">
          <div className="pb-6 border-b border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <h2 className="text-3xl font-semibold text-gray-800">
                Genuine Electronics Dash Board
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleExcelExport}
                  className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 w-full sm:w-auto transition-all"
                >
                  <FiFileText className="w-5 h-5 mr-2" />
                  Export Excel
                </button>
                <button
                  onClick={handleCSVExport}
                  className="flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 w-full sm:w-auto transition-all"
                >
                  <FiFile className="w-5 h-5 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <Stats />

            {/* CHARTS */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
              {/* Top Section */}
              <div className="lg:col-span-1">
                <SalesPerformanceChart />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <OrderCountStatusChart />
                <CategoryChart />
              </div>

              {/* Bottom Section */}
              <div className="lg:col-span-1">
                <SalesComparisonChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
