import { motion } from "framer-motion";
import { Zap, Heart, Shield } from "lucide-react";

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
            className="relative"
            animate={isCritical ? { 
              scale: [1, 1.3, 1],
              rotate: [0, -10, 10, 0]
            } : isLow ? {
              scale: [1, 1.15, 1]
            } : {}}
            transition={{ repeat: Infinity, duration: isCritical ? 0.4 : 0.8 }}
          >
            {isCritical ? (
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            ) : isLow ? (
              <Shield className="w-6 h-6 text-orange-400" />
            ) : (
              <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400" />
            )}
            {!isCritical && (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {isLow ? (
                  <Shield className="w-6 h-6 text-orange-400" />
                ) : (
                  <Zap className="w-6 h-6 text-cyan-400" />
                )}
              </motion.div>
            )}
          </motion.div>
          <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        </div>
        <motion.span 
          className={`font-mono font-bold text-lg ${isCritical ? "text-red-500" : isLow ? "text-orange-400" : "text-cyan-400"}`}
          animate={isCritical ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {Math.ceil(current)}/{max}
        </motion.span>
      </div>
      
      <div className="relative h-8 bg-muted/30 rounded-full overflow-hidden border-2 border-border/50 shadow-inner backdrop-blur-sm">
        {/* Background segments */}
        <div className="absolute inset-0 flex">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-border/20 last:border-r-0" />
          ))}
        </div>
        
        {/* Glow effect behind the bar */}
        <motion.div
          className={`absolute inset-y-0 left-0 blur-lg ${
            isCritical ? "bg-red-500/50" : isLow ? "bg-orange-400/50" : "bg-cyan-400/50"
          }`}
          style={{ width: `${percentage}%` }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        
        {/* Main bar */}
        <motion.div
          className={`absolute inset-y-1 left-1 rounded-full ${
            isCritical 
              ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400" 
              : isLow 
                ? "bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400"
                : "bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-300"
          }`}
          style={{ width: `calc(${percentage}% - 8px)` }}
          animate={{ width: `calc(${percentage}% - 8px)` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none rounded-full" />
        
        {/* Animated pulse when low */}
        {isLow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        )}

        {/* Sparkle effect when healthy */}
        {!isLow && (
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  );
};
