import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
import { Square, Trophy, ShoppingBag, Zap, Coins } from "lucide-react";

const Index = () => {
  const { gameState, startGame, submitAnswer, setGrade, endGame } = useGameLogic();
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
    getEquippedPet,
  } = useShopData();
  
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showPowerups, setShowPowerups] = useState(false);
  
  const { status, mode, score, streak, highScore, timeLeft, currentProblem, feedback, questionsAnswered, maxStreak, grade } = gameState;

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

  // Handle game over - update stats and add XP
  const handleGameEnd = () => {
    const correctAnswers = Math.floor(score / 10); // Approximate
    updateStats(correctAnswers, questionsAnswered, maxStreak, score);
    
    // Calculate XP with bonuses
    const baseXp = Math.floor(score / 2);
    const finalXp = Math.floor(baseXp * bonuses.xpMultiplier);
    addXp(finalXp);
    
    // Add coins based on score
    const coinsEarned = Math.floor(score / 10);
    addCoins(coinsEarned);
    
    // Clear powerups after game
    clearActivePowerups();
  };

  // Handle starting game with powerup selection
  const handleStartGame = (gameMode: "timed" | "practice") => {
    // Check if player has any powerups
    const hasPowerups = shopState.ownedItems.some(item => item.quantity > 0);
    
    if (hasPowerups && shopState.activePowerups.length === 0) {
      setShowPowerups(true);
    }
    
    startGame(gameMode);
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
          <div className="flex items-center justify-end gap-2 mb-4">
            {/* Coins display */}
            <motion.div
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-3 py-2 rounded-xl border border-yellow-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Coins className="w-4 h-4" />
              <span className="text-sm font-bold">{shopState.coins}</span>
            </motion.div>
            
            {/* Shop button */}
            <motion.button
              onClick={() => setShowShop(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">Cửa hàng</span>
            </motion.button>
            
            {/* Achievements button */}
            <motion.button
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-4 py-2 rounded-xl border border-yellow-500/30 hover:border-yellow-500/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">
                {player.achievements.filter(a => a.unlocked).length}/{player.achievements.length}
              </span>
            </motion.button>
          </div>
        )}

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
              
              {mode === "timed" && <EnergyBar current={timeLeft} max={10} label="Năng lượng" />}
              
              <Problem
                num1={currentProblem.num1}
                num2={currentProblem.num2}
                operator={currentProblem.operator}
                feedback={feedback}
              />
              <AnswerInput
                onSubmit={submitAnswer}
                disabled={status !== "playing"}
              />
              {mode === "practice" && (
                <motion.button
                  onClick={() => {
                    handleGameEnd();
                    endGame();
                  }}
                  className="w-full max-w-sm mx-auto mt-4 flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-3 rounded-xl border border-border/50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Square className="w-4 h-4" />
                  Kết thúc luyện tập
                </motion.button>
              )}
            </motion.div>
          )}

          {status === "gameOver" && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              onAnimationStart={handleGameEnd}
            >
              <GameOver
                score={score}
                highScore={highScore}
                questionsAnswered={questionsAnswered}
                maxStreak={maxStreak}
                grade={grade}
                mode={mode}
                onRestart={handleStartGame}
                xpEarned={Math.floor((score / 2) * bonuses.xpMultiplier)}
                playerLevel={player.level}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
