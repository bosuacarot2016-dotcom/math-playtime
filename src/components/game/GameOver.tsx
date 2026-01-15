import { motion } from "framer-motion";
import { RotateCcw, Trophy, Target, Flame, GraduationCap } from "lucide-react";

interface GameOverProps {
  score: number;
  highScore: number;
  questionsAnswered: number;
  maxStreak: number;
  grade: number;
  mode: "timed" | "practice";
  onRestart: (mode: "timed" | "practice") => void;
}

export const GameOver = ({
  score,
  highScore,
  questionsAnswered,
  maxStreak,
  grade,
  mode,
  onRestart,
}: GameOverProps) => {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isNewHighScore ? (
          <>
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-accent shadow-glow-accent mb-4"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Trophy className="w-10 h-10 text-accent-foreground" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gradient-accent mb-2">
              New High Score!
            </h2>
          </>
        ) : (
          <>
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-card border border-border mb-4"
            >
              <Target className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Game Over
            </h2>
          </>
        )}
      </motion.div>

      <motion.div
        className="space-y-4 my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-card/80 rounded-2xl p-6 border border-border/50">
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
            Final Score
          </p>
          <p className="font-mono text-5xl font-bold text-gradient-primary">
            {score}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card/50 rounded-xl p-3 border border-border/50">
            <GraduationCap className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider">
              Grade
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {grade}
            </p>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-border/50">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider">
              Answered
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {questionsAnswered}
            </p>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-border/50">
            <Flame className="w-5 h-5 text-error mx-auto mb-1" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider">
              Streak
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {maxStreak}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => onRestart(mode)}
        className="inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground font-bold text-xl px-8 py-4 rounded-2xl shadow-glow-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <RotateCcw className="w-6 h-6" />
        {mode === "practice" ? "Tiếp tục luyện" : "Chơi lại"}
      </motion.button>
    </motion.div>
  );
};
