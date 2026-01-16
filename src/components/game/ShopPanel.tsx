import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, ShoppingBag, Sparkles, Check } from "lucide-react";
import type { ShopItem, Pet, OwnedItem } from "@/hooks/useShopData";

interface ShopPanelProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  shopItems: ShopItem[];
  pets: Pet[];
  ownedItems: OwnedItem[];
  ownedPets: string[];
  equippedPet: string | null;
  onBuyItem: (itemId: string) => boolean;
  onBuyPet: (petId: string) => boolean;
  onEquipPet: (petId: string | null) => void;
}

export const ShopPanel = ({
  isOpen,
  onClose,
  coins,
  shopItems,
  pets,
  ownedItems,
  ownedPets,
  equippedPet,
  onBuyItem,
  onBuyPet,
  onEquipPet,
}: ShopPanelProps) => {
  const getItemQuantity = (itemId: string) => {
    return ownedItems.find((i) => i.itemId === itemId)?.quantity || 0;
  };

  const handleBuyItem = (itemId: string) => {
    const success = onBuyItem(itemId);
    if (!success) {
      // Could show a toast here
    }
  };

  const handleBuyPet = (petId: string) => {
    const success = onBuyPet(petId);
    if (!success) {
      // Could show a toast here
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-gradient-to-br from-card via-card to-purple-900/20 rounded-3xl border border-purple-500/30 shadow-2xl z-50 max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">Cửa hàng</h2>
                  <p className="text-xs text-muted-foreground">Mua vật phẩm & thú cưng</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.div 
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-xl border border-yellow-500/30"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">{coins}</span>
                </motion.div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {/* Power-ups Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  POWER-UPS
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {shopItems.map((item) => {
                    const quantity = getItemQuantity(item.id);
                    const canAfford = coins >= item.price;
                    
                    return (
                      <motion.div
                        key={item.id}
                        className={`relative p-4 rounded-2xl border-2 ${
                          canAfford
                            ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50"
                            : "bg-muted/30 border-border/30 opacity-60"
                        } transition-colors`}
                        whileHover={canAfford ? { scale: 1.02 } : {}}
                        whileTap={canAfford ? { scale: 0.98 } : {}}
                      >
                        {quantity > 0 && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            x{quantity}
                          </div>
                        )}
                        
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                        
                        <motion.button
                          onClick={() => handleBuyItem(item.id)}
                          disabled={!canAfford}
                          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-sm ${
                            canAfford
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          } transition-opacity`}
                          whileHover={canAfford ? { scale: 1.02 } : {}}
                          whileTap={canAfford ? { scale: 0.98 } : {}}
                        >
                          <Coins className="w-4 h-4" />
                          {item.price}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Pets Section */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  🐾 THÚ CƯNG
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {pets.map((pet) => {
                    const owned = ownedPets.includes(pet.id);
                    const equipped = equippedPet === pet.id;
                    const canAfford = coins >= pet.price;
                    
                    return (
                      <motion.div
                        key={pet.id}
                        className={`relative p-4 rounded-2xl border-2 ${
                          equipped
                            ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
                            : owned
                            ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30"
                            : canAfford
                            ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 hover:border-cyan-500/50"
                            : "bg-muted/30 border-border/30 opacity-60"
                        } transition-colors`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {equipped && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Đang dùng
                          </div>
                        )}
                        
                        <motion.div 
                          className="text-4xl mb-2"
                          animate={equipped ? { 
                            y: [0, -5, 0],
                            rotate: [0, 5, -5, 0]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {pet.emoji}
                        </motion.div>
                        <h4 className="font-bold text-foreground text-sm">{pet.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{pet.description}</p>
                        <div className="text-xs font-medium text-cyan-400 mb-3">{pet.bonus}</div>
                        
                        {owned ? (
                          <motion.button
                            onClick={() => onEquipPet(equipped ? null : pet.id)}
                            className={`w-full py-2 rounded-xl font-medium text-sm ${
                              equipped
                                ? "bg-muted text-muted-foreground"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            } transition-colors`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {equipped ? "Tháo ra" : "Trang bị"}
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => handleBuyPet(pet.id)}
                            disabled={!canAfford}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-sm ${
                              canAfford
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                            } transition-opacity`}
                            whileHover={canAfford ? { scale: 1.02 } : {}}
                            whileTap={canAfford ? { scale: 0.98 } : {}}
                          >
                            <Coins className="w-4 h-4" />
                            {pet.price}
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
