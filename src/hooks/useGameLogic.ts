import { useState, useEffect, useCallback } from "react";

type Operator = "+" | "-" | "×" | "÷";

interface Problem {
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
}

interface BossState {
  bossId: string | null;
  currentHp: number;
  maxHp: number;
  reward: number;
  isAttacking: boolean;
  damageDealt: number;
}

interface GameState {
  status: "idle" | "playing" | "gameOver" | "bossVictory" | "bossDefeat";
  mode: "timed" | "practice" | "boss";
  score: number;
  streak: number;
  maxStreak: number;
  highScore: number;
  timeLeft: number;
  questionsAnswered: number;
  currentProblem: Problem;
  feedback: "correct" | "wrong" | null;
  grade: number;
  boss: BossState;
}

const INITIAL_TIME = 10;
const TIME_BONUS = 2;
const STREAK_MULTIPLIER = 0.5;

const generateProblem = (grade: number): Problem => {
  let num1: number, num2: number, answer: number;
  let operator: Operator;

  // Kiến thức toán theo chương trình Việt Nam
  switch (grade) {
    case 1:
      // Lớp 1: Cộng trừ trong phạm vi 10
      operator = Math.random() > 0.5 ? "+" : "-";
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * (10 - num1)) + 1;
        answer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 9) + 2;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        answer = num1 - num2;
      }
      break;

    case 2:
      // Lớp 2: Cộng trừ trong phạm vi 100, bảng nhân 2, 3, 4, 5
      operator = ["+", "-", "×"][Math.floor(Math.random() * 3)] as Operator;
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * (100 - num1)) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 99) + 2;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else {
        num1 = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
      }
      break;

    case 3:
      // Lớp 3: Bảng nhân chia đến 9, cộng trừ trong 1000
      operator = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)] as Operator;
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 500) + 1;
        num2 = Math.floor(Math.random() * (1000 - num1)) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 999) + 2;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = Math.floor(Math.random() * 9) + 2;
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 9) + 2;
        num1 = num2 * answer;
      }
      break;

    case 4:
      // Lớp 4: Nhân chia số có nhiều chữ số, cộng trừ đến 100000
      operator = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)] as Operator;
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 50000) + 1;
        num2 = Math.floor(Math.random() * 50000) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 99999) + 2;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = Math.floor(Math.random() * 99) + 2;
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 99) + 2;
        num1 = num2 * answer;
      }
      break;

    case 5:
      // Lớp 5: Số thập phân đơn giản, nhân chia số lớn
      operator = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)] as Operator;
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 500) + 100;
        num2 = Math.floor(Math.random() * 500) + 100;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = Math.floor(Math.random() * 99) + 10;
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 99) + 10;
        num1 = num2 * answer;
      }
      break;

    case 6:
      // Lớp 6: Số nguyên âm, phép tính với số âm
      operator = ["+", "-", "×"][Math.floor(Math.random() * 3)] as Operator;
      const useNeg6 = Math.random() > 0.5;
      if (operator === "+") {
        num1 = useNeg6 ? -(Math.floor(Math.random() * 20) + 1) : Math.floor(Math.random() * 30) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = Math.floor(Math.random() * 30) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 - num2;
      } else {
        num1 = useNeg6 ? -(Math.floor(Math.random() * 10) + 1) : Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = num1 * num2;
      }
      break;

    case 7:
      // Lớp 7: Số hữu tỉ, phép tính với số âm phức tạp
      operator = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)] as Operator;
      const useNeg7 = Math.random() > 0.4;
      if (operator === "+") {
        num1 = useNeg7 ? -(Math.floor(Math.random() * 50) + 1) : Math.floor(Math.random() * 50) + 1;
        num2 = useNeg7 ? -(Math.floor(Math.random() * 50) + 1) : Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = useNeg7 ? -(Math.floor(Math.random() * 50) + 1) : Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 70) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = useNeg7 ? -(Math.floor(Math.random() * 12) + 1) : Math.floor(Math.random() * 15) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = useNeg7 ? -(Math.floor(Math.random() * 12) + 1) : Math.floor(Math.random() * 12) + 2;
        num1 = num2 * answer;
      }
      break;

    case 8:
      // Lớp 8: Đa thức, phép tính phức tạp
      operator = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)] as Operator;
      const useNeg8 = Math.random() > 0.3;
      if (operator === "+") {
        num1 = useNeg8 ? -(Math.floor(Math.random() * 100) + 1) : Math.floor(Math.random() * 100) + 1;
        num2 = useNeg8 ? -(Math.floor(Math.random() * 100) + 1) : Math.floor(Math.random() * 100) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = useNeg8 ? -(Math.floor(Math.random() * 100) + 1) : Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 150) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = useNeg8 ? -(Math.floor(Math.random() * 15) + 1) : Math.floor(Math.random() * 20) + 2;
        num2 = Math.floor(Math.random() * 15) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 15) + 2;
        answer = useNeg8 ? -(Math.floor(Math.random() * 15) + 1) : Math.floor(Math.random() * 15) + 2;
        num1 = num2 * answer;
      }
      break;

    case 9:
      // Lớp 9: Căn bậc hai, phép tính nâng cao
      operator = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)] as Operator;
      const useNeg9 = Math.random() > 0.25;
      if (operator === "+") {
        num1 = useNeg9 ? -(Math.floor(Math.random() * 150) + 1) : Math.floor(Math.random() * 200) + 1;
        num2 = useNeg9 ? -(Math.floor(Math.random() * 150) + 1) : Math.floor(Math.random() * 200) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = useNeg9 ? -(Math.floor(Math.random() * 150) + 1) : Math.floor(Math.random() * 200) + 1;
        num2 = Math.floor(Math.random() * 200) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = useNeg9 ? -(Math.floor(Math.random() * 20) + 1) : Math.floor(Math.random() * 25) + 2;
        num2 = Math.floor(Math.random() * 20) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 20) + 2;
        answer = useNeg9 ? -(Math.floor(Math.random() * 20) + 1) : Math.floor(Math.random() * 20) + 2;
        num1 = num2 * answer;
      }
      break;

    case 10:
    default:
      // Lớp 10: Toán nâng cao, số lớn và phức tạp
      operator = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)] as Operator;
      const useNeg10 = Math.random() > 0.2;
      if (operator === "+") {
        num1 = useNeg10 ? -(Math.floor(Math.random() * 300) + 1) : Math.floor(Math.random() * 300) + 1;
        num2 = useNeg10 ? -(Math.floor(Math.random() * 300) + 1) : Math.floor(Math.random() * 300) + 1;
        answer = num1 + num2;
      } else if (operator === "-") {
        num1 = useNeg10 ? -(Math.floor(Math.random() * 200) + 1) : Math.floor(Math.random() * 300) + 1;
        num2 = Math.floor(Math.random() * 300) + 1;
        answer = num1 - num2;
      } else if (operator === "×") {
        num1 = useNeg10 ? -(Math.floor(Math.random() * 25) + 1) : Math.floor(Math.random() * 30) + 2;
        num2 = Math.floor(Math.random() * 25) + 2;
        answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 25) + 2;
        answer = useNeg10 ? -(Math.floor(Math.random() * 25) + 1) : Math.floor(Math.random() * 25) + 2;
        num1 = num2 * answer;
      }
      break;
  }

  return { num1, num2, operator, answer };
};

