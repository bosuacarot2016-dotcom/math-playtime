import { useState, useEffect, useCallback } from "react";

type Operator = "+" | "-" | "×" | "÷";

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
  grade: number;
}

const INITIAL_TIME = 10;
const TIME_BONUS = 2;
const STREAK_MULTIPLIER = 0.5;

const generateProblem = (grade: number): Problem => {
  let operators: Operator[];
  let num1: number, num2: number, answer: number;
  let operator: Operator;

  // Define operators and number ranges based on grade
  switch (grade) {
    case 1:
      // Simple addition only, 1-10
      operators = ["+"];
      operator = "+";
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
      break;

    case 2:
      // Addition and subtraction, 1-20
      operators = ["+", "-"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      }
      break;

    case 3:
      // Add, subtract, basic multiply (1-5)
      operators = ["+", "-", "×"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 25) + 1;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 25) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else {
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        answer = num1 * num2;
      }
      break;

    case 4:
      // All operations, numbers to 50
      operators = ["+", "-", "×", "÷"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
      }
      break;

    case 5:
      // Larger numbers, harder multiply
      operators = ["+", "-", "×", "÷"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 75) + 1;
        num2 = Math.floor(Math.random() * 75) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 75) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
      }
      break;

    case 6:
      // Numbers to 100, all ops
      operators = ["+", "-", "×", "÷"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = Math.floor(Math.random() * 12) + 2;
        num1 = num2 * answer;
      }
      break;

    case 7:
      // Introduce negative numbers
      operators = ["+", "-", "×"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      const useNegative7 = Math.random() > 0.5;
      if (operator === "+") {
        num1 = useNegative7 ? -(Math.floor(Math.random() * 20) + 1) : Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 30) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 70) + 1;
        answer = num1 - num2;
      } else {
        num1 = useNegative7 ? -(Math.floor(Math.random() * 10) + 1) : Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
      }
      break;

    case 8:
      // Larger negatives & multiply
      operators = ["+", "-", "×", "÷"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      const useNegative8 = Math.random() > 0.4;
      if (operator === "+") {
        num1 = useNegative8 ? -(Math.floor(Math.random() * 50) + 1) : Math.floor(Math.random() * 100) + 1;
        num2 = useNegative8 ? -(Math.floor(Math.random() * 50) + 1) : Math.floor(Math.random() * 100) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = useNegative8 ? -(Math.floor(Math.random() * 50) + 1) : Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = useNegative8 ? -(Math.floor(Math.random() * 12) + 1) : Math.floor(Math.random() * 15) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = useNegative8 ? -(Math.floor(Math.random() * 12) + 1) : Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
      }
      break;

    case 9:
      // Complex operations
      operators = ["+", "-", "×", "÷"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      const useNegative9 = Math.random() > 0.3;
      if (operator === "+") {
        num1 = useNegative9 ? -(Math.floor(Math.random() * 100) + 1) : Math.floor(Math.random() * 150) + 1;
        num2 = useNegative9 ? -(Math.floor(Math.random() * 100) + 1) : Math.floor(Math.random() * 150) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = useNegative9 ? -(Math.floor(Math.random() * 100) + 1) : Math.floor(Math.random() * 150) + 1;
        num2 = Math.floor(Math.random() * 150) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = useNegative9 ? -(Math.floor(Math.random() * 15) + 1) : Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 15) + 1;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 15) + 2;
        answer = useNegative9 ? -(Math.floor(Math.random() * 15) + 1) : Math.floor(Math.random() * 15) + 1;
        num1 = num2 * answer;
      }
      break;

    case 10:
    default:
      // Master level
      operators = ["+", "-", "×", "÷"];
      operator = operators[Math.floor(Math.random() * operators.length)];
      const useNegative10 = Math.random() > 0.25;
      if (operator === "+") {
        num1 = useNegative10 ? -(Math.floor(Math.random() * 200) + 1) : Math.floor(Math.random() * 200) + 1;
        num2 = useNegative10 ? -(Math.floor(Math.random() * 200) + 1) : Math.floor(Math.random() * 200) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = useNegative10 ? -(Math.floor(Math.random() * 150) + 1) : Math.floor(Math.random() * 200) + 1;
        num2 = Math.floor(Math.random() * 200) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = useNegative10 ? -(Math.floor(Math.random() * 20) + 1) : Math.floor(Math.random() * 25) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 20) + 2;
        answer = useNegative10 ? -(Math.floor(Math.random() * 20) + 1) : Math.floor(Math.random() * 20) + 1;
        num1 = num2 * answer;
      }
      break;
  }

  return { num1, num2, operator, answer };
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedHighScore = localStorage.getItem("mathBlitzHighScore");
    const savedGrade = localStorage.getItem("mathBlitzGrade");
    const grade = savedGrade ? parseInt(savedGrade, 10) : 1;
    return {
      status: "idle",
      score: 0,
      streak: 0,
      maxStreak: 0,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0,
      timeLeft: INITIAL_TIME,
      questionsAnswered: 0,
      currentProblem: generateProblem(grade),
      feedback: null,
      grade,
    };
  });

  const setGrade = useCallback((grade: number) => {
    localStorage.setItem("mathBlitzGrade", grade.toString());
    setGameState((prev) => ({
      ...prev,
      grade,
      currentProblem: generateProblem(grade),
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeLeft: INITIAL_TIME,
      questionsAnswered: 0,
      currentProblem: generateProblem(prev.grade),
      feedback: null,
    }));
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;

      const isCorrect = answer === prev.currentProblem.answer;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const streakBonus = isCorrect ? Math.floor(prev.streak * STREAK_MULTIPLIER) : 0;
      const gradeBonus = isCorrect ? prev.grade : 0; // Bonus points for higher grades
      const basePoints = isCorrect ? 10 : 0;
      const newScore = prev.score + basePoints + streakBonus + gradeBonus;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const newTimeLeft = isCorrect
        ? Math.min(prev.timeLeft + TIME_BONUS, INITIAL_TIME)
        : prev.timeLeft;

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        maxStreak: newMaxStreak,
        timeLeft: newTimeLeft,
        questionsAnswered: prev.questionsAnswered + 1,
        currentProblem: generateProblem(prev.grade),
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
    setGrade,
  };
};
