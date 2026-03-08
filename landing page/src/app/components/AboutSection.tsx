import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Lightbulb, Coffee, TrendingUp, Sparkles } from "lucide-react";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const timelineSteps = [
    {
      icon: Lightbulb,
      title: "The Vision",
      description: "Born from the frustration of complex billing systems, we imagined something better.",
      color: "#D4A574",
      year: "2023",
    },
    {
      icon: Coffee,
      title: "First Brew",
      description: "Partnered with local cafes to understand their real pain points and workflows.",
      color: "#B48665",
      year: "2024",
    },
    {
      icon: TrendingUp,
      title: "AI Integration",
      description: "Infused machine learning to predict trends, optimize inventory, and boost profits.",
      color: "#6A4334",
      year: "2025",
    },
    {
      icon: Sparkles,
      title: "Global Expansion",
      description: "Now serving thousands of cafes and bars worldwide with intelligent billing.",
      color: "#65350E",
      year: "2026",
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-[#FBF8F3] to-[#FFFBF5] overflow-hidden">
      {/* Hand-painted background texture */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
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

          <h2 className="font-serif text-5xl md:text-6xl text-[#65350E]">Our Journey</h2>
          <p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto leading-relaxed">
            From a simple sketch on a cafe napkin to an AI-powered platform serving thousands—
            here's how we brewed Brewly into existence.
          </p>
        </motion.div>

        {/* Timeline Path */}
        <div className="relative max-w-5xl mx-auto">
          {/* Winding Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 800">
            <motion.path
              d="M 100 100 Q 300 50, 450 150 T 900 200 Q 800 350, 650 450 T 200 600"
              fill="none"
              stroke="#B48665"
              strokeWidth="3"
              strokeDasharray="10 5"
              initial={{ pathLength: 0, opacity: 0 }}
              style={{ pathLength: pathProgress, opacity: 1 }}
              className="drop-shadow-lg"
            />
          </svg>

          {/* Timeline Steps */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-24 py-12">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -100 : 100, rotate: -5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
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
                      {/* Year Badge */}
                      <div className="absolute -top-4 -right-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="w-16 h-16 rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center border-4 border-white font-serif"
                          style={{
                            background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                            color: "#FBF8F3",
                          }}
                        >
                          <span className="text-xs font-bold">{step.year}</span>
                        </motion.div>
                      </div>

                      {/* Icon */}
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="w-14 h-14 rounded-xl shadow-lg flex items-center justify-center"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: step.color }} />
                      </motion.div>

                      {/* Text */}
                      <h3 className="text-2xl font-serif text-[#65350E]">{step.title}</h3>
                      <p className="text-[#6A4334]/70 leading-relaxed">{step.description}</p>

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
                        stroke={step.color}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: index * 0.3 }}
                      />
                    </svg>
                  </motion.div>

                  {/* Floating particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: step.color,
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

          {/* Barista's Hand Sketch (SVG illustration) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-24 relative"
          >
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-white to-[#FBF8F3] rounded-3xl shadow-2xl p-12 overflow-hidden">
              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')]" />

              <div className="relative text-center space-y-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-[#B48665] to-[#65350E] rounded-full flex items-center justify-center shadow-xl"
                >
                  <Sparkles className="w-12 h-12 text-[#FBF8F3]" />
                </motion.div>

                <h3 className="font-serif text-3xl text-[#65350E]">
                  Crafted with Care, Powered by AI
                </h3>
                <p className="text-lg text-[#6A4334]/70 leading-relaxed max-w-xl mx-auto">
                  Every feature in Brewly is designed with baristas and bar owners in mind—
                  combining the warmth of human touch with the precision of artificial intelligence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
