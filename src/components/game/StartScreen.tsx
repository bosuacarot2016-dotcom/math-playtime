import { motion } from "framer-motion";
import { Brain, Zap, Trophy, BookOpen } from "lucide-react";
import { GradeSelector } from "./GradeSelector";

interface StartScreenProps {
  highScore: number;
  grade: number;
  onSelectGrade: (grade: number) => void;
  onStart: (mode: "timed" | "practice") => void;
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
        Giải nhanh! Combo liên tiếp để nhận điểm thưởng.
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
        <div className="flex items-center gap-2 text-accent">
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Điểm cao: {highScore}</span>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={() => onStart("timed")}
          className="inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground font-bold text-lg px-8 py-3 rounded-2xl shadow-glow-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5" />
          Thi đấu
        </motion.button>
        
        <motion.button
          onClick={() => onStart("practice")}
          className="inline-flex items-center gap-3 bg-secondary text-secondary-foreground font-bold text-lg px-8 py-3 rounded-2xl border border-border hover:bg-secondary/80"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen className="w-5 h-5" />
          Luyện tập
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
