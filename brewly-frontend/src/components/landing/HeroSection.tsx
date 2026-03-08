import { motion } from "motion/react";
import { Coffee, Sparkles, TrendingUp, Coins } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroSection({ onGetStarted }: { onGetStarted?: () => void }) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: (e.clientX / window.innerWidth - 0.5) * 20,
				y: (e.clientY / window.innerHeight - 0.5) * 20,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const floatingElements = [
		{ icon: Coffee, delay: 0, radius: 250, color: "#B48665" },
		{ icon: Sparkles, delay: 1, radius: 300, color: "#D4A574" },
		{ icon: TrendingUp, delay: 2, radius: 280, color: "#6A4334" },
		{ icon: Coins, delay: 1.5, radius: 320, color: "#B48665" },
	];

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFFBF5] via-[#FBF8F3] to-[#D4A574]/10">
			{/* Animated Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="coffeeBeans" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
							<ellipse cx="20" cy="20" rx="8" ry="12" fill="#6A4334" opacity="0.3" />
							<ellipse cx="60" cy="60" rx="10" ry="14" fill="#65350E" opacity="0.2" />
							<ellipse cx="80" cy="30" rx="7" ry="11" fill="#B48665" opacity="0.25" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#coffeeBeans)" />
				</svg>
			</div>

			{/* Steam Effect */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-64 pointer-events-none">
				{[...Array(3)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute bottom-0 left-1/2 w-2 h-32 bg-gradient-to-t from-[#B48665]/20 to-transparent rounded-full blur-xl"
						initial={{ y: 0, opacity: 0.5, x: -4 }}
						animate={{
							y: -200,
							opacity: [0.5, 0.8, 0],
							x: [
								-4 + Math.sin(i * 2) * 20,
								-4 + Math.sin(i * 2 + 1) * 30,
								-4 + Math.sin(i * 2 + 2) * 40,
							],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							delay: i * 1.3,
							ease: "easeOut",
						}}
					/>
				))}
			</div>

			<div className="container mx-auto px-6 z-10 relative">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-8"
					>
						{/* Main Heading */}
						<div className="space-y-4">
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-[#65350E]"
							>
								Brewly
							</motion.h1>
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="text-3xl md:text-4xl text-[#6A4334] leading-tight"
							>
								Billing System
							</motion.h2>
						</div>

						{/* Tagline */}
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className="text-xl md:text-2xl text-[#6A4334]/80 leading-relaxed max-w-xl"
						>
							Next-generation billing and analytics platform that transforms how cafes and bars manage
							their business—brewed to perfection with AI.
						</motion.p>

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="flex flex-wrap gap-4"
						>
							<motion.button
								whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(101, 53, 14, 0.2)" }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-gradient-to-r from-[#65350E] to-[#6A4334] text-[#FBF8F3] rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
								onClick={onGetStarted}
							>
								<span className="relative z-10">Get Started</span>
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-[#B48665] to-[#D4A574]"
									initial={{ x: "-100%" }}
									whileHover={{ x: 0 }}
									transition={{ duration: 0.3 }}
								/>
							</motion.button>
						</motion.div>

						{/* Stats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className="flex flex-wrap gap-8 pt-8"
						>
							{[
								{ value: "5000+", label: "Active Cafes" },
								{ value: "99.9%", label: "Uptime" },
								{ value: "24/7", label: "Support" },
							].map((stat, i) => (
								<div key={i} className="space-y-1"></div>
							))}
						</motion.div>
					</motion.div>

					{/* Right - 3D Coffee Machine Centerpiece */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.3 }}
						className="relative h-[600px] hidden lg:block"
						style={{
							transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${mousePosition.y * -0.5}deg)`,
						}}
					>
						{/* Central Machine Illustration */}
						<div className="absolute inset-0 flex items-center justify-center">
							<motion.div
								animate={{ y: [0, -20, 0] }}
								transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
								className="relative w-80 h-96"
							>
								{/* Coffee Machine Body */}
								<div className="absolute inset-x-12 top-8 bottom-20 bg-gradient-to-br from-[#6A4334] via-[#65350E] to-[#6A4334] rounded-3xl shadow-2xl transform -skew-y-1">
									{/* Screen */}
									<div className="absolute top-8 left-8 right-8 h-32 bg-gradient-to-br from-[#D4A574] to-[#B48665] rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
										<motion.div
											animate={{ opacity: [0.5, 1, 0.5] }}
											transition={{ duration: 2, repeat: Infinity }}
											className="text-[#FBF8F3] text-sm font-mono"
										>
											ANALYTICS READY
										</motion.div>
									</div>

									{/* Buttons */}
									<div className="absolute bottom-12 left-8 right-8 flex gap-4">
										{[...Array(3)].map((_, i) => (
											<motion.div
												key={i}
												whileHover={{ scale: 1.1 }}
												className="flex-1 h-8 bg-[#B48665] rounded-lg shadow-lg"
											/>
										))}
									</div>
								</div>

								{/* Steam Wand */}
								<div className="absolute right-4 top-16 w-4 h-32 bg-gradient-to-b from-[#B48665] to-[#6A4334] rounded-full shadow-xl" />

								{/* Cup Platform */}
								<div className="absolute inset-x-16 bottom-12 h-8 bg-gradient-to-b from-[#B48665] to-[#65350E] rounded-t-xl shadow-xl" />
							</motion.div>
						</div>

						{/* Floating UI Elements */}
						{floatingElements.map((elem, i) => {
							const Icon = elem.icon;
							const angle = (i / floatingElements.length) * Math.PI * 2;
							const x = Math.cos(angle) * elem.radius;
							const y = Math.sin(angle) * elem.radius;

							return (
								<motion.div
									key={i}
									className="absolute left-1/2 top-1/2"
									style={{
										x: x - 32,
										y: y - 32,
									}}
									animate={{
										rotate: [0, 360],
										scale: [1, 1.2, 1],
									}}
									transition={{
										rotate: { duration: 20, repeat: Infinity, ease: "linear" },
										scale: { duration: 2, repeat: Infinity, delay: elem.delay },
									}}
								>
									<motion.div
										whileHover={{ scale: 1.3, rotate: 15 }}
										className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center border-2 border-white/50 cursor-pointer"
									>
										<Icon className="w-8 h-8" style={{ color: elem.color }} />
									</motion.div>

									{/* Coffee Bean Particles */}
									<motion.div
										className="absolute -top-2 -right-2 w-4 h-5 rounded-full bg-gradient-to-br from-[#6A4334] to-[#65350E] shadow-lg"
										animate={{
											y: [0, -10, 0],
											rotate: [0, 180, 360],
										}}
										transition={{
											duration: 3,
											repeat: Infinity,
											delay: elem.delay + 0.5,
										}}
									/>
								</motion.div>
							);
						})}

						{/* Orbiting Receipts */}
						<motion.div
							className="absolute left-1/2 top-1/2"
							animate={{ rotate: 360 }}
							transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
						>
							{[...Array(6)].map((_, i) => {
								const angle = (i / 6) * Math.PI * 2;
								const radius = 350;
								return (
									<motion.div
										key={i}
										className="absolute w-12 h-16 bg-white rounded shadow-xl border border-[#B48665]/20"
										style={{
											left: Math.cos(angle) * radius - 24,
											top: Math.sin(angle) * radius - 32,
										}}
										animate={{ rotateZ: [0, 360] }}
										transition={{
											duration: 10,
											repeat: Infinity,
											ease: "linear",
											delay: i * 0.5,
										}}
									>
										<div className="p-2 space-y-1">
											<div className="h-1 bg-[#B48665]/30 rounded" />
											<div className="h-1 bg-[#B48665]/30 rounded w-2/3" />
											<div className="h-1 bg-[#B48665]/30 rounded" />
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					</motion.div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.5 }}
				className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
			>
				<span className="text-sm text-[#6A4334]/60">Scroll to explore</span>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 1.5, repeat: Infinity }}
					className="w-6 h-10 rounded-full border-2 border-[#B48665] flex items-start justify-center p-2"
				>
					<motion.div className="w-1.5 h-1.5 bg-[#B48665] rounded-full" />
				</motion.div>
			</motion.div>
		</section>
	);
}
