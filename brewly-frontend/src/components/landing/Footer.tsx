import { motion } from "motion/react";
import { Coffee } from "lucide-react";

export function Footer() {



	return (
		<footer className="relative bg-transparent text-[#65350E] overflow-hidden border-t border-[#65350E]/10">
			{/* Floating particles */}
			{[...Array(15)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-1.5 h-1.5 rounded-full bg-[#B48665]"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						opacity: 0.25 + Math.random() * 0.4,
					}}
					animate={{
						y: [0, -15, 0],
						opacity: [0.3, 0.7, 0.3],
					}}
					transition={{
						duration: 3 + Math.random() * 2,
						repeat: Infinity,
						delay: i * 0.2,
					}}
				/>
			))}

			<div className="container mx-auto px-6 py-16 relative z-10">
				<div className="flex flex-col items-center justify-center text-center gap-6">
					{/* Logo and Contact */}
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B48665] to-[#65350E] flex items-center justify-center shadow-xl">
							<Coffee className="w-7 h-7 text-[#FAF6F0]" />
						</div>
						<span className="font-serif text-2xl text-[#65350E]">Brewly</span>
					</div>
					<p className="text-[#6A4334]/80 max-w-md">
						The all-in-one POS and analytics platform for modern cafes, bars, and restaurants.
					</p>
				</div>

				{/* Divider */}
				<div className="my-10 border-t border-[#65350E]/15" />

				{/* Social and Copyright */}
				<div className="flex flex-col items-center gap-6">
					<div className="text-[#6A4334]/60 text-sm">
						&copy; {new Date().getFullYear()} Brewly. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
