import { motion } from "motion/react";
import { Coffee, Wine, ShoppingBag, Store, TrendingUp, Users } from "lucide-react";

export function UseCasesSection() {
	const useCases = [
		{
			icon: Coffee,
			title: "Coffee Shops",
			description: "Streamline operations for busy cafes with quick checkout and inventory tracking",
			features: ["Quick service mode", "Loyalty programs", "Barista scheduling"],
			color: "#B48665",
			stats: { metric: "3x", label: "Faster checkout" },
		},
		{
			icon: Wine,
			title: "Bars & Pubs",
			description: "Manage complex tabs, split bills, and track high-volume evening rushes",
			features: ["Tab management", "Split billing", "Happy hour pricing"],
			color: "#6A4334",
			stats: { metric: "45%", label: "Revenue increase" },
		},
		{
			icon: Store,
			title: "Restaurants",
			description: "Table management, kitchen orders, and seamless dine-in experience",
			features: ["Table tracking", "Kitchen integration", "Waitstaff tips"],
			color: "#D4A574",
			stats: { metric: "60%", label: "Order accuracy" },
		},
		{
			icon: ShoppingBag,
			title: "Food Trucks",
			description: "Mobile-first solution for on-the-go vendors with offline capabilities",
			features: ["Offline mode", "Location tracking", "Quick menus"],
			color: "#65350E",
			stats: { metric: "99%", label: "Uptime" },
		},
	];

	const benefits = [
		{
			icon: TrendingUp,
			title: "Boost Sales",
			description: "Increase revenue with upsell prompts, loyalty rewards, and targeted offers.",
			color: "#B48665",
		},
		{
			icon: Users,
			title: "Delight Customers",
			description: "Faster service, personalized experiences, and digital receipts keep guests coming back.",
			color: "#6A4334",
		},
		{
			icon: Store,
			title: "Simplify Operations",
			description: "Automate inventory, manage staff, and reduce manual errors with smart tools.",
			color: "#D4A574",
		},
	];

	return (
		<section className="relative py-32 bg-gradient-to-b from-[#FFFBF5] to-[#FBF8F3] overflow-hidden">
			{/* Decorative background */}
			<div className="absolute inset-0 opacity-5">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<filter id="noiseUseCases">
						<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" />
						<feColorMatrix type="saturate" values="0" />
					</filter>
					<rect width="100%" height="100%" filter="url(#noiseUseCases)" />
				</svg>
			</div>

			<div className="container mx-auto px-6 relative z-10">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-20 space-y-6"
				>
					<h2 className="font-serif text-5xl md:text-6xl text-[#65350E]">Perfect for Every Venue</h2>
					<p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto leading-relaxed">
						Brewly adapts to your unique business needs, whether you run a cozy cafe, bustling bar, or mobile food truck
					</p>
				</motion.div>

				{/* Use Cases Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
					{useCases.map((useCase, index) => {
						const Icon = useCase.icon;
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.7, delay: index * 0.1 }}
								className="relative bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border border-[#B48665]/10"
							>
								{/* Icon and Title */}
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${useCase.color}20` }}>
										<Icon className="w-7 h-7" style={{ color: useCase.color }} />
									</div>
									<div>
										<h3 className="text-2xl font-serif text-[#65350E]">{useCase.title}</h3>
										<div className="text-[#6A4334]/60 text-sm">{useCase.description}</div>
									</div>
								</div>

								{/* Features List */}
								<ul className="flex flex-wrap gap-3 mt-2">
									{useCase.features.map((feature) => (
										<li key={feature} className="bg-[#FBF8F3] text-[#6A4334]/80 px-3 py-1 rounded-full text-xs font-medium border border-[#B48665]/20">
											{feature}
										</li>
									))}
								</ul>

								{/* Stats */}
								<div className="flex items-center gap-2 mt-4">
									<span className="font-serif text-3xl text-[#B48665]">{useCase.stats.metric}</span>
									<span className="text-[#6A4334]/60 text-sm">{useCase.stats.label}</span>
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Benefits Row */}
				<div className="flex flex-col md:flex-row justify-center gap-10">
					{benefits.map((benefit, index) => {
						const Icon = benefit.icon;
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.7, delay: index * 0.1 }}
								className="flex flex-col items-center gap-4 bg-[#FBF8F3] rounded-2xl shadow-lg p-8 border border-[#B48665]/10 max-w-xs mx-auto"
							>
								<div className="w-12 h-12 rounded-full flex items-center justify-center shadow" style={{ backgroundColor: `${benefit.color}20` }}>
									<Icon className="w-6 h-6" style={{ color: benefit.color }} />
								</div>
								<h4 className="font-serif text-xl text-[#65350E]">{benefit.title}</h4>
								<p className="text-[#6A4334]/70 text-center text-sm">{benefit.description}</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
