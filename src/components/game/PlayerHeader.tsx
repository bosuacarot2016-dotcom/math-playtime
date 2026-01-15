import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface PlayerHeaderProps {
  name: string;
  avatarEmoji: string;
  level: number;
  xp: number;
  xpForLevel: number;
  xpProgress: number;
}

export const PlayerHeader = ({ name, avatarEmoji, level, xp, xpForLevel, xpProgress }: PlayerHeaderProps) => {
  return (
    <motion.div
      className="flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
          {avatarEmoji}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
          Lv.{level}
        </div>
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-foreground truncate">{name}</span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
        
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {xp} / {xpForLevel} XP
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
