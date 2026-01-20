import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_id: number | null;
  level: number | null;
  high_score: number | null;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  avatars: { id: number; emoji: string; name: string }[];
}

export const Leaderboard = ({ isOpen, onClose, currentUserId, avatars }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, avatar_id, level, high_score, user_id")
      .order("high_score", { ascending: false })
      .limit(10);

    if (!error && data) {
      setEntries(data.map(d => ({
        id: d.user_id,
        name: d.name,
        avatar_id: d.avatar_id,
        level: d.level,
        high_score: d.high_score
      })));
    }
    setLoading(false);
  };

  const getAvatarEmoji = (avatarId: number | null) => {
    const avatar = avatars.find(a => a.id === avatarId);
    return avatar?.emoji || "🧙‍♂️";
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-bold text-sm w-6 text-center">{index + 1}</span>;
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-500/30 to-orange-500/30 border-yellow-500/50";
      case 1:
        return "from-gray-400/20 to-slate-400/20 border-gray-400/40";
      case 2:
        return "from-amber-600/20 to-orange-600/20 border-amber-600/40";
      default:
        return "from-card to-card border-border/50";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-b from-card to-card/95 rounded-2xl border border-primary/30 w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 border-b border-yellow-500/30">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-7 h-7 text-yellow-400" />
                <h2 className="text-xl font-bold text-foreground">Bảng Xếp Hạng</h2>
                <Trophy className="w-7 h-7 text-yellow-400" />
              </div>
              <button
                onClick={onClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa có dữ liệu xếp hạng</p>
                  <p className="text-sm mt-1">Hãy đăng nhập và chơi để ghi điểm!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${getRankStyle(index)} border ${
                        currentUserId === entry.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 flex justify-center">
                        {getRankIcon(index)}
                      </div>

                      {/* Avatar */}
                      <div className="text-2xl flex-shrink-0">
                        {getAvatarEmoji(entry.avatar_id)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">
                            {entry.name}
                          </span>
                          {currentUserId === entry.id && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Level {entry.level || 1}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-bold text-yellow-400">
                          {entry.high_score?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">điểm</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
