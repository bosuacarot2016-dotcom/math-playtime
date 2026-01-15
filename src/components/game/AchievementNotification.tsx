import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import type { Achievement } from "@/hooks/usePlayerData";

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementNotification = ({ achievements, onClose }: AchievementNotificationProps) => {
  useEffect(() => {
    if (achievements.length > 0) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievements, onClose]);

  return (
    <AnimatePresence>
      {achievements.length > 0 && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          {achievements.map((ach, index) => (
            <motion.div
              key={ach.id}
              className="flex items-center gap-3 bg-gradient-to-r from-yellow-500/90 via-orange-500/90 to-red-500/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl shadow-orange-500/50 border border-yellow-400/50"
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                {ach.icon}
              </motion.span>
              <div>
                <div className="text-white font-bold text-sm">🎉 Thành tựu mới!</div>
                <div className="text-white font-bold">{ach.name}</div>
                <div className="text-white/80 text-sm">{ach.description}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
