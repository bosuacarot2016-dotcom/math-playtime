import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Coins, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WheelSegment {
  id: string;
  label: string;
  type: "coins" | "item" | "pet" | "xp" | "nothing";
  value: string | number;
  color: string;
  probability: number;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "coins_50", label: "50 Xu", type: "coins", value: 50, color: "#FFD700", probability: 20 },
  { id: "xp_100", label: "100 XP", type: "xp", value: 100, color: "#8B5CF6", probability: 15 },
  { id: "coins_100", label: "100 Xu", type: "coins", value: 100, color: "#FFA500", probability: 15 },
  { id: "item_time", label: "Time+", type: "item", value: "time_boost", color: "#3B82F6", probability: 10 },
  { id: "coins_200", label: "200 Xu", type: "coins", value: 200, color: "#FFD700", probability: 10 },
  { id: "item_score", label: "Score x2", type: "item", value: "score_double", color: "#10B981", probability: 8 },
  { id: "xp_250", label: "250 XP", type: "xp", value: 250, color: "#A855F7", probability: 8 },
  { id: "coins_500", label: "500 Xu", type: "coins", value: 500, color: "#F59E0B", probability: 5 },
  { id: "item_combo", label: "Combo Shield", type: "item", value: "combo_shield", color: "#EF4444", probability: 5 },
  { id: "pet_random", label: "Pet!", type: "pet", value: "random", color: "#EC4899", probability: 2 },
  { id: "nothing", label: "Thử lại!", type: "nothing", value: 0, color: "#6B7280", probability: 2 },
];

interface LuckyWheelProps {
  isOpen: boolean;
  onClose: () => void;
  spinCost: number;
  playerCoins: number;
  onReward: (segment: WheelSegment) => void;
  onSpinCost: () => void;
}

const LuckyWheel = ({ isOpen, onClose, spinCost, playerCoins, onReward, onSpinCost }: LuckyWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [showResult, setShowResult] = useState(false);

  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  const getRandomSegment = (): WheelSegment => {
    const totalProbability = WHEEL_SEGMENTS.reduce((sum, seg) => sum + seg.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (const segment of WHEEL_SEGMENTS) {
      random -= segment.probability;
      if (random <= 0) return segment;
    }
    return WHEEL_SEGMENTS[0];
  };

  const spin = () => {
    if (isSpinning || playerCoins < spinCost) return;

    onSpinCost();
    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    const winningSegment = getRandomSegment();
    const segmentIndex = WHEEL_SEGMENTS.findIndex(s => s.id === winningSegment.id);
    
    // Calculate rotation to land on winning segment
    const baseRotation = 360 * 5; // 5 full rotations
    const segmentRotation = segmentIndex * segmentAngle;
    const finalRotation = baseRotation + (360 - segmentRotation) + (segmentAngle / 2);
    
    setRotation(prev => prev + finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(winningSegment);
      setShowResult(true);
      onReward(winningSegment);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-3xl p-6 max-w-md w-full border-2 border-yellow-500/50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Vòng Quay May Mắn
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Wheel Container */}
        <div className="relative w-72 h-72 mx-auto mb-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <motion.div
            className="w-full h-full rounded-full relative overflow-hidden border-4 border-yellow-500 shadow-xl"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {WHEEL_SEGMENTS.map((segment, index) => {
                const startAngle = index * segmentAngle;
                const endAngle = (index + 1) * segmentAngle;
                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);
                
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);
                
                const largeArc = segmentAngle > 180 ? 1 : 0;
                const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
                
                // Text position
                const midAngle = (startAngle + endAngle) / 2 - 90;
                const midRad = midAngle * (Math.PI / 180);
                const textX = 50 + 32 * Math.cos(midRad);
                const textY = 50 + 32 * Math.sin(midRad);
                
                return (
                  <g key={segment.id}>
                    <path d={path} fill={segment.color} stroke="#1a1a2e" strokeWidth="0.5" />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
              {/* Center circle */}
              <circle cx="50" cy="50" r="8" fill="#1a1a2e" stroke="#FFD700" strokeWidth="2" />
              <text x="50" y="51" fill="#FFD700" fontSize="5" textAnchor="middle" dominantBaseline="middle">🎰</text>
            </svg>
          </motion.div>

          {/* Decorative lights */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-yellow-400"
                style={{
                  left: `${50 + 48 * Math.cos((i * 30 - 90) * Math.PI / 180)}%`,
                  top: `${50 + 48 * Math.sin((i * 30 - 90) * Math.PI / 180)}%`,
                  transform: "translate(-50%, -50%)"
                }}
                animate={{
                  opacity: isSpinning ? [1, 0.3, 1] : 1,
                  scale: isSpinning ? [1, 0.8, 1] : 1
                }}
                transition={{
                  duration: 0.3,
                  repeat: isSpinning ? Infinity : 0,
                  delay: i * 0.05
                }}
              />
            ))}
          </div>
        </div>

        {/* Result */}
        {showResult && result && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50"
          >
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">
              {result.type === "nothing" ? "Chúc may mắn lần sau!" : `Bạn nhận được ${result.label}!`}
            </p>
          </motion.div>
        )}

        {/* Spin Button */}
        <div className="space-y-3">
          <Button
            onClick={spin}
            disabled={isSpinning || playerCoins < spinCost}
            className="w-full py-6 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  🎰
                </motion.span>
                Đang quay...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Gift className="w-6 h-6" />
                Quay ({spinCost} <Coins className="w-5 h-5" />)
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-white/60 flex items-center justify-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            Số xu hiện tại: <span className="text-yellow-400 font-bold">{playerCoins}</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { LuckyWheel, type WheelSegment };
