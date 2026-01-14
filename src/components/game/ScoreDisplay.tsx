import { motion } from "framer-motion";
import { Flame, Trophy, GraduationCap } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  streak: number;
  highScore: number;
  grade: number;
}

export const ScoreDisplay = ({ score, streak, highScore, grade }: ScoreDisplayProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-6">
      <motion.div
        className="flex items-center gap-1.5 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <GraduationCap className="w-4 h-4 text-primary" />
        <span className="font-mono font-bold text-primary text-sm">G{grade}</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-muted-foreground text-xs uppercase tracking-wider">Score</span>
        <motion.span
          key={score}
          className="font-mono text-3xl font-bold text-gradient-primary"
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {score}
        </motion.span>
      </motion.div>

      <div className="flex gap-2">
        <motion.div
          className="flex items-center gap-1.5 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Trophy className="w-4 h-4 text-accent" />
          <span className="font-mono font-bold text-accent text-sm">{highScore}</span>
        </motion.div>

        <motion.div
          className="flex items-center gap-1.5 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Flame className={`w-4 h-4 ${streak > 0 ? "text-error" : "text-muted-foreground"}`} />
          <motion.span
            key={streak}
            className={`font-mono font-bold text-sm ${streak > 0 ? "text-error" : "text-muted-foreground"}`}
            initial={{ scale: streak > 0 ? 1.5 : 1 }}
            animate={{ scale: 1 }}
          >
            {streak}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};
