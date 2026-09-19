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
			},
			{
				icon: Wine,
				title: "Bars & Pubs",
				description: "Manage complex tabs, split bills, and track high-volume evening rushes",
				features: ["Tab management", "Split billing", "Happy hour pricing"],
				color: "#6A4334",
			},
			{
				icon: Store,
				title: "Restaurants",
				description: "Table management, kitchen orders, and seamless dine-in experience",
				features: ["Table tracking", "Kitchen integration", "Waitstaff tips"],
				color: "#D4A574",
			},
			{
				icon: ShoppingBag,
				title: "Food Trucks",
				description: "Mobile-first solution for on-the-go vendors with offline capabilities",
				features: ["Offline mode", "Location tracking", "Quick menus"],
				color: "#65350E",
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
		<section className="relative py-32 bg-transparent overflow-hidden">
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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
					{useCases.map((useCase, index) => {
						const Icon = useCase.icon;
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.7, delay: index * 0.15 }}
								className="group relative bg-white/70 backdrop-blur-md hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(92,61,46,0.16)] border border-white/50 hover:border-[#5C3D2E]/35 rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all duration-300 overflow-hidden"
							>
								{/* Subtle ambient light glow in the corner on hover */}
								<div 
									className="absolute -right-16 -top-16 w-36 h-36 rounded-full opacity-[0.03] group-hover:opacity-[0.08] blur-2xl transition-opacity duration-300"
									style={{ backgroundColor: useCase.color }}
								/>

								{/* Icon and Title */}
								<div className="flex items-start gap-5">
									<div 
										className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md bg-white border border-[#B48665]/20 group-hover:scale-110 transition-transform duration-300"
										style={{ boxShadow: '0 8px 20px rgba(92, 61, 46, 0.05)' }}
									>
										<Icon className="w-6.5 h-6.5" style={{ color: useCase.color }} />
									</div>
									<div className="flex-1">
										<h3 className="text-xl font-serif font-bold text-[#65350E] group-hover:text-[#5C3D2E] transition-colors">
											{useCase.title}
										</h3>
										<p className="text-[#6A4334]/70 text-sm mt-1.5 leading-relaxed">
											{useCase.description}
										</p>
									</div>
								</div>

								{/* Features List */}
								<ul className="flex flex-wrap gap-2.5 pt-4 border-t border-[#5C3D2E]/5">
									{useCase.features.map((feature) => (
										<li 
											key={feature} 
											className="bg-[#FAF6F0] hover:bg-[#5C3D2E] hover:text-[#FAF6F0] text-[#6A4334]/90 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[#B48665]/15 hover:scale-105 hover:shadow-soft transition-all duration-200 cursor-default"
										>
											{feature}
										</li>
									))}
								</ul>
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
								className="flex flex-col items-center gap-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/40 max-w-xs mx-auto"
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
