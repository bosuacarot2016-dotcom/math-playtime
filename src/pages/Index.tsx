import { motion, AnimatePresence } from "framer-motion";
import { useGameLogic } from "@/hooks/useGameLogic";
import { StartScreen } from "@/components/game/StartScreen";
import { ScoreDisplay } from "@/components/game/ScoreDisplay";
import { Timer } from "@/components/game/Timer";
import { Problem } from "@/components/game/Problem";
import { AnswerInput } from "@/components/game/AnswerInput";
import { GameOver } from "@/components/game/GameOver";
import { Square } from "lucide-react";

const Index = () => {
  const { gameState, startGame, submitAnswer, setGrade, endGame } = useGameLogic();
  const { status, mode, score, streak, highScore, timeLeft, currentProblem, feedback, questionsAnswered, maxStreak, grade } = gameState;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg">
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
                onStart={startGame} 
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
              <ScoreDisplay score={score} streak={streak} highScore={highScore} grade={grade} mode={mode} />
              {mode === "timed" && <Timer timeLeft={timeLeft} maxTime={10} />}
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
                  onClick={endGame}
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
            >
              <GameOver
                score={score}
                highScore={highScore}
                questionsAnswered={questionsAnswered}
                maxStreak={maxStreak}
                grade={grade}
                mode={mode}
                onRestart={startGame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
