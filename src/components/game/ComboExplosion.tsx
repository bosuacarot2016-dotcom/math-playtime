import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ComboExplosionProps {
  trigger: boolean;
  type: "correct" | "wrong" | "combo";
}

export const ComboExplosion = ({ trigger, type }: ComboExplosionProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number; color: string }>>([]);

  useEffect(() => {
    if (trigger) {
      const colors = type === "correct" 
        ? ["#22c55e", "#4ade80", "#86efac", "#10b981"]
        : type === "wrong"
        ? ["#ef4444", "#f87171", "#fca5a5"]
        : ["#fbbf24", "#f59e0b", "#fcd34d", "#ef4444", "#f97316"];
      
      const newParticles = Array.from({ length: type === "combo" ? 24 : 12 }, (_, i) => ({
        id: Date.now() + i,
        angle: (360 / (type === "combo" ? 24 : 12)) * i,
        distance: Math.random() * 80 + 60,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => setParticles([]), 800);
      return () => clearTimeout(timeout);
    }
  }, [trigger, type]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
          style={{
            backgroundColor: particle.color,
            boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
            y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
            scale: 0,
            opacity: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </AnimatePresence>
  );
};
