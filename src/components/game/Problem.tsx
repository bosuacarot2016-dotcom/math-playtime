import { motion, AnimatePresence } from "framer-motion";

interface ProblemProps {
  num1: number;
  num2: number;
  operator: string;
  feedback: "correct" | "wrong" | null;
}

export const Problem = ({ num1, num2, operator, feedback }: ProblemProps) => {
  return (
    <div className="relative flex items-center justify-center mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${num1}-${operator}-${num2}`}
          className={`flex items-center gap-4 px-8 py-6 rounded-2xl border-2 ${
            feedback === "correct"
              ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg shadow-green-500/20"
              : feedback === "wrong"
              ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50 shadow-lg shadow-red-500/20"
              : "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30"
          }`}
          initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <span className="font-mono text-5xl md:text-7xl font-bold text-foreground">
            {num1}
          </span>
          <span className="font-mono text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {operator}
          </span>
          <span className="font-mono text-5xl md:text-7xl font-bold text-foreground">
            {num2}
          </span>
          <span className="font-mono text-4xl md:text-6xl font-bold text-muted-foreground">
            =
          </span>
          <motion.span 
            className="font-mono text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ?
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
