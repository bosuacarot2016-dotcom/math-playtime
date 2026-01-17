import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  streak: number;
  highScore: number;
  grade: number;
  mode: "timed" | "practice" | "boss";
}

export const ScoreDisplay = ({ score, streak, highScore, mode }: ScoreDisplayProps) => {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="flex items-center gap-1.5 bg-yellow-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-500/30"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Trophy className="w-4 h-4 text-yellow-400" />
        <span className="font-mono font-bold text-yellow-400 text-sm">{highScore}</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-1.5 rounded-lg border border-purple-500/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.span
          key={score}
          className="font-mono text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {score}
        </motion.span>
      </motion.div>

      <motion.div
        className={`flex items-center gap-1.5 backdrop-blur-sm px-3 py-1.5 rounded-lg border ${
          streak > 0 
            ? "bg-orange-500/20 border-orange-500/30" 
            : "bg-card/50 border-border/50"
        }`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Flame className={`w-4 h-4 ${streak > 0 ? "text-orange-400" : "text-muted-foreground"}`} />
        <motion.span
          key={streak}
          className={`font-mono font-bold text-sm ${streak > 0 ? "text-orange-400" : "text-muted-foreground"}`}
          initial={{ scale: streak > 0 ? 1.5 : 1 }}
          animate={{ scale: 1 }}
        >
          {streak}
        </motion.span>
      </motion.div>
    </div>
  );
};
