import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Coins, Zap, Shield, Star, Gift } from "lucide-react";

interface Prize {
  id: string;
  name: string;
  type: "coins" | "powerup" | "pet" | "xp";
  value: number | string;
  color: string;
  icon: React.ReactNode;
  probability: number; // Weight for probability
}

const PRIZES: Prize[] = [
  { id: "coins_50", name: "50 Coins", type: "coins", value: 50, color: "#FFD700", icon: <Coins className="w-4 h-4" />, probability: 25 },
  { id: "coins_100", name: "100 Coins", type: "coins", value: 100, color: "#FFA500", icon: <Coins className="w-4 h-4" />, probability: 15 },
  { id: "coins_200", name: "200 Coins", type: "coins", value: 200, color: "#FF6347", icon: <Coins className="w-4 h-4" />, probability: 8 },
  { id: "xp_50", name: "50 XP", type: "xp", value: 50, color: "#9B59B6", icon: <Star className="w-4 h-4" />, probability: 20 },
  { id: "xp_100", name: "100 XP", type: "xp", value: 100, color: "#8E44AD", icon: <Star className="w-4 h-4" />, probability: 10 },
  { id: "time_plus", name: "Time+", type: "powerup", value: "time_plus", color: "#3498DB", icon: <Zap className="w-4 h-4" />, probability: 10 },
  { id: "shield", name: "Combo Shield", type: "powerup", value: "combo_shield", color: "#2ECC71", icon: <Shield className="w-4 h-4" />, probability: 8 },
  { id: "jackpot", name: "500 Coins!", type: "coins", value: 500, color: "#E74C3C", icon: <Gift className="w-4 h-4" />, probability: 4 },
];

interface LuckyWheelProps {
  isOpen: boolean;
  onClose: () => void;
  freeSpins: number;
  onSpin: (prize: Prize) => void;
  onUseSpin: () => void;
}

export const LuckyWheel = ({ isOpen, onClose, freeSpins, onSpin, onUseSpin }: LuckyWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const currentRotationRef = useRef(0);

  const segmentAngle = 360 / PRIZES.length;

  // Weighted random selection
  const selectPrize = (): Prize => {
    const totalWeight = PRIZES.reduce((sum, prize) => sum + prize.probability, 0);
    let random = Math.random() * totalWeight;
    
    for (const prize of PRIZES) {
      random -= prize.probability;
      if (random <= 0) {
        return prize;
      }
    }
    return PRIZES[0];
  };

  const handleSpin = () => {
    if (isSpinning || freeSpins <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);
    onUseSpin();

    // Select prize first
    const selectedPrize = selectPrize();
    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize.id);

    // Calculate target rotation
    // The wheel rotates clockwise, pointer is at top (0 degrees)
    // Each segment spans segmentAngle degrees
    // Prize at index i is centered at (i * segmentAngle + segmentAngle/2) from the start
    const prizeAngleFromStart = prizeIndex * segmentAngle + segmentAngle / 2;
    
    // We want this prize to align with the top (0 degrees / 360 degrees)
    // So we need to rotate by (360 - prizeAngleFromStart) to bring it to top
    const targetAngle = 360 - prizeAngleFromStart;
    
    // Add multiple full rotations for effect (5-8 rotations)
    const fullRotations = 5 + Math.floor(Math.random() * 3);
    const totalRotation = currentRotationRef.current + fullRotations * 360 + targetAngle;
    
    // Normalize to prevent issues with very large numbers
    const normalizedRotation = totalRotation % 360 + fullRotations * 360;
    const finalRotation = currentRotationRef.current + normalizedRotation;

    setRotation(finalRotation);
    currentRotationRef.current = finalRotation;

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      onSpin(selectedPrize);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !isSpinning && onClose()}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full border-2 border-yellow-500/50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            🎰 Vòng Quay May Mắn
          </h2>
          <button
            onClick={onClose}
            disabled={isSpinning}
            className="text-white/60 hover:text-white disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free spins counter */}
        <div className="text-center mb-4">
          <span className="text-white/80">Lượt quay miễn phí: </span>
          <span className="text-yellow-400 font-bold text-xl">{freeSpins}</span>
        </div>

        {/* Wheel Container */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <motion.div
            className="relative w-64 h-64 rounded-full border-4 border-yellow-500 shadow-2xl overflow-hidden"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {PRIZES.map((prize, index) => {
              const angle = index * segmentAngle;
              return (
                <div
                  key={prize.id}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 h-1/2 origin-bottom flex flex-col items-center justify-start pt-2"
                    style={{
                      width: "50px",
                      marginLeft: "-25px",
                      transform: `rotate(${segmentAngle / 2}deg)`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: prize.color }}
                    >
                      {prize.icon}
                    </div>
                    <span className="text-[8px] text-white font-bold mt-1 text-center leading-tight whitespace-nowrap">
                      {prize.name}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Wheel background segments */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {PRIZES.map((prize, index) => {
                const startAngle = index * segmentAngle - 90;
                const endAngle = (index + 1) * segmentAngle - 90;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);
                
                const largeArc = segmentAngle > 180 ? 1 : 0;
                
                return (
                  <path
                    key={prize.id}
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={prize.color}
                    opacity={0.3}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                  />
                );
              })}
              {/* Center circle */}
              <circle cx="50" cy="50" r="12" fill="#1a1a2e" stroke="#ffd700" strokeWidth="2" />
              <text x="50" y="54" textAnchor="middle" fill="#ffd700" fontSize="8" fontWeight="bold">
                QUAY
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Won Prize Display */}
        {wonPrize && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/50"
          >
            <p className="text-white/80 mb-1">Bạn nhận được:</p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-400">
              {wonPrize.icon}
              <span>{wonPrize.name}</span>
            </div>
          </motion.div>
        )}

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || freeSpins <= 0}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
            isSpinning || freeSpins <= 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400 hover:scale-105 active:scale-95"
          }`}
        >
          {isSpinning ? "Đang quay..." : freeSpins <= 0 ? "Hết lượt quay" : "🎲 QUAY NGAY!"}
        </button>

        {/* Info */}
        <p className="text-center text-white/50 text-sm mt-3">
          Nhận thêm lượt quay khi thắng Boss hoặc lên level!
        </p>
      </motion.div>
    </motion.div>
  );
};

export type { Prize };
