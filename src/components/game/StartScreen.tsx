import { motion } from "framer-motion";
import { Brain, Zap, Trophy, BookOpen, Swords, Sparkles } from "lucide-react";
import { GradeSelector } from "./GradeSelector";

interface StartScreenProps {
  highScore: number;
  grade: number;
  onSelectGrade: (grade: number) => void;
  onStart: (mode: "timed" | "practice") => void;
  playerLevel: number;
}

export const StartScreen = ({ highScore, grade, onSelectGrade, onStart, playerLevel }: StartScreenProps) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-lg shadow-purple-500/30 mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Brain className="w-10 h-10 text-white" />
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Math</span>{" "}
        <span className="text-foreground">Quest</span>
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-sm mb-6 max-w-md mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Chinh phục thử thách, thu thập thành tựu! 🏆
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
        className="flex items-center justify-center gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/30">
          <Trophy className="w-4 h-4" />
          <span className="text-sm font-bold">{highScore}</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/30">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">Lv.{playerLevel}</span>
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
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold text-lg px-8 py-3 rounded-2xl shadow-lg shadow-orange-500/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Swords className="w-5 h-5" />
          Chiến đấu!
        </motion.button>
        
        <motion.button
          onClick={() => onStart("practice")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg px-8 py-3 rounded-2xl shadow-lg shadow-cyan-500/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen className="w-5 h-5" />
          Luyện công
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
