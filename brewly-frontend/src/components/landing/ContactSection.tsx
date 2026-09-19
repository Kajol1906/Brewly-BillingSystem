import { motion } from "motion/react";
import { Github, Linkedin, Sparkles, ArrowUpRight } from "lucide-react";

export function ContactSection() {
	const socialLinks = [
		{
			icon: Github,
			label: "GitHub",
			sublabel: "Explore my source code & projects",
			href: "https://github.com",
			color: "#FBF8F3",
			bgColor: "rgba(250, 246, 240, 0.08)",
			hoverColor: "#D4A574",
			hoverGlow: "rgba(212, 165, 116, 0.2)",
		},
		{
			icon: Linkedin,
			label: "LinkedIn",
			sublabel: "Connect with me professionally",
			href: "https://linkedin.com",
			color: "#FBF8F3",
			bgColor: "rgba(250, 246, 240, 0.08)",
			hoverColor: "#D4A574",
			hoverGlow: "rgba(212, 165, 116, 0.2)",
		},
	];

	return (
		<section className="relative py-32 bg-gradient-to-br from-[#65350E] via-[#6A4334] to-[#65350E] text-[#FBF8F3] overflow-hidden rounded-t-[48px] shadow-[0_-20px_50px_rgba(92,61,46,0.15)]">
			{/* Decorative Background Stencils */}
			<div className="absolute inset-0 opacity-[0.06]">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="contactBeansDark" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
							<ellipse cx="20" cy="20" rx="6" ry="9" fill="#B48665" />
							<ellipse cx="50" cy="50" rx="8" ry="11" fill="#D4A574" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#contactBeansDark)" />
				</svg>
			</div>

			{/* Soft Glowing Ambient Light behind the Card */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.15)_0%,transparent_70%)] pointer-events-none blur-3xl z-0" />

			{/* Floating coffee particles */}
			{[...Array(12)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-1.5 h-1.5 rounded-full bg-[#D4A574] z-0"
					style={{
						left: `${10 + Math.random() * 80}%`,
						top: `${10 + Math.random() * 80}%`,
						opacity: 0.3 + Math.random() * 0.4,
					}}
					animate={{
						y: [0, -20, 0],
						opacity: [0.4, 0.8, 0.4],
					}}
					transition={{
						duration: 4 + Math.random() * 3,
						repeat: Infinity,
						delay: i * 0.2,
					}}
				/>
			))}

			<div className="container mx-auto px-6 relative z-10 max-w-3xl">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.8 }}
					className="text-center"
				>
					{/* Badge */}
					<div className="flex justify-center mb-6">
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#D4A574] text-xs font-semibold uppercase tracking-wider border border-white/10 cursor-default"
						>
							<Sparkles className="w-3.5 h-3.5 text-[#D4A574] animate-pulse" />
							<span>Let's Collaborate</span>
						</motion.div>
					</div>

					{/* Content Stack */}
					<div className="text-center mb-12 space-y-4">
						<h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#FBF8F3] leading-tight">
							Connect With Me
						</h2>
						<p className="text-base md:text-lg text-[#FAF6F0]/80 max-w-2xl mx-auto leading-relaxed">
							Let's build something extraordinary together! Whether you'd like to collaborate on innovative digital solutions, talk about cafe management systems, or just say hello—let's keep in touch.
						</p>
					</div>

					{/* Modern Social Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
						{socialLinks.map((social, index) => {
							const Icon = social.icon;
							return (
								<motion.a
									key={index}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.15 }}
									whileHover={{ 
										y: -6,
										borderColor: "rgba(212, 165, 116, 0.4)",
										boxShadow: `0 20px 40px ${social.hoverGlow}`
									}}
									className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-300 group/social shadow-sm"
								>
									<div className="flex items-center gap-4">
										{/* Platform Icon container */}
										<div 
											className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 group-hover/social:rotate-[360deg] shadow-inner bg-white/5 border border-white/5"
										>
											<Icon 
												className="w-7 h-7 text-[#FBF8F3] group-hover/social:text-[#D4A574] transition-colors" 
											/>
										</div>
										
										{/* Label Text Stack */}
										<div className="text-left">
											<span className="block text-lg font-bold text-[#FBF8F3] group-hover/social:text-[#D4A574] transition-colors">
												{social.label}
											</span>
											<span className="block text-xs text-[#FAF6F0]/60 mt-0.5 leading-snug">
												{social.sublabel}
											</span>
										</div>
									</div>

									{/* Arrow indicator */}
									<div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover/social:bg-[#D4A574] transition-colors duration-300 shadow-soft">
										<ArrowUpRight 
											className="w-4 h-4 text-[#FAF6F0] group-hover/social:text-[#2C1810] group-hover/social:translate-x-0.5 group-hover/social:-translate-y-0.5 transition-all duration-300"
										/>
									</div>
								</motion.a>
							);
						})}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
