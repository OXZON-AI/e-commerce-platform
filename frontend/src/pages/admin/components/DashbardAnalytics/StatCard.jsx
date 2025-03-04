import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
	return (
		<motion.div
			className='bg-gray-100 w-70 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-300'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-6 py-6 sm:p-8'>
				<span className='flex items-center text-sm font-medium text-black'>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
				<p className='mt-2 text-3xl font-semibold text-black'>{value}</p>
			</div>
		</motion.div>
	);
};

export default StatCard;
