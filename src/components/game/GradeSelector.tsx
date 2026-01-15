import { motion } from "framer-motion";

interface GradeSelectorProps {
  selectedGrade: number;
  onSelectGrade: (grade: number) => void;
}

const gradeDescriptions: Record<number, string> = {
  1: "Cộng trong phạm vi 10",
  2: "Cộng, trừ trong phạm vi 20",
  3: "Cộng, trừ, nhân cơ bản (bảng cửu chương 2-5)",
  4: "Bốn phép tính, số đến 50",
  5: "Nhân chia 2 chữ số, số đến 100",
  6: "Bốn phép tính với số đến 1000",
  7: "Làm quen số nguyên âm",
  8: "Phép tính với số nguyên âm",
  9: "Phép tính phức tạp, số lớn",
  10: "Thử thách cao cấp - tất cả dạng bài",
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
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg shadow-purple-500/30"
                : "bg-card/50 text-foreground border-border/50 hover:border-purple-500/50"
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
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">Lớp {selectedGrade}:</span>{" "}
        <span className="text-muted-foreground">{gradeDescriptions[selectedGrade]}</span>
      </motion.div>
    </div>
  );
};
