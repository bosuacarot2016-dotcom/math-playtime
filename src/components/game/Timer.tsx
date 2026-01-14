import { motion } from "framer-motion";

interface TimerProps {
  timeLeft: number;
  maxTime: number;
}

export const Timer = ({ timeLeft, maxTime }: TimerProps) => {
  const percentage = (timeLeft / maxTime) * 100;
  const isLow = percentage < 30;
  const isCritical = percentage < 15;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            isCritical
              ? "bg-gradient-error shadow-glow-error"
              : isLow
              ? "bg-gradient-accent shadow-glow-accent"
              : "bg-gradient-primary shadow-glow-primary"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <motion.p
        className={`text-center mt-2 font-mono text-sm ${
          isCritical ? "text-error" : isLow ? "text-accent" : "text-muted-foreground"
        }`}
        animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        {timeLeft.toFixed(1)}s
      </motion.p>
    </div>
  );
};
