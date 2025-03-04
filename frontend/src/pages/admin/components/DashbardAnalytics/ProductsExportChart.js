import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

const electronicsSalesData = [
	{ day: "Mon", Smartphones: 50, Laptops: 30, Tablets: 20, Cameras: 15, Headphones: 40, Smartwatches: 25 },
	{ day: "Tue", Smartphones: 60, Laptops: 35, Tablets: 25, Cameras: 20, Headphones: 45, Smartwatches: 30 },
	{ day: "Wed", Smartphones: 70, Laptops: 40, Tablets: 30, Cameras: 25, Headphones: 50, Smartwatches: 35 },
	{ day: "Thu", Smartphones: 80, Laptops: 45, Tablets: 35, Cameras: 30, Headphones: 55, Smartwatches: 40 },
	{ day: "Fri", Smartphones: 90, Laptops: 50, Tablets: 40, Cameras: 35, Headphones: 60, Smartwatches: 45 },
	{ day: "Sat", Smartphones: 100, Laptops: 55, Tablets: 45, Cameras: 40, Headphones: 65, Smartwatches: 50 },
	{ day: "Sun", Smartphones: 110, Laptops: 60, Tablets: 50, Cameras: 45, Headphones: 70, Smartwatches: 55 },
];

const ProductsExportChart = () => {
	return (
		<motion.div
			className='bg-gray-100 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold text-black mb-4'>Electronics Products Export</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={electronicsSalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='day' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Bar dataKey='Smartphones' stackId='a' fill='#6366F1' />
						<Bar dataKey='Laptops' stackId='a' fill='#8B5CF6' />
						<Bar dataKey='Tablets' stackId='a' fill='#EC4899' />
						<Bar dataKey='Cameras' stackId='a' fill='#10B981' />
						<Bar dataKey='Headphones' stackId='a' fill='#F59E0B' />
						<Bar dataKey='Smartwatches' stackId='a' fill='#3B82F6' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ProductsExportChart;
