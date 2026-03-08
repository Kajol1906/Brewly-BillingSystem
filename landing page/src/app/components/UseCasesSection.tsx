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
      title: "Increased Revenue",
      value: "35%",
      description: "Average sales increase within 3 months",
      color: "#B48665",
    },
    {
      icon: Users,
      title: "Customer Retention",
      value: "92%",
      description: "Customer return rate with loyalty programs",
      color: "#6A4334",
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#FBF8F3] to-[#FFFBF5] overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="useCaseGradient">
              <stop offset="0%" stopColor="#B48665" />
              <stop offset="100%" stopColor="#65350E" />
            </radialGradient>
          </defs>
          <circle cx="10%" cy="20%" r="150" fill="url(#useCaseGradient)" opacity="0.3" />
          <circle cx="90%" cy="80%" r="200" fill="url(#useCaseGradient)" opacity="0.2" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#B48665] to-[#65350E] flex items-center justify-center shadow-xl">
              <Store className="w-10 h-10 text-[#FBF8F3]" />
            </div>
          </motion.div>

          <h2 className="font-serif text-5xl md:text-6xl text-[#65350E]">Perfect For Every Business</h2>
          <p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto leading-relaxed">
            Flexible solutions tailored to different types of food and beverage establishments
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#B48665]/10 hover:border-[#B48665]/30 transition-all h-full">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${useCase.color}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: useCase.color }} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif text-[#65350E] mb-2">{useCase.title}</h3>
                      <p className="text-[#6A4334]/70">{useCase.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {useCase.features.map((feature, fIndex) => (
                      <motion.div
                        key={fIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + fIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: useCase.color }}
                        />
                        <span className="text-[#6A4334]/80">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats Badge */}
                  

                  {/* Decorative coffee bean */}
                  
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          
        </motion.div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          
        </motion.div>
      </div>
    </section>
  );
}
