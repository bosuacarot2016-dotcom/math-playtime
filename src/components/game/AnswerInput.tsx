import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, Delete } from "lucide-react";

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
        className="w-full text-center font-mono text-4xl font-bold bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/50 rounded-2xl py-4 px-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      />

      <div className="grid grid-cols-3 gap-3 mt-6">
        {keypadButtons.map((btn) => (
          <motion.button
            key={btn}
            type="button"
            onClick={() => handleKeypadClick(btn)}
            disabled={disabled}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-purple-500/30 hover:to-pink-500/30 text-foreground font-mono text-2xl font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/20 hover:border-purple-500/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {btn === "backspace" ? <Delete className="w-6 h-6 mx-auto text-orange-400" /> : btn === "negative" ? "±" : btn}
          </motion.button>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={disabled || !value.trim()}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold text-xl py-4 rounded-2xl shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Send className="w-5 h-5" />
        Trả lời
      </motion.button>
    </form>
  );
};
