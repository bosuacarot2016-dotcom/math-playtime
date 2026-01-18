import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { usePlayerData } from "@/hooks/usePlayerData";
import { useShopData } from "@/hooks/useShopData";
import { CharacterCreation } from "@/components/game/CharacterCreation";
import { StartScreen } from "@/components/game/StartScreen";
import { ScoreDisplay } from "@/components/game/ScoreDisplay";
import { EnergyBar } from "@/components/game/EnergyBar";
import { Problem } from "@/components/game/Problem";
import { AnswerInput } from "@/components/game/AnswerInput";
import { GameOver } from "@/components/game/GameOver";
import { PlayerHeader } from "@/components/game/PlayerHeader";
import { AchievementNotification } from "@/components/game/AchievementNotification";
import { AchievementsPanel } from "@/components/game/AchievementsPanel";
import { FloatingParticles } from "@/components/game/FloatingParticles";
import { StreakFlame } from "@/components/game/StreakFlame";
import { ShopPanel } from "@/components/game/ShopPanel";
import { PowerupSelector } from "@/components/game/PowerupSelector";
import { ActivePowerups } from "@/components/game/ActivePowerups";
import { PetDisplay } from "@/components/game/PetDisplay";
import { BossBattle, BossSelector, BossResult, BOSSES } from "@/components/game/BossBattle";
import { LuckyWheel, Prize } from "@/components/game/LuckyWheel";
import { Square, Trophy, ShoppingBag, Zap, Coins, Swords, Gift } from "lucide-react";

