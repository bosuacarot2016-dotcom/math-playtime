import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface AnswerInputProps {
  onSubmit: (answer: number) => void;
  disabled: boolean;
}

export const AnswerInput = ({ onSubmit, disabled }: AnswerInputProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        onSubmit(numValue);
        setValue("");
      }
    }
  };

  const handleKeypadClick = (digit: string) => {
    if (disabled) return;
    if (digit === "backspace") {
      setValue((prev) => prev.slice(0, -1));
    } else if (digit === "negative") {
      setValue((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
    } else {
      setValue((prev) => prev + digit);
    }
    inputRef.current?.focus();
  };

  const keypadButtons = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "negative", "0", "backspace"
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <motion.input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (/^-?\d*$/.test(val)) {
            setValue(val);
          }
        }}
        placeholder="?"
        disabled={disabled}
        className="w-full text-center font-mono text-4xl font-bold bg-card/80 border-2 border-primary/50 rounded-2xl py-4 px-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-glow-primary transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      />

      <div className="grid grid-cols-3 gap-3 mt-6">
        {keypadButtons.map((btn) => (
          <motion.button
            key={btn}
            type={btn === "backspace" || btn === "negative" ? "button" : "button"}
            onClick={() => handleKeypadClick(btn)}
            disabled={disabled}
            className="bg-secondary hover:bg-secondary/80 text-foreground font-mono text-2xl font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {btn === "backspace" ? "⌫" : btn === "negative" ? "±" : btn}
          </motion.button>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={disabled || !value.trim()}
        className="w-full mt-4 bg-gradient-primary text-primary-foreground font-bold text-xl py-4 rounded-2xl shadow-glow-primary disabled:opacity-50 disabled:shadow-none transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Submit Answer
      </motion.button>
    </form>
  );
};
