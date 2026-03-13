import { motion } from "motion/react";
import { Github, Linkedin } from "lucide-react";

export function ContactSection() {
	const socialLinks = [
		{
			icon: Github,
			label: "GitHub",
			href: "https://github.com",
			color: "#333",
		},
		{
			icon: Linkedin,
			label: "LinkedIn",
			href: "https://linkedin.com",
			color: "#0077B5",
		},
	];

	return (
		<section className="relative py-32 bg-gradient-to-b from-[#FFFBF5] to-[#FBF8F3] overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute inset-0 opacity-5">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="contactPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
							<circle cx="50" cy="50" r="30" fill="#B48665" opacity="0.1" />
							<circle cx="20" cy="20" r="15" fill="#6A4334" opacity="0.1" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#contactPattern)" />
				</svg>
			</div>

			{/* Floating coffee particles */}
			{[...Array(15)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-6 h-8 rounded-full opacity-5"
					style={{
						background: "linear-gradient(135deg, #B48665 0%, #6A4334 100%)",
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
					}}
					animate={{
						y: [0, -30, 0],
						rotate: [0, 180, 360],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 10 + Math.random() * 10,
						repeat: Infinity,
						delay: i * 0.2,
					}}
				/>
			))}

			<div className="container mx-auto px-6 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16 space-y-6"
				>
					{/* Social Links Only Section */}
					<div className="flex flex-col items-center justify-center min-h-[40vh] py-16">
						<h2 className="font-serif text-5xl md:text-6xl text-[#65350E] mb-8">Connect With Me</h2>
						<div className="flex gap-6">
							{socialLinks.map((social, index) => {
								const Icon = social.icon;
								return (
									<a
										key={index}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg border-2 border-white/50 hover:border-white transition-all"
										style={{ backgroundColor: `${social.color}20` }}
									>
										<Icon className="w-10 h-10" style={{ color: social.color }} />
									</a>
								);
							})}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