const Index = () => {
  const { gameState, startGame, startBossBattle, submitAnswer, setGrade, endGame, resetToIdle } = useGameLogic();
  const { 
    player, 
    createPlayer, 
    addXp, 
    updateStats, 
    newAchievements, 
    clearNewAchievements,
    xpForCurrentLevel,
    xpProgress,
    avatars 
  } = usePlayerData();
  
  const {
    shopState,
    shopItems,
    pets,
    addCoins,
    buyItem,
    buyPet,
    equipPet,
    useItem,
    clearActivePowerups,
    grantItem,
    getEquippedPet,
  } = useShopData();
  
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showPowerups, setShowPowerups] = useState(false);
  const [showBossSelector, setShowBossSelector] = useState(false);
  const [showLuckyWheel, setShowLuckyWheel] = useState(false);
  const [freeSpins, setFreeSpins] = useState<number>(() => {
    const saved = localStorage.getItem("freeSpins");
    return saved ? parseInt(saved) : 3; // Start with 3 free spins
  });
  const [defeatedBosses, setDefeatedBosses] = useState<string[]>(() => {
    const saved = localStorage.getItem("defeatedBosses");
    return saved ? JSON.parse(saved) : [];
  });
  
  const { status, mode, score, streak, highScore, timeLeft, currentProblem, feedback, questionsAnswered, maxStreak, grade, boss } = gameState;

  // Save free spins to localStorage
  useEffect(() => {
    localStorage.setItem("freeSpins", freeSpins.toString());
  }, [freeSpins]);

  // Get avatar emoji
  const avatarEmoji = avatars.find(a => a.id === player.avatarId)?.emoji || "🧙‍♂️";
  
  // Get equipped pet
  const equippedPet = getEquippedPet();

  // Calculate bonuses from powerups and pet
  const calculateBonuses = () => {
    let scoreMultiplier = 1;
    let xpMultiplier = 1;
    let timeBonus = 0;
    let hasComboShield = false;

    // Powerup effects
    shopState.activePowerups.forEach((id) => {
      switch (id) {
        case "time_boost":
          timeBonus += 1; // +1 extra second per correct
          break;
        case "score_x2":
          scoreMultiplier *= 2;
          break;
        case "combo_shield":
          hasComboShield = true;
          break;
        case "xp_boost":
          xpMultiplier *= 1.5;
          break;
      }
    });

    // Pet bonuses
    if (equippedPet) {
      switch (equippedPet.bonusType) {
        case "xp":
          xpMultiplier *= equippedPet.bonusValue;
          break;
        case "score":
          scoreMultiplier *= equippedPet.bonusValue;
          break;
        case "time":
          timeBonus += equippedPet.bonusValue;
          break;
      }
    }

    return { scoreMultiplier, xpMultiplier, timeBonus, hasComboShield };
  };

  const bonuses = calculateBonuses();

  // Handle game over
  const handleGameEnd = () => {
    const correctAnswers = Math.floor(score / 10);
    updateStats(correctAnswers, questionsAnswered, maxStreak, score);
    const baseXp = Math.floor(score / 2);
    const finalXp = Math.floor(baseXp * bonuses.xpMultiplier);
    addXp(finalXp);
    const coinsEarned = Math.floor(score / 10);
    addCoins(coinsEarned);
    clearActivePowerups();
  };

  // Handle boss victory
  const handleBossVictory = () => {
    const currentBoss = BOSSES.find(b => b.id === boss.bossId);
    if (currentBoss) {
      addCoins(currentBoss.reward);
      addXp(Math.floor(currentBoss.reward / 2));
      setFreeSpins(prev => prev + 1); // Reward 1 free spin for boss victory
      if (!defeatedBosses.includes(currentBoss.id)) {
        const newDefeated = [...defeatedBosses, currentBoss.id];
        setDefeatedBosses(newDefeated);
        localStorage.setItem("defeatedBosses", JSON.stringify(newDefeated));
      }
    }
  };

  // Handle lucky wheel prize
  const handleWheelPrize = (prize: Prize) => {
    switch (prize.type) {
      case "coins":
        addCoins(prize.value as number);
        break;
      case "xp":
        addXp(prize.value as number);
        break;
      case "powerup":
        // Add powerup to inventory for free
        const itemId = prize.value === "time_plus" ? "time_boost" : "combo_shield";
        grantItem(itemId);
        break;
    }
  };

  const handleUseSpin = () => {
    setFreeSpins(prev => Math.max(0, prev - 1));
  };

  // Handle starting game
  const handleStartGame = (gameMode: "timed" | "practice") => {
    const hasPowerups = shopState.ownedItems.some(item => item.quantity > 0);
    if (hasPowerups && shopState.activePowerups.length === 0) {
      setShowPowerups(true);
    }
    startGame(gameMode);
  };

  // Handle exit to home
  const handleExit = () => {
    resetToIdle();
  };

  // Handle boss battle start
  const handleStartBoss = (bossData: typeof BOSSES[0]) => {
    setShowBossSelector(false);
    startBossBattle(bossData.id, bossData.maxHp, bossData.reward);
  };

  // Show character creation if no player exists
  if (!player.name) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <FloatingParticles count={20} />
        <div className="w-full max-w-lg relative z-10">
          <CharacterCreation avatars={avatars} onCreateCharacter={createPlayer} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Floating particles background */}
      <FloatingParticles count={25} />
      
      {/* Pet display during game */}
      <AnimatePresence>
        {status === "playing" && equippedPet && (
          <PetDisplay pet={equippedPet} position="left" />
        )}
      </AnimatePresence>
      
      {/* Achievement notification */}
      <AchievementNotification achievements={newAchievements} onClose={clearNewAchievements} />
      
      {/* Achievements panel */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementsPanel achievements={player.achievements} onClose={() => setShowAchievements(false)} />
        )}
      </AnimatePresence>

      {/* Shop panel */}
      <ShopPanel
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        coins={shopState.coins}
        shopItems={shopItems}
        pets={pets}
        ownedItems={shopState.ownedItems}
        ownedPets={shopState.ownedPets}
        equippedPet={shopState.equippedPet}
        onBuyItem={buyItem}
        onBuyPet={buyPet}
        onEquipPet={equipPet}
      />

      {/* Powerup selector */}
      <PowerupSelector
        isOpen={showPowerups}
        onClose={() => setShowPowerups(false)}
        shopItems={shopItems}
        ownedItems={shopState.ownedItems}
        activePowerups={shopState.activePowerups}
        onUseItem={useItem}
      />

      {/* Lucky Wheel */}
      <AnimatePresence>
        {showLuckyWheel && (
          <LuckyWheel
            isOpen={showLuckyWheel}
            onClose={() => setShowLuckyWheel(false)}
            freeSpins={freeSpins}
            onSpin={handleWheelPrize}
            onUseSpin={handleUseSpin}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col relative z-10">
        {/* Player header - always visible except during character creation */}
        {status !== "playing" && (
          <div className="flex items-center justify-between mb-2">
            <PlayerHeader
              name={player.name}
              avatarEmoji={avatarEmoji}
              level={player.level}
              xp={player.xp}
              xpForLevel={xpForCurrentLevel}
              xpProgress={xpProgress}
            />
          </div>
        )}

        {/* Action buttons */}
        {status === "idle" && (
          <div className="flex items-center justify-end gap-2 mb-4 flex-wrap">
            <motion.div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-3 py-2 rounded-xl border border-yellow-500/30" whileHover={{ scale: 1.05 }}>
              <Coins className="w-4 h-4" />
              <span className="text-sm font-bold">{shopState.coins}</span>
            </motion.div>
            
            <motion.button onClick={() => setShowBossSelector(true)} className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 px-4 py-2 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Swords className="w-4 h-4" />
              <span className="text-sm font-medium">Boss</span>
            </motion.button>
            
            <motion.button onClick={() => setShowLuckyWheel(true)} className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 px-4 py-2 rounded-xl border border-pink-500/30 hover:border-pink-500/50 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Quay</span>
              {freeSpins > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {freeSpins}
                </span>
              )}
            </motion.button>
            
            <motion.button onClick={() => setShowShop(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">Cửa hàng</span>
            </motion.button>
            
            <motion.button onClick={() => setShowAchievements(true)} className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-4 py-2 rounded-xl border border-yellow-500/30 hover:border-yellow-500/50 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">{player.achievements.filter(a => a.unlocked).length}/{player.achievements.length}</span>
            </motion.button>
          </div>
        )}

        {/* Boss selector */}
        <AnimatePresence>
          {showBossSelector && (
            <BossSelector playerLevel={player.level} defeatedBosses={defeatedBosses} onSelectBoss={handleStartBoss} onClose={() => setShowBossSelector(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StartScreen 
                highScore={highScore} 
                grade={grade}
                onSelectGrade={setGrade}
                onStart={handleStartGame}
                playerLevel={player.level}
              />
            </motion.div>
          )}

          {status === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Compact player info during game */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-card/50 px-3 py-2 rounded-xl border border-purple-500/30">
                  <span className="text-2xl">{avatarEmoji}</span>
                  <div>
                    <div className="text-sm font-bold text-foreground">{player.name}</div>
                    <div className="text-xs text-purple-400">Lv.{player.level}</div>
                  </div>
                </div>
                <ScoreDisplay score={score} streak={streak} highScore={highScore} grade={grade} mode={mode} />
                <StreakFlame streak={streak} />
              </div>
              
              {/* Active powerups */}
              <ActivePowerups activePowerups={shopState.activePowerups} />
              
              {/* Powerup button during game */}
              {shopState.ownedItems.some(item => item.quantity > 0) && (
                <motion.button
                  onClick={() => setShowPowerups(true)}
                  className="mb-4 flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Dùng Power-up</span>
                </motion.button>
              )}
              
              {mode === "timed" && <EnergyBar current={timeLeft} max={50} label="Năng lượng" />}
              
              {/* Boss battle UI */}
              {mode === "boss" && (
                <BossBattle
                  boss={BOSSES.find(b => b.id === boss.bossId) || BOSSES[0]}
                  currentHp={boss.currentHp}
                  timeLeft={timeLeft}
                  maxTime={50}
                  damageDealt={boss.damageDealt}
                  isAttacking={boss.isAttacking}
                  playerEmoji={avatarEmoji}
                />
              )}
              
              <Problem num1={currentProblem.num1} num2={currentProblem.num2} operator={currentProblem.operator} feedback={feedback} />
              <AnswerInput onSubmit={submitAnswer} disabled={status !== "playing"} />
              {mode === "practice" && (
                <motion.button onClick={() => { handleGameEnd(); endGame(); }} className="w-full max-w-sm mx-auto mt-4 flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-3 rounded-xl border border-border/50 transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Square className="w-4 h-4" />
                  Kết thúc luyện tập
                </motion.button>
              )}
            </motion.div>
          )}

          {status === "gameOver" && mode !== "boss" && (
            <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} onAnimationStart={handleGameEnd}>
              <GameOver score={score} highScore={highScore} questionsAnswered={questionsAnswered} maxStreak={maxStreak} grade={grade} mode={mode as "timed" | "practice"} onRestart={handleStartGame} onExit={handleExit} xpEarned={Math.floor((score / 2) * bonuses.xpMultiplier)} playerLevel={player.level} />
            </motion.div>
          )}

          {(status === "bossVictory" || status === "bossDefeat") && (
            <motion.div key="bossresult" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} onAnimationStart={status === "bossVictory" ? handleBossVictory : undefined}>
              <BossResult boss={BOSSES.find(b => b.id === boss.bossId) || BOSSES[0]} victory={status === "bossVictory"} timeUsed={50 - timeLeft} onContinue={handleExit} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
