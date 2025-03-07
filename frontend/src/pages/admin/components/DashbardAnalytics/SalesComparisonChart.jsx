import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import axiosInstance from "../../../../axiosConfig";
import { format } from "date-fns";

// Sample Sales Export Dataset (with electronics sales for different countries)
const salesExportData = [
  { name: "Smartphone", USA: 2500, UK: 2000, Germany: 1800, Maldives: 1500 },
  { name: "Laptops", USA: 1700, UK: 1400, Germany: 1200, Maldives: 1000 },
  { name: "Tables", USA: 2000, UK: 1500, Germany: 1300, Maldives: 1200 },
  { name: "Cameras", USA: 3000, UK: 2400, Germany: 2200, Maldives: 1900 },
  { name: "Headphones", USA: 1600, UK: 1200, Germany: 1100, Maldives: 800 },
];

// Sales Export Chart with custom colors
const SalesComparisonChart = () => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getSalesData = async () => {
      try {
        const response = await axiosInstance.get(
          "/v1/analytics/sales/performance?interval=month&startDate=2025/1/1"
        );
        const data = response.data;

        const monthMap = new Map();
        const salesMap = new Map(
          data.map((item) => [
            format(item._id, "MMM"),
            {
              cost: item.cost.toFixed(0),
              profit: item.profit.toFixed(0),
              revenue: item.revenue.toFixed(0),
            },
          ])
        );

        for (let i = 1; i <= 12; i++) {
          const date = new Date(2025, i - 1, 1);
          const formattedDay = format(date, "MMM");
          monthMap.set(
            formattedDay,
            salesMap.get(formattedDay) || {
              cost: 0,
              profit: 0,
              revenue: 0,
            }
          );
        }

        setData(
          Array.from(monthMap, ([key, value]) => ({ name: key, ...value }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    getSalesData();
  }, []);

  return (
    <motion.div
      className="bg-gray-100 shadow-lg rounded-xl p-6 border border-gray-300" // Background color set to bg-gray-100
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        📊 Sales Comparison
      </h2>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
            <XAxis dataKey="name" stroke="#4B5563" />
            <YAxis stroke="#4B5563" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F9FAFB",
                borderColor: "#E5E7EB",
              }}
              itemStyle={{ color: "#4B5563" }}
            />
            <Legend />
            <Bar dataKey="cost" fill="#EF4444" />
            <Bar dataKey="profit" fill="#10B981" />
            <Bar dataKey="revenue" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesComparisonChart;
