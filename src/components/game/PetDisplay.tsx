import { motion } from "framer-motion";
import type { Pet } from "@/hooks/useShopData";

interface PetDisplayProps {
  pet: Pet | null;
  position?: "left" | "right";
}

export const PetDisplay = ({ pet, position = "left" }: PetDisplayProps) => {
  if (!pet) return null;

  return (
    <motion.div
      className={`fixed bottom-20 ${position === "left" ? "left-4" : "right-4"} z-30`}
      initial={{ opacity: 0, y: 50, scale: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0 }}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Pet glow */}
        <motion.div
          className="absolute inset-0 blur-xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
        </motion.div>

        {/* Pet emoji */}
        <motion.div
          className="relative text-5xl drop-shadow-lg cursor-pointer"
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
          animate={{
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {pet.emoji}
        </motion.div>

        {/* Pet name tooltip */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/30 text-xs font-medium text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {pet.name}
        </motion.div>

        {/* Sparkle effects */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400 text-xs"
            style={{
              top: `${20 + i * 15}%`,
              left: `${70 + i * 10}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          >
            ✨
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
