import { motion, AnimatePresence } from "framer-motion";
import { ComboExplosion } from "./ComboExplosion";
import { useState, useEffect } from "react";

interface ProblemProps {
  num1: number;
  num2: number;
  operator: string;
  feedback: "correct" | "wrong" | null;
}

export const Problem = ({ num1, num2, operator, feedback }: ProblemProps) => {
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    if (feedback) {
      setExplode(true);
      const timer = setTimeout(() => setExplode(false), 100);
      return () => clearTimeout(timer);
    }
  }, [feedback, num1, num2]);

  return (
    <div className="relative flex items-center justify-center mb-8">
      <ComboExplosion trigger={explode} type={feedback === "correct" ? "correct" : "wrong"} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={`${num1}-${operator}-${num2}`}
          className={`relative flex items-center gap-4 px-10 py-8 rounded-3xl border-2 ${
            feedback === "correct"
              ? "bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/10 border-green-500/50"
              : feedback === "wrong"
              ? "bg-gradient-to-br from-red-500/20 via-orange-500/15 to-yellow-500/10 border-red-500/50"
              : "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-purple-500/30 magic-border"
          }`}
          initial={{ opacity: 0, scale: 0.8, rotateX: -15, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotateX: 0, 
            y: 0,
            boxShadow: feedback === "correct" 
              ? "0 0 60px rgba(34, 197, 94, 0.3), 0 20px 40px rgba(0, 0, 0, 0.2)"
              : feedback === "wrong"
              ? "0 0 60px rgba(239, 68, 68, 0.3), 0 20px 40px rgba(0, 0, 0, 0.2)"
              : "0 0 40px rgba(168, 85, 247, 0.2), 0 20px 40px rgba(0, 0, 0, 0.2)"
          }}
          exit={{ opacity: 0, scale: 0.8, rotateX: 15, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 rounded-3xl animate-shimmer pointer-events-none" />
          
          <motion.span 
            className="font-mono text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg"
            animate={feedback === "correct" ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {num1}
          </motion.span>
          <motion.span 
            className="font-mono text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
            animate={{ rotate: feedback ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            {operator}
          </motion.span>
          <motion.span 
            className="font-mono text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg"
            animate={feedback === "correct" ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {num2}
          </motion.span>
          <span className="font-mono text-4xl md:text-6xl font-bold text-muted-foreground">
            =
          </span>
          <motion.span 
            className="font-mono text-5xl md:text-7xl font-bold"
            animate={{ 
              scale: [1, 1.15, 1],
              color: ["#22d3ee", "#a855f7", "#f472b6", "#22d3ee"]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ textShadow: "0 0 20px currentColor" }}
          >
            ?
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
