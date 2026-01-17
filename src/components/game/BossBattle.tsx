import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Skull, Flame, Shield, Zap, Crown, Star, Swords } from "lucide-react";

interface Boss {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  reward: number;
  difficulty: number;
}

export const BOSSES: Boss[] = [
  { id: "goblin", name: "Quái Goblin", emoji: "👺", maxHp: 5, reward: 50, difficulty: 1 },
  { id: "skeleton", name: "Bộ xương", emoji: "💀", maxHp: 7, reward: 80, difficulty: 2 },
  { id: "orc", name: "Thú nhân Orc", emoji: "👹", maxHp: 10, reward: 120, difficulty: 3 },
  { id: "demon", name: "Ác quỷ", emoji: "😈", maxHp: 12, reward: 180, difficulty: 4 },
  { id: "dragon", name: "Rồng lửa", emoji: "🐉", maxHp: 15, reward: 250, difficulty: 5 },
];

interface BossBattleProps {
  boss: Boss;
  currentHp: number;
  timeLeft: number;
  maxTime: number;
  damageDealt: number;
  isAttacking: boolean;
  playerEmoji: string;
}

export const BossBattle = ({
  boss,
  currentHp,
  timeLeft,
  maxTime,
  damageDealt,
  isAttacking,
  playerEmoji,
}: BossBattleProps) => {
  const hpPercentage = (currentHp / boss.maxHp) * 100;
  const timePercentage = (timeLeft / maxTime) * 100;
  const [showDamage, setShowDamage] = useState(false);

  useEffect(() => {
    if (isAttacking) {
      setShowDamage(true);
      const timer = setTimeout(() => setShowDamage(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAttacking, damageDealt]);

  return (
    <div className="relative mb-6">
      {/* Battle Arena Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-orange-900/10 to-transparent rounded-2xl"
        animate={{
          boxShadow: [
            "0 0 20px rgba(239, 68, 68, 0.2)",
            "0 0 40px rgba(239, 68, 68, 0.3)",
            "0 0 20px rgba(239, 68, 68, 0.2)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative p-4 rounded-2xl border border-red-500/30 bg-card/80 backdrop-blur-sm">
        {/* Boss Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            <span className="text-lg font-bold text-red-400">BOSS BATTLE</span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: boss.difficulty }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>

        {/* Boss Display */}
        <div className="relative flex items-center justify-center mb-4">
          {/* Player on left */}
          <motion.div
            className="absolute left-4"
            animate={isAttacking ? { x: [0, 40, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl">{playerEmoji}</div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Swords className="w-5 h-5 text-blue-400" />
            </motion.div>
          </motion.div>

          {/* Boss in center */}
          <motion.div
            className="relative"
            animate={
              isAttacking
                ? { x: [0, 10, -10, 0], scale: [1, 0.9, 1] }
                : { y: [0, -5, 0] }
            }
            transition={
              isAttacking ? { duration: 0.3 } : { duration: 2, repeat: Infinity }
            }
          >
            {/* Boss glow */}
            <motion.div
              className="absolute inset-0 blur-2xl rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Boss emoji */}
            <motion.span
              className="text-7xl relative z-10 block"
              animate={
                currentHp <= boss.maxHp * 0.3
                  ? { filter: ["hue-rotate(0deg)", "hue-rotate(20deg)", "hue-rotate(0deg)"] }
                  : {}
              }
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {boss.emoji}
            </motion.span>

            {/* Damage number */}
            <AnimatePresence>
              {showDamage && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl font-black text-red-400"
                  initial={{ y: 0, opacity: 1, scale: 0.5 }}
                  animate={{ y: -40, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  -{damageDealt}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Attack effects */}
          <AnimatePresence>
            {isAttacking && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 w-3 h-3 bg-yellow-400 rounded-full"
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos((i * Math.PI) / 4) * 80,
                      y: Math.sin((i * Math.PI) / 4) * 80,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Boss Name */}
        <div className="text-center mb-3">
          <span className="text-xl font-bold text-foreground">{boss.name}</span>
          <span className="ml-2 text-sm text-yellow-400">
            🪙 +{boss.reward}
          </span>
        </div>

        {/* HP Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-1 text-red-400">
              <Skull className="w-4 h-4" />
              <span>HP</span>
            </div>
            <span className="text-foreground font-bold">
              {currentHp} / {boss.maxHp}
            </span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-red-500/30">
            <motion.div
              className="h-full relative"
              style={{
                background: `linear-gradient(90deg, 
                  hsl(0, 70%, 40%) 0%, 
                  hsl(0, 80%, 50%) 50%, 
                  hsl(0, 70%, 40%) 100%)`,
              }}
              initial={{ width: "100%" }}
              animate={{ width: `${hpPercentage}%` }}
              transition={{ duration: 0.3 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {/* Damage flash */}
              <AnimatePresence>
                {isAttacking && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Time Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" />
              <span>Thời gian</span>
            </div>
            <span className="text-foreground font-bold">
              {Math.ceil(timeLeft)}s
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-orange-500/30">
            <motion.div
              className="h-full"
              style={{
                background:
                  timePercentage > 50
                    ? `linear-gradient(90deg, hsl(142, 70%, 40%), hsl(142, 80%, 50%))`
                    : timePercentage > 25
                    ? `linear-gradient(90deg, hsl(45, 70%, 40%), hsl(45, 80%, 50%))`
                    : `linear-gradient(90deg, hsl(0, 70%, 40%), hsl(0, 80%, 50%))`,
              }}
              animate={{ width: `${timePercentage}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Boss selector component
interface BossSelectorProps {
  playerLevel: number;
  defeatedBosses: string[];
  onSelectBoss: (boss: Boss) => void;
  onClose: () => void;
}

export const BossSelector = ({
  playerLevel,
  defeatedBosses,
  onSelectBoss,
  onClose,
}: BossSelectorProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md bg-card rounded-2xl border border-red-500/30 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-900/50 to-orange-900/50 border-b border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-foreground">Chọn Boss</h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Đánh bại boss trong 50 giây để nhận thưởng lớn!
          </p>
        </div>

        {/* Boss list */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {BOSSES.map((boss) => {
            const isDefeated = defeatedBosses.includes(boss.id);
            const isLocked = boss.difficulty > playerLevel;

            return (
              <motion.button
                key={boss.id}
                onClick={() => !isLocked && onSelectBoss(boss)}
                disabled={isLocked}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  isLocked
                    ? "bg-muted/30 border-border/30 opacity-50 cursor-not-allowed"
                    : isDefeated
                    ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50"
                    : "bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20"
                }`}
                whileHover={!isLocked ? { scale: 1.02 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl relative">
                    {boss.emoji}
                    {isDefeated && (
                      <div className="absolute -top-1 -right-1 text-lg">✓</div>
                    )}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        🔒
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {boss.name}
                      </span>
                      {isDefeated && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="text-red-400">❤️ {boss.maxHp} HP</span>
                      <span className="text-yellow-400">🪙 +{boss.reward}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: boss.difficulty }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      {isLocked && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Cần Lv.{boss.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Victory/Defeat screen
interface BossResultProps {
  boss: Boss;
  victory: boolean;
  timeUsed: number;
  onContinue: () => void;
}

export const BossResult = ({
  boss,
  victory,
  timeUsed,
  onContinue,
}: BossResultProps) => {
  return (
    <motion.div
      className="text-center py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Result icon */}
      <motion.div
        className="text-8xl mb-4"
        animate={
          victory
            ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }
            : { y: [0, 10, 0] }
        }
        transition={{ duration: 0.5 }}
      >
        {victory ? "🏆" : "💀"}
      </motion.div>

      {/* Title */}
      <h2
        className={`text-3xl font-black mb-2 ${
          victory ? "text-yellow-400" : "text-red-400"
        }`}
      >
        {victory ? "CHIẾN THẮNG!" : "THẤT BẠI!"}
      </h2>

      {/* Boss name */}
      <p className="text-lg text-muted-foreground mb-4">
        {victory
          ? `Bạn đã đánh bại ${boss.name}!`
          : `${boss.name} quá mạnh...`}
      </p>

      {/* Rewards */}
      {victory && (
        <motion.div
          className="flex items-center justify-center gap-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-3xl mb-1">🪙</div>
            <div className="text-xl font-bold text-yellow-400">
              +{boss.reward}
            </div>
            <div className="text-xs text-muted-foreground">Coins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">⭐</div>
            <div className="text-xl font-bold text-purple-400">
              +{Math.floor(boss.reward / 2)}
            </div>
            <div className="text-xs text-muted-foreground">XP</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">⏱️</div>
            <div className="text-xl font-bold text-blue-400">
              {Math.floor(50 - timeUsed)}s
            </div>
            <div className="text-xs text-muted-foreground">Còn lại</div>
          </div>
        </motion.div>
      )}

      {/* Continue button */}
      <motion.button
        onClick={onContinue}
        className={`px-8 py-3 rounded-xl font-bold text-white transition-colors ${
          victory
            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {victory ? "Thu thập phần thưởng" : "Thử lại"}
      </motion.button>
    </motion.div>
  );
};
