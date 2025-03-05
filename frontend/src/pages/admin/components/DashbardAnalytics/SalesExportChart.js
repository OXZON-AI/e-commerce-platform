import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Sample Sales Export Dataset (with electronics sales for different countries)
const salesExportData = [
  { name: "Smartphone", USA: 2500, UK: 2000, Germany: 1800, Maldives: 1500 },
  { name: "Laptops", USA: 1700, UK: 1400, Germany: 1200, Maldives: 1000 },
  { name: "Tables", USA: 2000, UK: 1500, Germany: 1300, Maldives: 1200 },
  { name: "Cameras", USA: 3000, UK: 2400, Germany: 2200, Maldives: 1900 },
  { name: "Headphones", USA: 1600, UK: 1200, Germany: 1100, Maldives: 800 },
];

// Sales Export Chart with custom colors
const SalesExportChart = () => {
  return (
    <motion.div
      className='bg-gray-100 shadow-lg rounded-xl p-6 border border-gray-300' // Background color set to bg-gray-100
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>📊 Sales Export Chart</h2>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={salesExportData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#D1D5DB' />
            <XAxis dataKey='name' stroke='#4B5563' />
            <YAxis stroke='#4B5563' />
            <Tooltip
              contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
              itemStyle={{ color: "#4B5563" }}
            />
            <Legend />
            <Bar dataKey='USA' fill='#6B7280' />
            <Bar dataKey='UK' fill='#9CA3AF' />
            <Bar dataKey='Germany' fill='#D1D5DB' />
            <Bar dataKey='Maldives' fill='#34D399' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesExportChart;
