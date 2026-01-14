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
          className={`flex items-center gap-4 px-8 py-6 rounded-2xl border ${
            feedback === "correct"
              ? "bg-success/20 border-success shadow-glow-success"
              : feedback === "wrong"
              ? "bg-error/20 border-error shadow-glow-error"
              : "bg-card/80 border-border/50"
          }`}
          initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <span className="font-mono text-5xl md:text-7xl font-bold text-foreground">
            {num1}
          </span>
          <span className="font-mono text-4xl md:text-6xl font-bold text-primary">
            {operator}
          </span>
          <span className="font-mono text-5xl md:text-7xl font-bold text-foreground">
            {num2}
          </span>
          <span className="font-mono text-4xl md:text-6xl font-bold text-muted-foreground">
            =
          </span>
          <span className="font-mono text-5xl md:text-7xl font-bold text-primary">
            ?
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
