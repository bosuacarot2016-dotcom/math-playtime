import { motion } from "framer-motion";

interface ActivePowerupsProps {
  activePowerups: string[];
}

const POWERUP_INFO: Record<string, { icon: string; label: string; color: string }> = {
  time_boost: { icon: "⏰", label: "+3s", color: "from-cyan-500 to-blue-500" },
  score_x2: { icon: "💰", label: "x2", color: "from-yellow-500 to-orange-500" },
  combo_shield: { icon: "🛡️", label: "Khiên", color: "from-purple-500 to-pink-500" },
  xp_boost: { icon: "✨", label: "XP+", color: "from-green-500 to-emerald-500" },
};

export const ActivePowerups = ({ activePowerups }: ActivePowerupsProps) => {
  if (activePowerups.length === 0) return null;

  // Remove duplicates for display
  const uniquePowerups = [...new Set(activePowerups)];

  return (
    <motion.div
      className="flex items-center gap-2 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {uniquePowerups.map((powerupId, index) => {
        const info = POWERUP_INFO[powerupId];
        if (!info) return null;

        return (
          <motion.div
            key={`${powerupId}-${index}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${info.color} text-white text-sm font-medium shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              boxShadow: [
                "0 0 10px rgba(255,255,255,0.3)",
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 10px rgba(255,255,255,0.3)",
              ]
            }}
            transition={{ 
              scale: { type: "spring", stiffness: 300 },
              boxShadow: { duration: 1.5, repeat: Infinity }
            }}
          >
            <span>{info.icon}</span>
            <span>{info.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
