import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakFlameProps {
  streak: number;
}

export const StreakFlame = ({ streak }: StreakFlameProps) => {
  const intensity = Math.min(streak, 10);
  const showFlame = streak >= 3;

  return (
    <AnimatePresence>
      {showFlame && (
        <motion.div
          className="relative flex items-center gap-1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Flame 
              className="w-8 h-8" 
              style={{
                color: intensity >= 7 ? "#ef4444" : intensity >= 5 ? "#f97316" : "#fbbf24",
                filter: `drop-shadow(0 0 ${intensity * 2}px ${intensity >= 7 ? "#ef4444" : intensity >= 5 ? "#f97316" : "#fbbf24"})`,
              }}
            />
            {intensity >= 5 && (
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              >
                <Flame 
                  className="w-8 h-8 blur-sm" 
                  style={{ color: "#fff" }}
                />
              </motion.div>
            )}
          </motion.div>
          <motion.span
            className="font-bold text-lg"
            style={{
              color: intensity >= 7 ? "#ef4444" : intensity >= 5 ? "#f97316" : "#fbbf24",
              textShadow: `0 0 ${intensity * 2}px currentColor`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            x{streak}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
