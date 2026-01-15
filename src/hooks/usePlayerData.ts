import { useState, useCallback, useEffect } from "react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface PlayerData {
  name: string;
  avatarId: number;
  level: number;
  xp: number;
  totalXp: number;
  totalCorrect: number;
  totalAnswered: number;
  maxStreak: number;
  achievements: Achievement[];
  createdAt: number;
}

const AVATARS = [
  { id: 1, emoji: "🧙‍♂️", name: "Pháp sư" },
  { id: 2, emoji: "⚔️", name: "Hiệp sĩ" },
  { id: 3, emoji: "🧝‍♀️", name: "Tiên nữ" },
  { id: 4, emoji: "🐉", name: "Rồng con" },
  { id: 5, emoji: "🦊", name: "Cáo thần" },
  { id: 6, emoji: "🦁", name: "Sư tử" },
  { id: 7, emoji: "🦅", name: "Đại bàng" },
  { id: 8, emoji: "🐺", name: "Sói" },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "first_correct", name: "Khởi đầu", description: "Trả lời đúng câu đầu tiên", icon: "🌟", unlocked: false },
  { id: "streak_5", name: "Combo 5", description: "Đạt 5 câu đúng liên tiếp", icon: "🔥", unlocked: false },
  { id: "streak_10", name: "Combo 10", description: "Đạt 10 câu đúng liên tiếp", icon: "💥", unlocked: false },
  { id: "streak_20", name: "Siêu combo", description: "Đạt 20 câu đúng liên tiếp", icon: "⚡", unlocked: false },
  { id: "correct_50", name: "Học trò chăm", description: "Trả lời đúng 50 câu", icon: "📚", unlocked: false },
  { id: "correct_100", name: "Thiên tài", description: "Trả lời đúng 100 câu", icon: "🎓", unlocked: false },
  { id: "correct_500", name: "Bậc thầy", description: "Trả lời đúng 500 câu", icon: "👑", unlocked: false },
  { id: "level_5", name: "Lên cấp", description: "Đạt cấp độ 5", icon: "⬆️", unlocked: false },
  { id: "level_10", name: "Chiến binh", description: "Đạt cấp độ 10", icon: "🛡️", unlocked: false },
  { id: "level_20", name: "Anh hùng", description: "Đạt cấp độ 20", icon: "🏆", unlocked: false },
  { id: "score_500", name: "Điểm cao", description: "Đạt 500 điểm trong 1 ván", icon: "💎", unlocked: false },
  { id: "score_1000", name: "Huyền thoại", description: "Đạt 1000 điểm trong 1 ván", icon: "🌈", unlocked: false },
];

// XP required for each level (exponential growth)
const getXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const getDefaultPlayer = (): PlayerData => ({
  name: "",
  avatarId: 1,
  level: 1,
  xp: 0,
  totalXp: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  maxStreak: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
  createdAt: Date.now(),
});

export const usePlayerData = () => {
  const [player, setPlayer] = useState<PlayerData>(() => {
    const saved = localStorage.getItem("mathBlitzPlayer");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default achievements in case new ones were added
      const mergedAchievements = DEFAULT_ACHIEVEMENTS.map(defaultAch => {
        const existing = parsed.achievements?.find((a: Achievement) => a.id === defaultAch.id);
        return existing || defaultAch;
      });
      return { ...getDefaultPlayer(), ...parsed, achievements: mergedAchievements };
    }
    return getDefaultPlayer();
  });

  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (player.name) {
      localStorage.setItem("mathBlitzPlayer", JSON.stringify(player));
    }
  }, [player]);

  const createPlayer = useCallback((name: string, avatarId: number) => {
    setPlayer(prev => ({
      ...prev,
      name,
      avatarId,
      createdAt: Date.now(),
    }));
  }, []);

  const addXp = useCallback((amount: number) => {
    setPlayer(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      const newTotalXp = prev.totalXp + amount;

      // Check for level ups
      while (newXp >= getXpForLevel(newLevel)) {
        newXp -= getXpForLevel(newLevel);
        newLevel++;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalXp: newTotalXp,
      };
    });
  }, []);

  const updateStats = useCallback((correct: number, total: number, streak: number, score: number) => {
    setPlayer(prev => {
      const newTotalCorrect = prev.totalCorrect + correct;
      const newTotalAnswered = prev.totalAnswered + total;
      const newMaxStreak = Math.max(prev.maxStreak, streak);

      // Check achievements
      const unlocked: Achievement[] = [];
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.unlocked) return ach;

        let shouldUnlock = false;
        switch (ach.id) {
          case "first_correct":
            shouldUnlock = newTotalCorrect >= 1;
            break;
          case "streak_5":
            shouldUnlock = newMaxStreak >= 5;
            break;
          case "streak_10":
            shouldUnlock = newMaxStreak >= 10;
            break;
          case "streak_20":
            shouldUnlock = newMaxStreak >= 20;
            break;
          case "correct_50":
            shouldUnlock = newTotalCorrect >= 50;
            break;
          case "correct_100":
            shouldUnlock = newTotalCorrect >= 100;
            break;
          case "correct_500":
            shouldUnlock = newTotalCorrect >= 500;
            break;
          case "level_5":
            shouldUnlock = prev.level >= 5;
            break;
          case "level_10":
            shouldUnlock = prev.level >= 10;
            break;
          case "level_20":
            shouldUnlock = prev.level >= 20;
            break;
          case "score_500":
            shouldUnlock = score >= 500;
            break;
          case "score_1000":
            shouldUnlock = score >= 1000;
            break;
        }

        if (shouldUnlock) {
          const unlockedAch = { ...ach, unlocked: true, unlockedAt: Date.now() };
          unlocked.push(unlockedAch);
          return unlockedAch;
        }
        return ach;
      });

      if (unlocked.length > 0) {
        setNewAchievements(unlocked);
      }

      return {
        ...prev,
        totalCorrect: newTotalCorrect,
        totalAnswered: newTotalAnswered,
        maxStreak: newMaxStreak,
        achievements: updatedAchievements,
      };
    });
  }, []);

  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  const resetPlayer = useCallback(() => {
    localStorage.removeItem("mathBlitzPlayer");
    setPlayer(getDefaultPlayer());
  }, []);

  const xpForCurrentLevel = getXpForLevel(player.level);
  const xpProgress = player.xp / xpForCurrentLevel;

  return {
    player,
    createPlayer,
    addXp,
    updateStats,
    newAchievements,
    clearNewAchievements,
    resetPlayer,
    xpForCurrentLevel,
    xpProgress,
    avatars: AVATARS,
  };
};
