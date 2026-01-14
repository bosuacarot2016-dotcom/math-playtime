import { motion } from "framer-motion";

interface GradeSelectorProps {
  selectedGrade: number;
  onSelectGrade: (grade: number) => void;
}

const gradeDescriptions: Record<number, string> = {
  1: "Addition 1-10",
  2: "Add & Subtract 1-20",
  3: "Add, Sub, Multiply basics",
  4: "All ops, numbers to 50",
  5: "Larger numbers, harder multiply",
  6: "Numbers to 100, all ops",
  7: "Negative numbers intro",
  8: "Larger negatives & multiply",
  9: "Complex operations",
  10: "Master level challenge",
};

export const GradeSelector = ({ selectedGrade, onSelectGrade }: GradeSelectorProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-muted-foreground text-sm uppercase tracking-wider text-center mb-4">
        Select Your Grade
      </p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((grade) => (
          <motion.button
            key={grade}
            onClick={() => onSelectGrade(grade)}
            className={`relative py-3 rounded-xl font-mono text-lg font-bold transition-all duration-200 border ${
              selectedGrade === grade
                ? "bg-gradient-primary text-primary-foreground border-primary shadow-glow-primary"
                : "bg-card/50 text-foreground border-border/50 hover:border-primary/50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {grade}
          </motion.button>
        ))}
      </div>
      <motion.div
        key={selectedGrade}
        className="bg-card/50 rounded-xl p-3 border border-border/50 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-primary font-bold">Grade {selectedGrade}:</span>{" "}
        <span className="text-muted-foreground">{gradeDescriptions[selectedGrade]}</span>
      </motion.div>
    </div>
  );
};
