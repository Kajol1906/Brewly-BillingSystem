import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Star, TrendingUp, Users, DollarSign } from "lucide-react";

const testimonials = [
  {
    name: "Sofia Martinez",
    role: "Owner, Espresso Lane Cafe",
    content: "Brewly transformed our billing process. Sales tracking is now effortless, and the AI insights helped us increase revenue by 35% in just 3 months!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    color: "#B48665",
  },
  {
    name: "Marcus Chen",
    role: "Manager, The Daily Grind",
    content: "The inventory management feature alone saved us thousands. No more running out of popular items or over-ordering. It's like having a business consultant in your pocket.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    color: "#6A4334",
  },
  {
    name: "Emma Thompson",
    role: "Co-founder, Bean & Brew Bar",
    content: "Our staff learned Brewly in under an hour. The interface is so intuitive, it feels like it was designed by baristas, for baristas. Customer checkout is now 3x faster!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    color: "#D4A574",
  },
];

const stats = [
  { icon: TrendingUp, value: 42, suffix: "%", label: "Average Sales Increase", color: "#B48665" },
  { icon: Users, value: 5000, suffix: "+", label: "Happy Cafe Owners", color: "#6A4334" },
  { icon: DollarSign, value: 2.4, suffix: "M", label: "Transactions Processed", color: "#D4A574" },
  { icon: Star, value: 4.9, suffix: "/5", label: "Average Rating", color: "#65350E" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="font-serif text-5xl md:text-6xl text-[#65350E]">
      {count}
      {suffix}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative py-32 bg-gradient-to-br from-[#FBF8F3] via-[#FFFBF5] to-[#FBF8F3] overflow-hidden">
      {/* Steam Rising Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-32 h-96 bg-gradient-to-t from-[#B48665]/10 via-[#D4A574]/5 to-transparent rounded-full blur-3xl"
            style={{
              left: `${(i / 8) * 100}%`,
            }}
            animate={{
              y: [0, -400],
              opacity: [0.5, 0.8, 0],
              scale: [1, 1.5, 2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Stats Section - Coffee Cups Filling Up */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl md:text-6xl text-[#65350E]">
              Brewing Success
            </h2>
            <p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto">
              Real numbers from real cafes powered by Brewly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                  style={{ perspective: "1000px" }}
                >
                  {/* Coffee Cup Container */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-white/50 overflow-hidden">
                    {/* Cup Shape Background */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                      className="absolute inset-0 origin-bottom rounded-3xl opacity-10"
                      style={{
                        background: `linear-gradient(to top, ${stat.color}, transparent)`,
                      }}
                    />

                    {/* Content */}
                    <div className="relative space-y-6 text-center">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-xl"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: stat.color }} />
                      </motion.div>

                      {/* Animated Number */}
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />

                      {/* Label */}
                      <p className="text-[#6A4334]/70 font-medium">{stat.label}</p>
                    </div>

                    {/* Steam particles on hover */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute bottom-0 left-1/2 w-2 h-8 rounded-full opacity-0 group-hover:opacity-50 blur-sm"
                        style={{ backgroundColor: stat.color }}
                        animate={{
                          y: [0, -60],
                          x: [-1 + Math.sin(i) * 10, -1 + Math.sin(i + 1) * 15],
                          opacity: [0.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Testimonials - Speech Bubbles Rising Like Steam */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl text-[#65350E]">
              Loved by Baristas
            </h2>
            <p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto">
              Hear what cafe owners have to say about their Brewly experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.4,
                }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative group"
              >
                {/* Speech Bubble Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-white/50">
                  {/* Decorative coffee stain */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                    className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-20 blur-sm"
                    style={{ backgroundColor: testimonial.color }}
                  />

                  <div className="space-y-6">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.2 + i * 0.1,
                            type: "spring",
                          }}
                        >
                          <Star
                            className="w-5 h-5 fill-current"
                            style={{ color: testimonial.color }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-[#6A4334] leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t-2 border-[#B48665]/10">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative"
                      >
                        <div
                          className="w-14 h-14 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
                          style={{ backgroundImage: `url(${testimonial.avatar})` }}
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs"
                          style={{ backgroundColor: testimonial.color, color: "#FBF8F3" }}
                        >
                          ✓
                        </div>
                      </motion.div>

                      <div>
                        <div className="font-serif text-lg text-[#65350E]">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-[#6A4334]/60">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Speech Bubble Pointer */}
                  <div
                    className="absolute -bottom-4 left-12 w-8 h-8 bg-white transform rotate-45 border-r-2 border-b-2 border-white/50"
                    style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                  />
                </div>

                {/* Floating coffee bean decoration */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: index * 0.7,
                  }}
                  className="absolute -top-6 right-8 w-8 h-10 rounded-full bg-gradient-to-br from-[#6A4334] to-[#65350E] shadow-xl opacity-70"
                  style={{
                    clipPath: "ellipse(40% 50% at 50% 50%)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
