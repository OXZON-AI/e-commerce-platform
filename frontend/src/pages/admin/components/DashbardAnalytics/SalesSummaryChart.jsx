import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import React from "react";
import axiosInstance from "../../../../axiosConfig";
import { format } from "date-fns";

const SalesSummaryChart = () => {
  const [data, setData] = React.useState();

  React.useEffect(() => {
    const getSalesPerformance = async () => {
      try {
        const response = await axiosInstance.get(
          "/v1/analytics/sales/performance?interval=month&startDate=2025/1/1"
        );
        const data = response.data;

        const monthMap = new Map();

        const salesMap = new Map(
          data.map((item) => [
            format(new Date(item._id), "MMM"),
            item.orderCount,
          ])
        );

        for (let i = 1; i <= 12; i++) {
          const date = new Date(2025, i - 1, 1);
          const formattedMonth = format(date, "MMM");

          monthMap.set(formattedMonth, salesMap.get(formattedMonth) || 0);
        }

        setData(
          Array.from(monthMap, ([key, value]) => ({
            name: key,
            sales: value,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    getSalesPerformance();
  }, []);

  return (
    <motion.div
      className="bg-gray-100 w-100 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-black">Sales Performance</h2>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
            <XAxis dataKey={"name"} stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#D1D5DB",
              }}
              itemStyle={{ color: "#1F2937" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#1F2937"
              strokeWidth={3}
              dot={{ fill: "#1F2937", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesSummaryChart;
