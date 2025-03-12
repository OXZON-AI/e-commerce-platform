import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../../axiosConfig";

const orderData = [
  { name: "Pending", value: 320 },
  { name: "Processing", value: 320 },
  { name: "Shipped", value: 450 },
  { name: "Delivered", value: 700 },
  { name: "Canceled", value: 130 },
];

const COLORS = ["#FFBB28", "#0008FE", "#0088FE", "#00C49F", "#FF8042"];

const OrderCountStatusChart = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const [
          pendingData,
          processingData,
          shippedData,
          deliveredData,
          cancelledData,
        ] = await Promise.all([
          axiosInstance.get(
            "/v1/analytics/sales/summary?status=pending&startDate=2025/1/1"
          ),
          axiosInstance.get(
            "/v1/analytics/sales/summary?status=processing&startDate=2025/1/1"
          ),
          axiosInstance.get(
            "/v1/analytics/sales/summary?status=shipped&startDate=2025/1/1"
          ),
          axiosInstance.get(
            "/v1/analytics/sales/summary?status=delivered&startDate=2025/1/1"
          ),
          axiosInstance.get(
            "/v1/analytics/sales/summary?status=cancelled&startDate=2025/1/1"
          ),
        ]);

        setData([
          { name: "Pending", value: pendingData.data.orderCount },
          { name: "Processing", value: processingData.data.orderCount },
          { name: "Shipped", value: shippedData.data.orderCount },
          { name: "Delivered", value: deliveredData.data.orderCount },
          { name: "Cancelled", value: cancelledData.data.orderCount },
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <motion.div
      className="bg-gray-100 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-black mb-4">
        Order Status Distribution
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {orderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderCountStatusChart;
