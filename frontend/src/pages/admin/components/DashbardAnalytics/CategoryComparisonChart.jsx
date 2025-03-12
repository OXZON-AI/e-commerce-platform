import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import axiosInstance from "../../../../axiosConfig";
import { format } from "date-fns";

const colors = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
  "#14B8A6",
  "#9333EA",
  "#D97706",
  "#2563EB",
  "#F43F5E",
  "#22C55E",
  "#EAB308",
  "#3F83F8",
  "#C026D3",
  "#DC2626",
  "#0EA5E9",
  "#A855F7",
  "#F87171",
  "#4ADE80",
  "#FACC15",
  "#FB923C",
  "#06B6D4",
];

const CategoryComparisonChart = () => {
  const [categories, setCategories] = React.useState([]);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get("/v1/categories");
        const data = response.data;

        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    const getCategoryPerformance = async () => {
      try {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);

        const response = await axiosInstance.get(
          `/v1/analytics/categories/performance?userType=customer&interval=day&startDate=${weekAgo}&endDate=${today}`
        );
        const data = response.data;

        const performance = data.map((item) => {
          const day = format(new Date(item._id), "EEE");

          const categoryCounts = item.categories.reduce((acc, cat) => {
            acc[cat.category.slug] = (acc[cat.category.slug] || 0) + cat.count;
            return acc;
          }, {});

          return { day, ...categoryCounts };
        });

        const dayMap = new Map();

        const performanceMap = new Map(
          performance.map((item) => [item.day, item])
        );

        const getDefaultCategoryCounts = () =>
          categories.reduce((acc, item) => {
            acc[item.slug] = 0;
            return acc;
          }, {});

        for (
          let d = new Date(weekAgo);
          d <= today;
          d.setDate(d.getDate() + 1)
        ) {
          const formattedDay = format(d, "EEE");

          dayMap.set(
            formattedDay,
            performanceMap.get(formattedDay) || getDefaultCategoryCounts()
          );
        }

        setData(
          Array.from(dayMap, ([key, value]) => {
            return { day: key, ...value };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
    getCategoryPerformance();
  }, []);

  return (
    <motion.div
      className="bg-gray-100 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-black mb-4">
        Category Performance
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            {categories.map((item, i) => (
              <Bar
                key={item._id}
                dataKey={item.slug}
                stackId="a"
                fill={colors[i % colors.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryComparisonChart;
