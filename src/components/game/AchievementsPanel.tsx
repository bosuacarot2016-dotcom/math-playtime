import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import type { Achievement } from "@/hooks/usePlayerData";

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsPanel = ({ achievements, onClose }: AchievementsPanelProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card border border-purple-500/30 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Thành tựu</h2>
              <p className="text-sm text-muted-foreground">{unlockedCount}/{achievements.length} đã mở</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid gap-3">
          {achievements.map((ach, index) => (
            <motion.div
              key={ach.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                ach.unlocked
                  ? "bg-gradient-to-r from-purple-500/10 to-orange-500/10 border-purple-500/30"
                  : "bg-muted/30 border-border/50 opacity-60"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                ach.unlocked 
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md shadow-orange-500/30" 
                  : "bg-muted"
              }`}>
                {ach.unlocked ? ach.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground">{ach.name}</div>
                <div className="text-sm text-muted-foreground truncate">{ach.description}</div>
              </div>
              {ach.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500 text-xl"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
