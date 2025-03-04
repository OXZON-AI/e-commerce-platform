import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const salesData = [
	{
		name: "Sales Performance",
		percentage: 75, // Example: 75% of the sales target achieved
		fill: "#10B981", // Green color for good performance
	},
];

const SalesPerformanceChart = () => {
	return (
		<motion.div
			className='bg-gray-100 w-100 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300 flex flex-col items-center'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-black'>Sales Performance</h2>

			<div className='h-60 w-full'>
				<ResponsiveContainer width="100%" height="100%">
					<RadialBarChart
						cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" startAngle={180} endAngle={0} 
						barSize={20} data={salesData}
					>
						<RadialBar minAngle={15} background clockWise dataKey="percentage" />
						<Legend 
							iconSize={10} layout="vertical" verticalAlign="middle" align="right" 
							wrapperStyle={{ color: "#374151", fontSize: "14px" }} 
						/>
					</RadialBarChart>
				</ResponsiveContainer>
			</div>

			<p className="mt-2 text-xl font-semibold text-black">
				{salesData[0].percentage}% Achieved
			</p>
		</motion.div>
	);
};

export default SalesPerformanceChart;
