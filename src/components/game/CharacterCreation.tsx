import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";

interface Avatar {
  id: number;
  emoji: string;
  name: string;
}

interface CharacterCreationProps {
  avatars: Avatar[];
  onCreateCharacter: (name: string, avatarId: number) => void;
}

export const CharacterCreation = ({ avatars, onCreateCharacter }: CharacterCreationProps) => {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateCharacter(name.trim(), selectedAvatar);
    }
  };

  return (
    <motion.div
      className="text-center max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-lg shadow-purple-500/30 mb-6"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <Wand2 className="w-10 h-10 text-white" />
      </motion.div>

      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Tạo nhân vật
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-sm mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Chọn avatar và đặt tên cho nhân vật của bạn
      </motion.p>

      <form onSubmit={handleSubmit}>
        <motion.div
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="text-sm text-muted-foreground mb-2 block">Tên nhân vật</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn..."
            maxLength={20}
            className="w-full text-center font-bold text-xl bg-card/80 border-2 border-purple-500/50 rounded-2xl py-4 px-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
          />
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <label className="text-sm text-muted-foreground mb-3 block">Chọn Avatar</label>
          <div className="grid grid-cols-4 gap-3">
            {avatars.map((avatar) => (
              <motion.button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedAvatar === avatar.id
                    ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/30"
                    : "border-border/50 bg-card/50 hover:border-purple-500/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-3xl mb-1">{avatar.emoji}</span>
                <span className="text-xs text-muted-foreground">{avatar.name}</span>
                {selectedAvatar === avatar.id && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={!name.trim()}
          className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:shadow-none transition-all"
          whileHover={{ scale: name.trim() ? 1.02 : 1 }}
          whileTap={{ scale: name.trim() ? 0.98 : 1 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Sparkles className="w-6 h-6" />
          Bắt đầu phiêu lưu!
        </motion.button>
      </form>
    </motion.div>
  );
};