const BOSS_TIME = 50;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedHighScore = localStorage.getItem("mathBlitzHighScore");
    const savedGrade = localStorage.getItem("mathBlitzGrade");
    const grade = savedGrade ? parseInt(savedGrade, 10) : 1;
    return {
      status: "idle",
      mode: "timed",
      score: 0,
      streak: 0,
      maxStreak: 0,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0,
      timeLeft: INITIAL_TIME,
      questionsAnswered: 0,
      currentProblem: generateProblem(grade),
      feedback: null,
      grade,
      boss: { bossId: null, currentHp: 0, maxHp: 0, reward: 0, isAttacking: false, damageDealt: 0 },
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

  const startGame = useCallback((mode: "timed" | "practice" = "timed") => {
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      mode,
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeLeft: INITIAL_TIME,
      questionsAnswered: 0,
      currentProblem: generateProblem(prev.grade),
      feedback: null,
      boss: { bossId: null, currentHp: 0, maxHp: 0, reward: 0, isAttacking: false, damageDealt: 0 },
    }));
  }, []);

  const startBossBattle = useCallback((bossId: string, maxHp: number, reward: number) => {
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      mode: "boss",
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeLeft: BOSS_TIME,
      questionsAnswered: 0,
      currentProblem: generateProblem(prev.grade),
      feedback: null,
      boss: { bossId, currentHp: maxHp, maxHp, reward, isAttacking: false, damageDealt: 0 },
    }));
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;

      const isCorrect = answer === prev.currentProblem.answer;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const streakBonus = isCorrect ? Math.floor(prev.streak * STREAK_MULTIPLIER) : 0;
      const gradeBonus = isCorrect ? prev.grade : 0;
      const basePoints = isCorrect ? 10 : 0;
      const newScore = prev.score + basePoints + streakBonus + gradeBonus;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);

      // Boss mode logic
      if (prev.mode === "boss" && isCorrect) {
        const damage = 1 + Math.floor(prev.streak / 3);
        const newBossHp = Math.max(0, prev.boss.currentHp - damage);
        
        if (newBossHp <= 0) {
          return {
            ...prev,
            status: "bossVictory",
            score: newScore,
            streak: newStreak,
            maxStreak: newMaxStreak,
            questionsAnswered: prev.questionsAnswered + 1,
            feedback: "correct",
            boss: { ...prev.boss, currentHp: 0, isAttacking: true, damageDealt: damage },
          };
        }
        
        return {
          ...prev,
          score: newScore,
          streak: newStreak,
          maxStreak: newMaxStreak,
          questionsAnswered: prev.questionsAnswered + 1,
          currentProblem: generateProblem(prev.grade),
          feedback: "correct",
          boss: { ...prev.boss, currentHp: newBossHp, isAttacking: true, damageDealt: damage },
        };
      }

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
    if (gameState.status !== "playing" || gameState.mode === "practice") return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.timeLeft - 0.1;
        if (newTime <= 0) {
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status, gameState.mode]);

  useEffect(() => {
    if (gameState.status === "playing" && gameState.mode === "timed" && gameState.timeLeft <= 0) {
      endGame();
    }
    if (gameState.status === "playing" && gameState.mode === "boss" && gameState.timeLeft <= 0) {
      setGameState((prev) => ({ ...prev, status: "bossDefeat" }));
    }
  }, [gameState.timeLeft, gameState.status, gameState.mode, endGame]);

  // Reset boss attack animation
  useEffect(() => {
    if (gameState.boss.isAttacking) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, boss: { ...prev.boss, isAttacking: false } }));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameState.boss.isAttacking]);

  return {
    gameState,
    startGame,
    startBossBattle,
    submitAnswer,
    setGrade,
    endGame,
  };
};
