import { motion } from "framer-motion";
import { RotateCcw, Trophy, Target, Flame, GraduationCap, Sparkles, Star, Home } from "lucide-react";

interface GameOverProps {
  score: number;
  highScore: number;
  questionsAnswered: number;
  maxStreak: number;
  grade: number;
  mode: "timed" | "practice";
  onRestart: (mode: "timed" | "practice") => void;
  onExit: () => void;
  xpEarned: number;
  playerLevel: number;
}

export const GameOver = ({
  score,
  highScore,
  questionsAnswered,
  maxStreak,
  grade,
  mode,
  onRestart,
  onExit,
  xpEarned,
  playerLevel,
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 shadow-lg shadow-orange-500/50 mb-4"
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Kỷ lục mới! 🎉
            </h2>
          </>
        ) : (
          <>
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 mb-4"
            >
              <Star className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Hoàn thành!
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
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
            Điểm số
          </p>
          <p className="font-mono text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            {score}
          </p>
        </div>

        {/* XP Earned */}
        <motion.div
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span className="text-xl font-bold text-cyan-400">+{xpEarned} XP</span>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card/50 rounded-xl p-3 border border-purple-500/30">
            <GraduationCap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider">
              Lớp
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {grade}
            </p>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-cyan-500/30">
            <Target className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider">
              Trả lời
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {questionsAnswered}
            </p>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-orange-500/30">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider">
              Combo
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {maxStreak}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <motion.button
          onClick={() => onRestart(mode)}
          className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold text-lg px-6 py-3 rounded-2xl shadow-lg shadow-purple-500/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <RotateCcw className="w-5 h-5" />
          {mode === "practice" ? "Tiếp tục luyện" : "Chiến tiếp!"}
        </motion.button>

        <motion.button
          onClick={onExit}
          className="inline-flex items-center justify-center gap-3 bg-muted hover:bg-muted/80 text-muted-foreground font-bold text-lg px-6 py-3 rounded-2xl border border-border/50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Home className="w-5 h-5" />
          Thoát
        </motion.button>
      </div>
    </motion.div>
  );
};
