import { useState, useEffect, useCallback } from "react";

type Operator = "+" | "-" | "×";

interface Problem {
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
}

interface GameState {
  status: "idle" | "playing" | "gameOver";
  score: number;
  streak: number;
  maxStreak: number;
  highScore: number;
  timeLeft: number;
  questionsAnswered: number;
  currentProblem: Problem;
  feedback: "correct" | "wrong" | null;
}

const INITIAL_TIME = 10;
const TIME_BONUS = 2;
const STREAK_MULTIPLIER = 0.5;

const generateProblem = (difficulty: number): Problem => {
  const operators: Operator[] = ["+", "-", "×"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let num1: number, num2: number, answer: number;
  const maxNum = Math.min(5 + difficulty * 2, 20);

  switch (operator) {
    case "+":
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      answer = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      break;
    case "×":
      num1 = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
      num2 = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }

  return { num1, num2, operator, answer };
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedHighScore = localStorage.getItem("mathBlitzHighScore");
    return {
      status: "idle",
      score: 0,
      streak: 0,
      maxStreak: 0,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0,
      timeLeft: INITIAL_TIME,
      questionsAnswered: 0,
      currentProblem: generateProblem(0),
      feedback: null,
    };
  });

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeLeft: INITIAL_TIME,
      questionsAnswered: 0,
      currentProblem: generateProblem(0),
      feedback: null,
    }));
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;

      const isCorrect = answer === prev.currentProblem.answer;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const streakBonus = isCorrect ? Math.floor(prev.streak * STREAK_MULTIPLIER) : 0;
      const basePoints = isCorrect ? 10 : 0;
      const newScore = prev.score + basePoints + streakBonus;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const newTimeLeft = isCorrect
        ? Math.min(prev.timeLeft + TIME_BONUS, INITIAL_TIME)
        : prev.timeLeft;
      const difficulty = Math.floor(prev.questionsAnswered / 5);

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        maxStreak: newMaxStreak,
        timeLeft: newTimeLeft,
        questionsAnswered: prev.questionsAnswered + 1,
        currentProblem: generateProblem(difficulty),
        feedback: isCorrect ? "correct" : "wrong",
      };
    });

    setTimeout(() => {
      setGameState((prev) => ({ ...prev, feedback: null }));
    }, 300);
  }, []);

  const endGame = useCallback(() => {
    setGameState((prev) => {
      const newHighScore = Math.max(prev.highScore, prev.score);
      localStorage.setItem("mathBlitzHighScore", newHighScore.toString());
      return {
        ...prev,
        status: "gameOver",
        highScore: newHighScore,
      };
    });
  }, []);

  useEffect(() => {
    if (gameState.status !== "playing") return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 0.1) {
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 0.1 };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status === "playing" && gameState.timeLeft <= 0) {
      endGame();
    }
  }, [gameState.timeLeft, gameState.status, endGame]);

  return {
    gameState,
    startGame,
    submitAnswer,
  };
};
