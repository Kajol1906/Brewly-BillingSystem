import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, FileText } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@brewly.io",
      href: "mailto:contact@brewly.io",
      color: "#B48665",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      color: "#6A4334",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com",
      color: "#65350E",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com",
      color: "#B48665",
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
          <h2 className="font-serif text-5xl md:text-6xl text-[#65350E]">Get in Touch</h2>
          <p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto leading-relaxed">
            Have questions about the project? Want to collaborate or provide feedback? 
            I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#B48665]/10">
              <h3 className="font-serif text-3xl text-[#65350E] mb-6">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-[#65350E] mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#B48665]/20 focus:border-[#B48665] outline-none transition-colors bg-[#FBF8F3]"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-[#65350E] mb-2 font-medium">Your Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#B48665]/20 focus:border-[#B48665] outline-none transition-colors bg-[#FBF8F3]"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-[#65350E] mb-2 font-medium">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#B48665]/20 focus:border-[#B48665] outline-none transition-colors bg-[#FBF8F3]"
                    placeholder="Project Inquiry"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-[#65350E] mb-2 font-medium">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#B48665]/20 focus:border-[#B48665] outline-none transition-colors resize-none bg-[#FBF8F3]"
                    placeholder="Tell me about your thoughts on this project..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={status !== "idle"}
                  whileHover={{ scale: status === "idle" ? 1.05 : 1 }}
                  whileTap={{ scale: status === "idle" ? 0.95 : 1 }}
                  className={`w-full px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                    status === "success"
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-[#65350E] to-[#6A4334] text-[#FBF8F3] hover:shadow-2xl"
                  }`}
                >
                  {status === "idle" && (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                  {status === "sending" && (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  )}
                  {status === "success" && "✓ Message Sent!"}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="block bg-white rounded-2xl p-6 shadow-xl border-2 border-[#B48665]/10 hover:border-[#B48665]/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${info.color}20` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: info.color }} />
                      </div>
                      <div>
                        <div className="text-sm text-[#6A4334]/60 mb-1">{info.label}</div>
                        <div className="text-lg font-semibold text-[#65350E]">{info.value}</div>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-[#B48665]/10 to-[#D4A574]/10 rounded-3xl p-8 border-2 border-[#B48665]/20">
              <h3 className="font-serif text-2xl text-[#65350E] mb-6">Connect With Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 aspect-square rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50 hover:border-white transition-all"
                      style={{ backgroundColor: `${social.color}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: social.color }} />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Project Info Card */}
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}