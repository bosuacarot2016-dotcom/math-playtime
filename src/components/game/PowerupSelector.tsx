import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import type { ShopItem, OwnedItem } from "@/hooks/useShopData";

interface PowerupSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  shopItems: ShopItem[];
  ownedItems: OwnedItem[];
  activePowerups: string[];
  onUseItem: (itemId: string) => boolean;
}

export const PowerupSelector = ({
  isOpen,
  onClose,
  shopItems,
  ownedItems,
  activePowerups,
  onUseItem,
}: PowerupSelectorProps) => {
  const getItemQuantity = (itemId: string) => {
    return ownedItems.find((i) => i.itemId === itemId)?.quantity || 0;
  };

  const handleUseItem = (itemId: string) => {
    const success = onUseItem(itemId);
    if (success) {
      // Item used successfully
    }
  };

  const availableItems = shopItems.filter((item) => getItemQuantity(item.id) > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-gradient-to-br from-card via-card to-purple-900/20 rounded-2xl border border-purple-500/30 shadow-2xl z-50 p-4"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-foreground">Chọn Power-up</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {availableItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Bạn chưa có power-up nào. Hãy mua tại cửa hàng! 🛒
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availableItems.map((item) => {
                  const quantity = getItemQuantity(item.id);
                  const isActive = activePowerups.includes(item.id);

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleUseItem(item.id)}
                      disabled={isActive}
                      className={`relative p-3 rounded-xl border-2 text-left ${
                        isActive
                          ? "bg-green-500/20 border-green-500/50"
                          : "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50"
                      } transition-colors`}
                      whileHover={!isActive ? { scale: 1.03 } : {}}
                      whileTap={!isActive ? { scale: 0.97 } : {}}
                    >
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        x{quantity}
                      </div>

                      <div className="text-2xl mb-1">{item.icon}</div>
                      <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>

                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                          <span className="text-green-400 font-bold text-sm">Đang dùng ✓</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
