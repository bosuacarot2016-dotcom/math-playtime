import { motion } from "framer-motion";
import { Play, Brain, Zap, Trophy } from "lucide-react";
import { GradeSelector } from "./GradeSelector";

interface StartScreenProps {
  highScore: number;
  grade: number;
  onSelectGrade: (grade: number) => void;
  onStart: () => void;
}

export const StartScreen = ({ highScore, grade, onSelectGrade, onStart }: StartScreenProps) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary shadow-glow-primary mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Brain className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-gradient-primary">Math</span>{" "}
        <span className="text-foreground">Blitz</span>
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-sm mb-6 max-w-md mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Solve problems fast! Build streaks for bonus points.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <GradeSelector selectedGrade={grade} onSelectGrade={onSelectGrade} />
      </motion.div>

      <motion.div
        className="flex items-center justify-center gap-6 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-5 h-5" />
          <span className="text-sm">Quick fire</span>
        </div>
        <div className="flex items-center gap-2 text-accent">
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Best: {highScore}</span>
        </div>
      </motion.div>

      <motion.button
        onClick={onStart}
        className="inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground font-bold text-xl px-10 py-4 rounded-2xl shadow-glow-primary"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-6 h-6" />
        Start Grade {grade}
      </motion.button>
    </motion.div>
  );
};
