import { motion } from "framer-motion";
import { Zap, Heart } from "lucide-react";

interface EnergyBarProps {
  current: number;
  max: number;
  label?: string;
}

export const EnergyBar = ({ current, max, label = "Năng lượng" }: EnergyBarProps) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = percentage < 30;
  const isCritical = percentage < 15;

  return (
    <motion.div
      className="w-full max-w-md mx-auto mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isCritical ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            {isLow ? (
              <Heart className={`w-5 h-5 ${isCritical ? "text-red-500" : "text-orange-400"}`} />
            ) : (
              <Zap className="w-5 h-5 text-cyan-400" />
            )}
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <span className={`font-mono font-bold text-sm ${isCritical ? "text-red-500" : isLow ? "text-orange-400" : "text-cyan-400"}`}>
          {Math.ceil(current)}/{max}
        </span>
      </div>
      
      <div className="relative h-6 bg-muted/50 rounded-full overflow-hidden border-2 border-border/50 shadow-inner">
        {/* Glow effect behind the bar */}
        <motion.div
          className={`absolute inset-0 blur-md ${isCritical ? "bg-red-500/30" : isLow ? "bg-orange-400/30" : "bg-cyan-400/30"}`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Main bar */}
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            isCritical 
              ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400" 
              : isLow 
                ? "bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400"
                : "bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-300"
          }`}
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        
        {/* Animated pulse when low */}
        {isLow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        )}
      </div>
    </motion.div>
  );
};
