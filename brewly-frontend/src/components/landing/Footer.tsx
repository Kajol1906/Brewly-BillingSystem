import { motion } from "motion/react";
import { Coffee, Mail, MapPin, Phone, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
	const footerLinks = {
		Product: ["Features", "Pricing", "Security", "Roadmap", "Integrations"],
		Company: ["About Us", "Careers", "Blog", "Press Kit", "Partners"],
		Resources: ["Documentation", "API Reference", "Support Center", "Community", "Status"],
		Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
	};

	const socialLinks = [
		{ icon: Twitter, href: "#", label: "Twitter", color: "#1DA1F2" },
		{ icon: Instagram, href: "#", label: "Instagram", color: "#E4405F" },
		{ icon: Linkedin, href: "#", label: "LinkedIn", color: "#0A66C2" },
		{ icon: Github, href: "#", label: "GitHub", color: "#333" },
	];

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
				<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">
					{/* Logo and Contact */}
					<div className="space-y-6 md:w-1/3">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B48665] to-[#65350E] flex items-center justify-center shadow-xl">
								<Coffee className="w-7 h-7 text-[#FBF8F3]" />
							</div>
							<span className="font-serif text-2xl text-[#FBF8F3]">Brewly</span>
						</div>
						<p className="text-[#FBF8F3]/80 max-w-xs">
							The all-in-one POS and analytics platform for modern cafes, bars, and restaurants.
						</p>
						<div className="flex flex-col gap-2 text-[#FBF8F3]/70 text-sm">
							<div className="flex items-center gap-2">
								<Mail className="w-4 h-4" /> support@brewly.com
							</div>
							<div className="flex items-center gap-2">
								<Phone className="w-4 h-4" /> +1 (555) 123-4567
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4" /> 123 Coffee Lane, Bar City
							</div>
						</div>
					</div>

					{/* Footer Links */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:w-2/3">
						{Object.entries(footerLinks).map(([category, links]) => (
							<div key={category}>
								<h4 className="font-serif text-lg mb-3 text-[#D4A574]">{category}</h4>
								<ul className="space-y-2">
									{links.map((link) => (
										<li key={link}>
											<a href="#" className="hover:underline text-[#FBF8F3]/80">
												{link}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				{/* Divider */}
				<div className="my-10 border-t border-[#B48665]/30" />

				{/* Social and Copyright */}
				<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
					<div className="flex gap-4">
						{socialLinks.map(({ icon: Icon, href, label, color }) => (
							<a
								key={label}
								href={href}
								aria-label={label}
								className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FBF8F3]/10 hover:bg-[#FBF8F3]/20 transition-colors"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon className="w-5 h-5" style={{ color }} />
							</a>
						))}
					</div>
					<div className="text-[#FBF8F3]/60 text-sm">
						&copy; {new Date().getFullYear()} Brewly. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
