import { motion } from "motion/react";
import { Coffee } from "lucide-react";

export function Footer() {



	return (
		<footer className="relative bg-gradient-to-br from-[#65350E] via-[#6A4334] to-[#65350E] text-[#FBF8F3] overflow-hidden">
			{/* Animated Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="footerBeans" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
							<ellipse cx="20" cy="20" rx="6" ry="9" fill="#B48665" opacity="0.5" />
							<ellipse cx="50" cy="50" rx="8" ry="11" fill="#D4A574" opacity="0.4" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#footerBeans)" />
				</svg>
			</div>

			{/* Floating particles */}
			{[...Array(15)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-1 h-1 rounded-full bg-[#D4A574]"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						opacity: 0.5 + Math.random() * 0.5,
					}}
					animate={{
						y: [0, -10, 0],
						opacity: [0.5, 1, 0.5],
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
							<Coffee className="w-7 h-7 text-[#FBF8F3]" />
						</div>
						<span className="font-serif text-2xl text-[#FBF8F3]">Brewly</span>
					</div>
					<p className="text-[#FBF8F3]/80 max-w-md">
						The all-in-one POS and analytics platform for modern cafes, bars, and restaurants.
					</p>
				</div>

				{/* Divider */}
				<div className="my-10 border-t border-[#B48665]/30" />

				{/* Social and Copyright */}
				<div className="flex flex-col items-center gap-6">
					<div className="text-[#FBF8F3]/60 text-sm">
						&copy; {new Date().getFullYear()} Brewly. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
