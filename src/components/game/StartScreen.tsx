import { motion } from "framer-motion";
import { Brain, Trophy, BookOpen, Swords, Sparkles, Crown, Star } from "lucide-react";
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
      className="text-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Floating decorations */}
      <motion.div
        className="absolute -top-10 -left-10 text-4xl opacity-30"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute -top-5 -right-5 text-3xl opacity-30"
        animate={{ y: [0, -10, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-20 -right-8 text-2xl opacity-20"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🔮
      </motion.div>

      {/* Main logo */}
      <motion.div
        className="relative inline-block mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.div
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-2xl animate-pulse-glow"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Brain className="w-12 h-12 text-white drop-shadow-lg" />
        </motion.div>
        <motion.div
          className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1.5 shadow-lg"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Crown className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        className="mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
            Math
          </span>{" "}
          <span className="text-foreground">Quest</span>
        </h1>
        <motion.div
          className="flex items-center justify-center gap-1 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        className="text-muted-foreground text-base mb-8 max-w-md mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Chinh phục thử thách, thu thập thành tựu và trở thành bậc thầy toán học! 🏆
      </motion.p>

      {/* Grade selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <GradeSelector selectedGrade={grade} onSelectGrade={onSelectGrade} />
      </motion.div>

      {/* Stats badges */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-4 py-2 rounded-xl border border-yellow-500/30 backdrop-blur-sm"
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <Trophy className="w-5 h-5" />
          <span className="font-bold">{highScore}</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/30 backdrop-blur-sm"
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">Lv.{playerLevel}</span>
        </motion.div>
      </motion.div>

      {/* Start buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={() => onStart("timed")}
          className="relative w-full sm:w-auto group overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-4">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Swords className="w-6 h-6" />
            </motion.div>
            <span>Chiến đấu!</span>
          </div>
          <div className="absolute inset-0 animate-shimmer rounded-2xl" />
        </motion.button>
        
        <motion.button
          onClick={() => onStart("practice")}
          className="relative w-full sm:w-auto group overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-4">
            <BookOpen className="w-6 h-6" />
            <span>Luyện công</span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
