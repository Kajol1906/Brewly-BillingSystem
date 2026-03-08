import { motion } from "motion/react";
import { useState } from "react";
import { Coffee, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

export function Interactive3DSection() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5,
    });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#FFFBF5] to-[#FBF8F3] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="coffeeGradient">
              <stop offset="0%" stopColor="#B48665" />
              <stop offset="100%" stopColor="#65350E" />
            </radialGradient>
          </defs>
          <circle cx="20%" cy="30%" r="200" fill="url(#coffeeGradient)" opacity="0.3" />
          <circle cx="80%" cy="70%" r="250" fill="url(#coffeeGradient)" opacity="0.2" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-6"
        >
          <h2 className="font-serif text-5xl md:text-6xl text-[#65350E]">
            Experience It in 3D
          </h2>
          <p className="text-xl text-[#6A4334]/70 max-w-2xl mx-auto leading-relaxed">
            Spin the cafe counter to explore how Brewly seamlessly integrates into your workflow.
            Click and drag to interact.
          </p>
        </motion.div>

        {/* 3D CSS Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#FBF8F3] to-white border-4 border-white/50"
          style={{ perspective: "1200px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Lighting hint overlay */}
          <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-2 border-[#B48665]/20">
            <p className="text-sm text-[#65350E] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D4A574] animate-pulse" />
              Drag to rotate • Interactive 3D
            </p>
          </div>

          {/* 3D Scene Container */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            <motion.div
              animate={{
                rotateY: isDragging ? rotation.y : rotation.y + 360,
                rotateX: Math.max(-30, Math.min(30, rotation.x)),
              }}
              transition={{
                rotateY: { duration: isDragging ? 0 : 20, ease: "linear", repeat: isDragging ? 0 : Infinity },
                rotateX: { duration: 0 },
              }}
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${rotation.y}deg) rotateX(${Math.max(-30, Math.min(30, rotation.x))}deg)`,
              }}
              className="relative w-96 h-96"
            >
              {/* Cafe Counter Base */}
              <div
                className="absolute top-1/2 left-1/2 w-80 h-48 bg-gradient-to-br from-[#6A4334] to-[#65350E] rounded-2xl shadow-2xl"
                style={{
                  transform: "translate(-50%, -50%) translateZ(0px)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Counter Top */}
                <div
                  className="absolute inset-x-0 -top-3 h-6 bg-gradient-to-br from-[#B48665] to-[#D4A574] rounded-t-2xl shadow-lg"
                  style={{
                    transform: "translateZ(10px)",
                  }}
                />

                {/* Coffee Machine */}
                <div
                  className="absolute left-12 top-1/2 -translate-y-1/2 w-24 h-32 bg-gradient-to-br from-[#65350E] via-[#6A4334] to-[#65350E] rounded-xl shadow-xl"
                  style={{
                    transform: "translateY(-50%) translateZ(30px)",
                  }}
                >
                  {/* Machine Screen */}
                  <div className="absolute top-8 left-4 right-4 h-16 bg-gradient-to-br from-[#D4A574] to-[#B48665] rounded-lg flex items-center justify-center">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-[#FBF8F3] text-xs font-mono"
                    >
                      READY
                    </motion.div>
                  </div>

                  {/* Buttons */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex-1 h-4 bg-[#B48665] rounded shadow-md" />
                    ))}
                  </div>
                </div>

                {/* Digital Tablet/POS */}
                <div
                  className="absolute right-12 top-1/2 -translate-y-1/2 w-20 h-28 bg-[#2C2C2C] rounded-xl shadow-xl"
                  style={{
                    transform: "translateY(-50%) translateZ(30px) rotateX(-10deg)",
                  }}
                >
                  {/* Screen */}
                  <div className="absolute inset-2 bg-gradient-to-br from-[#D4A574] to-[#B48665] rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-[#65350E]" />
                  </div>
                </div>

                {/* Coffee Cups */}
                {[-40, 40].map((offset, i) => (
                  <div
                    key={i}
                    className="absolute top-4 w-12 h-16 rounded-lg"
                    style={{
                      left: `calc(50% + ${offset}px)`,
                      transform: "translateX(-50%) translateZ(25px)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="w-full h-12 bg-gradient-to-b from-[#FBF8F3] to-white rounded-lg shadow-lg border-2 border-white" />
                    <div className="absolute top-2 left-1 right-1 h-8 bg-[#6A4334]/80 rounded-lg" />
                  </div>
                ))}
              </div>

              {/* Floating Feature Orbs */}
              {[
                { icon: Coffee, color: "#D4A574", angle: 0, distance: 200 },
                { icon: TrendingUp, color: "#B48665", angle: 90, distance: 220 },
                { icon: DollarSign, color: "#65350E", angle: 180, distance: 200 },
                { icon: BarChart3, color: "#6A4334", angle: 270, distance: 220 },
              ].map((orb, i) => {
                const Icon = orb.icon;
                const x = Math.cos((orb.angle * Math.PI) / 180) * orb.distance;
                const y = Math.sin((orb.angle * Math.PI) / 180) * orb.distance;

                return (
                  <motion.div
                    key={i}
                    animate={{
                      y: [y - 10, y + 10, y - 10],
                      rotateZ: [0, 360],
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, delay: i * 0.5 },
                      rotateZ: { duration: 10, repeat: Infinity, ease: "linear" },
                    }}
                    className="absolute top-1/2 left-1/2 w-20 h-20"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) translateZ(${50 + i * 10}px)`,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-2xl shadow-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                      style={{ backgroundColor: `${orb.color}20` }}
                    >
                      <Icon className="w-10 h-10" style={{ color: orb.color }} />
                    </div>
                  </motion.div>
                );
              })}

              {/* Receipts Floating Around */}
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * 360;
                const distance = 280;
                const x = Math.cos((angle * Math.PI) / 180) * distance;
                const y = Math.sin((angle * Math.PI) / 180) * distance;

                return (
                  <motion.div
                    key={i}
                    animate={{
                      rotateZ: [0, 360],
                      y: [y - 20, y + 20, y - 20],
                    }}
                    transition={{
                      rotateZ: { duration: 20, repeat: Infinity, ease: "linear", delay: i * 0.5 },
                      y: { duration: 4, repeat: Infinity, delay: i * 0.3 },
                    }}
                    className="absolute top-1/2 left-1/2 w-10 h-14"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) translateZ(${20}px)`,
                    }}
                  >
                    <div className="w-full h-full bg-white rounded shadow-lg border border-[#B48665]/20 p-1">
                      <div className="space-y-0.5">
                        <div className="h-0.5 bg-[#B48665]/30 rounded" />
                        <div className="h-0.5 bg-[#B48665]/30 rounded w-2/3" />
                        <div className="h-0.5 bg-[#B48665]/30 rounded" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Ambient Particles */}
              {[...Array(30)].map((_, i) => {
                const x = (Math.random() - 0.5) * 400;
                const y = (Math.random() - 0.5) * 400;
                const z = Math.random() * 100;

                return (
                  <motion.div
                    key={i}
                    animate={{
                      y: [y, y - 50, y],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: "#B48665",
                      transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) translateZ(${z}px)`,
                    }}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Ground Shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#6A4334]/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Feature Highlights Below 3D */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {[
            {
              title: "360° Integration",
              description: "Every angle of your business covered with seamless tools.",
              color: "#B48665",
            },
            {
              title: "Real-time Sync",
              description: "Changes reflect instantly across all your devices and stations.",
              color: "#6A4334",
            },
            {
              title: "Intuitive Design",
              description: "Beautiful interfaces that staff love to use every day.",
              color: "#D4A574",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#B48665]/10 text-center space-y-4"
            >
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.color }} />
              </div>
              <h3 className="text-xl font-serif text-[#65350E]">{item.title}</h3>
              <p className="text-[#6A4334]/70 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
