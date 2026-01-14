import { motion } from "framer-motion";
import { Play, Brain, Zap, Trophy } from "lucide-react";

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export const StartScreen = ({ highScore, onStart }: StartScreenProps) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-primary shadow-glow-primary mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Brain className="w-12 h-12 text-primary-foreground" />
      </motion.div>

      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-gradient-primary">Math</span>{" "}
        <span className="text-foreground">Blitz</span>
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Solve math problems as fast as you can! Build streaks for bonus points.
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-5 h-5" />
          <span className="text-sm">Quick fire</span>
        </div>
        <div className="flex items-center gap-2 text-accent">
          <Trophy className="w-5 h-5" />
          <span className="text-sm">High Score: {highScore}</span>
        </div>
      </motion.div>

      <motion.button
        onClick={onStart}
        className="inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground font-bold text-xl px-10 py-5 rounded-2xl shadow-glow-primary"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-7 h-7" />
        Start Game
      </motion.button>

      <motion.div
        className="mt-12 grid grid-cols-3 gap-4 max-w-sm mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {["+", "−", "×"].map((op, i) => (
          <motion.div
            key={op}
            className="bg-card/50 border border-border/50 rounded-xl py-3"
            animate={{ y: [0, -5, 0] }}
            transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
          >
            <span className="font-mono text-2xl text-primary">{op}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
