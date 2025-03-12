import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Dummy Data for Order Summary (Grouped Bar)
const salesSummaryData = [
	{ name: "Smartphones", Revenue: 500, UnitsSold: 320, Returns: 30 },
	{ name: "Laptops", Revenue: 720, UnitsSold: 250, Returns: 20 },
	{ name: "Tablets", Revenue: 450, UnitsSold: 270, Returns: 25 },
	{ name: "Cameras", Revenue: 380, UnitsSold: 180, Returns: 15 },
	{ name: "Headphones", Revenue: 250, UnitsSold: 350, Returns: 40 },
  ];

// Order Summary Grouped Bar Chart
const SalesSummaryChart = () => {
	return (
		<motion.div
		  className='bg-white shadow-lg rounded-xl p-6 border border-gray-300'
		  initial={{ opacity: 0, y: 20 }}
		  animate={{ opacity: 1, y: 0 }}
		  transition={{ delay: 0.4 }}
		>
		  <h2 className='text-2xl font-semibold text-gray-800 mb-4'>📊 Sales Summary</h2>
		  <div style={{ width: "100%", height: 350 }}>
			<ResponsiveContainer>
			  <BarChart data={salesSummaryData} barGap={6}>
				<CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
				<XAxis dataKey='name' stroke='#374151' />
				<YAxis stroke='#374151' />
				<Tooltip
				  contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
				  itemStyle={{ color: "#374151" }}
				/>
				<Legend />
				<Bar dataKey='Revenue' fill='#3B82F6' /> {/* Blue for Revenue */}
				<Bar dataKey='UnitsSold' fill='#10B981' /> {/* Green for Units Sold */}
				<Bar dataKey='Returns' fill='#F87171' /> {/* Red for Returns */}
			  </BarChart>
			</ResponsiveContainer>
		  </div>
		</motion.div>
	  );
	};

export default SalesSummaryChart;
