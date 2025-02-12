import React from "react";

import Sidebar from "./components/Sidebar";
import AdminNavbar from "./components/AdminNavbar";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Admin Navbar placed on top */}
      <AdminNavbar />

      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar />
        <div>Dashboard</div>
      </div>
    </div>
  );
};

export default Dashboard;
