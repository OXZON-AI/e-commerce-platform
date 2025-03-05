import React from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import axiosInstance from "../../../../axiosConfig";

export const Stats = () => {
  const [salesSummary, setSalesSummary] = React.useState();
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);

  React.useEffect(() => {
    const getSalesSummary = async () => {
      try {
        const response = await axiosInstance.get("v1/analytics/sales/summary");
        const data = response.data;
        setSalesSummary(data);
      } catch (error) {
        console.log(error);
      }
    };

    const getTotalProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "/v1/products/?page=1&limit=1"
        );
        const data = response.data;
        setTotalProducts(data.paginationInfo.totalCount);
      } catch (error) {
        console.log(error);
      }
    };

    const getTotalUsers = async () => {
      try {
        const response = await axiosInstance.get("/v1/users/?page=1&limit=1");
        const data = response.data;
        setTotalUsers(data.paginationInfo.totalCount);
      } catch (error) {
        console.log(error);
      }
    };

    getSalesSummary();
    getTotalProducts();
    getTotalUsers();
  }, []);

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCard
        name="Total Profit"
        icon={Zap}
        value={`MVR ${salesSummary?.profit.toFixed(0)}`}
        color="#6366F1"
      />
      <StatCard
        name="Total Users"
        icon={Users}
        value={totalUsers}
        color="#8B5CF6"
      />
      <StatCard
        name="Total Products"
        icon={ShoppingBag}
        value={totalProducts}
        color="#EC4899"
      />
      <StatCard
        name="Conversion Rate"
        icon={BarChart2}
        value="12.5%"
        color="#10B981"
      />
    </motion.div>
  );
};
