import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  Smartphone,
  LineChart,
  Brain,
  Zap,
  ShieldCheck,
  Users,
  Receipt,
  BarChart3,
  Coffee,
} from "lucide-react";

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const features = [
    {
      icon: Smartphone,
      title: "Smart POS System",
      description: "Lightning-fast checkout with intuitive interface designed for busy coffee rushes. Supports multiple payment methods and offline mode.",
      color: "#D4A574",
      year: "Core",
    },
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Machine learning algorithms predict customer behavior, optimize menu pricing, and provide actionable insights for business growth.",
      color: "#B48665",
      year: "AI",
    },
    {
      icon: LineChart,
      title: "Real-time Dashboards",
      description: "Live sales tracking, inventory monitoring, and performance metrics. Make data-driven decisions with up-to-the-second information.",
      color: "#6A4334",
      year: "Insights",
    },
    {
      icon: Zap,
      title: "Multi-Device Sync",
      description: "Seamless synchronization across tablets, phones, and desktops. Your data is always current, no matter which device you're using.",
      color: "#65350E",
      year: "Cloud",
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      description: "End-to-end encryption, PCI DSS compliance, and secure payment processing. Your business and customer data is fully protected.",
      color: "#D4A574",
      year: "Secure",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Staff scheduling, performance tracking, role-based permissions, and shift management. Streamline your workforce operations.",
      color: "#B48665",
      year: "Teams",
    },
    {
      icon: Receipt,
      title: "Smart Receipts",
      description: "Digital receipts with loyalty program integration, email/SMS delivery, and eco-friendly paperless options. Boost customer retention.",
      color: "#6A4334",
      year: "Digital",
    },
    {
      icon: BarChart3,
      title: "Inventory Management",
      description: "Automated stock tracking with predictive reorder alerts. Never run out of popular items or over-order slow-moving inventory.",
      color: "#65350E",
      year: "Stock",
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-[#FBF8F3] to-[#FFFBF5] overflow-hidden">
      {/* Hand-painted background texture */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFeatures">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFeatures)" />
        </svg>
      </div>

      {/* Coffee stain decoration */}
      <motion.div
        style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, 360]) }}
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#B48665]/10 blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#B48665] to-[#65350E] flex items-center justify-center shadow-xl">
              <Coffee className="w-10 h-10 text-[#FBF8F3]" />
            </div>
          </motion.div>

          <h2 className="font-serif text-5xl md:text-6xl text-[#65350E]">Powerful Features</h2>
          <p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to run your cafe or bar efficiently, all in one comprehensive platform
          </p>
        </motion.div>

        {/* Features Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Winding Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 1000 1600">
            <motion.path
              d="M 100 100 Q 300 50, 450 150 T 900 200 Q 800 350, 650 450 T 200 600 Q 300 750, 500 800 T 900 950 Q 750 1100, 500 1200"
              fill="none"
              stroke="#B48665"
              strokeWidth="3"
              strokeDasharray="10 5"
              initial={{ pathLength: 0, opacity: 0 }}
              style={{ pathLength: pathProgress, opacity: 1 }}
              className="drop-shadow-lg"
            />
          </svg>

          {/* Feature Cards */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-24 py-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -100 : 100, rotate: -5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative ${isEven ? "md:justify-self-end" : "md:justify-self-start"}`}
                >
                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative group cursor-pointer"
                  >
                    {/* Paper texture background */}
                    <div className="absolute inset-0 bg-white rounded-2xl shadow-xl transform rotate-1 group-hover:rotate-2 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-[#FBF8F3] rounded-2xl shadow-2xl" />

                    {/* Content */}
                    <div className="relative p-8 space-y-4">
                      {/* Category Badge */}
                      <div className="absolute -top-4 -right-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="w-16 h-16 rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center border-4 border-white font-serif text-xs font-bold"
                          style={{
                            background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                            color: "#FBF8F3",
                          }}
                        >
                          {feature.year}
                        </motion.div>
                      </div>

                      {/* Icon */}
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="w-14 h-14 rounded-xl shadow-lg flex items-center justify-center"
                        style={{ backgroundColor: `${feature.color}20` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: feature.color }} />
                      </motion.div>

                      {/* Text */}
                      <h3 className="text-2xl font-serif text-[#65350E]">{feature.title}</h3>
                      <p className="text-[#6A4334]/70 leading-relaxed">{feature.description}</p>

                      {/* Decorative coffee bean */}
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                        className="absolute -bottom-3 -left-3 w-6 h-8 rounded-full bg-gradient-to-br from-[#6A4334] to-[#65350E] shadow-lg"
                        style={{
                          clipPath: "ellipse(40% 50% at 50% 50%)",
                        }}
                      />
                    </div>

                    {/* Sketch lines decoration */}
                    <svg
                      className="absolute -bottom-2 -right-2 w-24 h-24 opacity-20 pointer-events-none"
                      viewBox="0 0 100 100"
                    >
                      <motion.path
                        d="M 10 50 Q 30 30, 50 50 T 90 50"
                        fill="none"
                        stroke={feature.color}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </svg>
                  </motion.div>

                  {/* Floating particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: feature.color,
                        top: `${20 + i * 20}%`,
                        left: isEven ? "-5%" : "105%",
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3 + index * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
