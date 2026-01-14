import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  streak: number;
  highScore: number;
}

export const ScoreDisplay = ({ score, streak, highScore }: ScoreDisplayProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
      <motion.div
        className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Trophy className="w-5 h-5 text-accent" />
        <span className="text-muted-foreground text-sm">Best</span>
        <span className="font-mono font-bold text-accent">{highScore}</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-muted-foreground text-xs uppercase tracking-wider">Score</span>
        <motion.span
          key={score}
          className="font-mono text-4xl font-bold text-gradient-primary"
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {score}
        </motion.span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Flame className={`w-5 h-5 ${streak > 0 ? "text-error" : "text-muted-foreground"}`} />
        <span className="text-muted-foreground text-sm">Streak</span>
        <motion.span
          key={streak}
          className={`font-mono font-bold ${streak > 0 ? "text-error" : "text-muted-foreground"}`}
          initial={{ scale: streak > 0 ? 1.5 : 1 }}
          animate={{ scale: 1 }}
        >
          {streak}
        </motion.span>
      </motion.div>
    </div>
  );
};
