import { motion } from "framer-motion";
import { Sparkles, Star, Crown, Gem } from "lucide-react";

interface PlayerHeaderProps {
  name: string;
  avatarEmoji: string;
  level: number;
  xp: number;
  xpForLevel: number;
  xpProgress: number;
}

export const PlayerHeader = ({ name, avatarEmoji, level, xp, xpForLevel, xpProgress }: PlayerHeaderProps) => {
  const isHighLevel = level >= 10;
  
  return (
    <motion.div
      className="flex items-center gap-4 bg-card/80 backdrop-blur-md rounded-2xl p-4 border border-purple-500/30 mb-6 relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-3xl shadow-lg"
          animate={{
            boxShadow: [
              "0 0 20px rgba(168, 85, 247, 0.3)",
              "0 0 40px rgba(236, 72, 153, 0.4)",
              "0 0 20px rgba(168, 85, 247, 0.3)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {avatarEmoji}
        </motion.div>
        
        {/* Level badge */}
        <motion.div 
          className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1"
          whileHover={{ scale: 1.1 }}
        >
          {isHighLevel && <Crown className="w-3 h-3" />}
          Lv.{level}
        </motion.div>

        {/* Floating particles around avatar */}
        <motion.div
          className="absolute -top-1 -right-1 text-yellow-400"
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Star className="w-3 h-3 fill-current" />
        </motion.div>
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg text-foreground truncate">{name}</span>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gem className="w-4 h-4 text-purple-400" />
          </motion.div>
        </div>
        
        <div className="relative">
          <div className="h-4 bg-muted/50 rounded-full overflow-hidden border border-purple-500/20">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shine effect on XP bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
              </motion.div>
              {xp} / {xpForLevel} XP
            </span>
            {xpProgress > 0.8 && (
              <motion.span
                className="text-xs text-yellow-400 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Sắp lên cấp! ⬆️
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
