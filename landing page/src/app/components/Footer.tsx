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
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 border-b border-[#B48665]/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B48665] to-[#D4A574] flex items-center justify-center shadow-lg">
                  <Coffee className="w-7 h-7 text-[#FBF8F3]" />
                </div>
                <span className="font-serif text-3xl text-[#FBF8F3]">Brewly</span>
              </motion.div>

              <p className="text-[#FBF8F3]/70 leading-relaxed max-w-md">
                The next-generation billing and analytics platform crafted for cafes and bars.
                Powered by AI, perfected by passion.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="mailto:hello@brewly.io"
                  className="flex items-center gap-3 text-[#FBF8F3]/70 hover:text-[#D4A574] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#B48665]/20 flex items-center justify-center group-hover:bg-[#D4A574]/30 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>hello@brewly.io</span>
                </a>

                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-[#FBF8F3]/70 hover:text-[#D4A574] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#B48665]/20 flex items-center justify-center group-hover:bg-[#D4A574]/30 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </a>

                
              </div>

              {/* Social Links */}
              <div className="flex gap-3 pt-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-xl bg-[#B48665]/20 hover:bg-[#D4A574]/30 flex items-center justify-center transition-colors border border-[#B48665]/30"
                    >
                      <Icon className="w-5 h-5 text-[#FBF8F3]" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Links Grid */}
            
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#FBF8F3]/60 text-sm">
              © 2026 Brewly. All rights reserved. Brewed with{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block text-[#D4A574]"
              >
                ❤️
              </motion.span>{" "}
              for cafes.
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[#FBF8F3]/60 hover:text-[#D4A574] transition-colors text-sm"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-[#FBF8F3]/60 hover:text-[#D4A574] transition-colors text-sm"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-[#FBF8F3]/60 hover:text-[#D4A574] transition-colors text-sm"
              >
                Cookies
              </a>
            </div>
          </div>

          {/* Decorative coffee stain */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-[#B48665]/10 blur-2xl"
          />
        </motion.div>
      </div>
    </footer>
  );
}
