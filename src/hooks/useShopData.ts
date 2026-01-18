import { useState, useCallback, useEffect } from "react";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  type: "powerup" | "pet" | "cosmetic";
  effect?: {
    type: "time_boost" | "score_multiplier" | "combo_shield" | "xp_boost";
    value: number;
    duration?: number; // in games
  };
}

export interface OwnedItem {
  itemId: string;
  quantity: number;
  equipped?: boolean;
}

export interface Pet {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
  bonus: string;
  bonusType: "xp" | "time" | "score";
  bonusValue: number;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "time_boost",
    name: "Thời gian+",
    description: "+3 giây mỗi câu đúng",
    icon: "⏰",
    price: 50,
    type: "powerup",
    effect: { type: "time_boost", value: 3, duration: 1 },
  },
  {
    id: "score_x2",
    name: "Điểm x2",
    description: "Nhân đôi điểm trong 1 ván",
    icon: "💰",
    price: 100,
    type: "powerup",
    effect: { type: "score_multiplier", value: 2, duration: 1 },
  },
  {
    id: "combo_shield",
    name: "Khiên Combo",
    description: "Bảo vệ combo khi sai 1 lần",
    icon: "🛡️",
    price: 75,
    type: "powerup",
    effect: { type: "combo_shield", value: 1, duration: 1 },
  },
  {
    id: "xp_boost",
    name: "XP x1.5",
    description: "Tăng 50% XP nhận được",
    icon: "✨",
    price: 80,
    type: "powerup",
    effect: { type: "xp_boost", value: 1.5, duration: 1 },
  },
];

const PETS: Pet[] = [
  {
    id: "dragon",
    name: "Rồng Con",
    emoji: "🐲",
    description: "+10% XP mỗi ván",
    price: 200,
    bonus: "+10% XP",
    bonusType: "xp",
    bonusValue: 1.1,
  },
  {
    id: "phoenix",
    name: "Phượng Hoàng",
    emoji: "🦅",
    description: "+1 giây mỗi câu đúng",
    price: 250,
    bonus: "+1s/câu",
    bonusType: "time",
    bonusValue: 1,
  },
  {
    id: "unicorn",
    name: "Kỳ Lân",
    emoji: "🦄",
    description: "+5% điểm mỗi ván",
    price: 300,
    bonus: "+5% điểm",
    bonusType: "score",
    bonusValue: 1.05,
  },
  {
    id: "cat",
    name: "Mèo Thần",
    emoji: "🐱",
    description: "Combo +1 mỗi 5 câu đúng",
    price: 150,
    bonus: "Combo+",
    bonusType: "score",
    bonusValue: 1,
  },
  {
    id: "owl",
    name: "Cú Mèo",
    emoji: "🦉",
    description: "+15% XP ban đêm",
    price: 180,
    bonus: "+15% XP đêm",
    bonusType: "xp",
    bonusValue: 1.15,
  },
  {
    id: "fox",
    name: "Cáo Lửa",
    emoji: "🦊",
    description: "+2 giây khi streak ≥5",
    price: 220,
    bonus: "+2s streak",
    bonusType: "time",
    bonusValue: 2,
  },
];

interface ShopState {
  coins: number;
  ownedItems: OwnedItem[];
  ownedPets: string[];
  equippedPet: string | null;
  activePowerups: string[];
}

const getDefaultShopState = (): ShopState => ({
  coins: 100, // Starting coins
  ownedItems: [],
  ownedPets: [],
  equippedPet: null,
  activePowerups: [],
});

export const useShopData = () => {
  const [shopState, setShopState] = useState<ShopState>(() => {
    const saved = localStorage.getItem("mathQuestShop");
    if (saved) {
      return { ...getDefaultShopState(), ...JSON.parse(saved) };
    }
    return getDefaultShopState();
  });

  useEffect(() => {
    localStorage.setItem("mathQuestShop", JSON.stringify(shopState));
  }, [shopState]);

  const addCoins = useCallback((amount: number) => {
    setShopState((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  const buyItem = useCallback((itemId: string): boolean => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return false;

    if (shopState.coins < item.price) return false;

    setShopState((prev) => {
      const existingItem = prev.ownedItems.find((i) => i.itemId === itemId);
      const newOwnedItems = existingItem
        ? prev.ownedItems.map((i) =>
            i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev.ownedItems, { itemId, quantity: 1 }];

      return {
        ...prev,
        coins: prev.coins - item.price,
        ownedItems: newOwnedItems,
      };
    });

    return true;
  }, [shopState.coins]);

  const buyPet = useCallback((petId: string): boolean => {
    const pet = PETS.find((p) => p.id === petId);
    if (!pet) return false;

    if (shopState.coins < pet.price) return false;
    if (shopState.ownedPets.includes(petId)) return false;

    setShopState((prev) => ({
      ...prev,
      coins: prev.coins - pet.price,
      ownedPets: [...prev.ownedPets, petId],
      equippedPet: prev.equippedPet || petId, // Auto-equip first pet
    }));

    return true;
  }, [shopState.coins, shopState.ownedPets]);

  const equipPet = useCallback((petId: string | null) => {
    if (petId && !shopState.ownedPets.includes(petId)) return;
    setShopState((prev) => ({ ...prev, equippedPet: petId }));
  }, [shopState.ownedPets]);

  const useItem = useCallback((itemId: string): boolean => {
    const ownedItem = shopState.ownedItems.find((i) => i.itemId === itemId);
    if (!ownedItem || ownedItem.quantity <= 0) return false;

    setShopState((prev) => ({
      ...prev,
      ownedItems: prev.ownedItems.map((i) =>
        i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ),
      activePowerups: [...prev.activePowerups, itemId],
    }));

    return true;
  }, [shopState.ownedItems]);

  const clearActivePowerups = useCallback(() => {
    setShopState((prev) => ({ ...prev, activePowerups: [] }));
  }, []);

  const getItemQuantity = useCallback(
    (itemId: string): number => {
      const item = shopState.ownedItems.find((i) => i.itemId === itemId);
      return item?.quantity || 0;
    },
    [shopState.ownedItems]
  );

  const getEquippedPet = useCallback((): Pet | null => {
    if (!shopState.equippedPet) return null;
    return PETS.find((p) => p.id === shopState.equippedPet) || null;
  }, [shopState.equippedPet]);

  const getActivePowerupEffects = useCallback(() => {
    return shopState.activePowerups
      .map((id) => SHOP_ITEMS.find((i) => i.id === id)?.effect)
      .filter(Boolean);
  }, [shopState.activePowerups]);

  const spendCoins = useCallback((amount: number): boolean => {
    if (shopState.coins < amount) return false;
    setShopState((prev) => ({
      ...prev,
      coins: prev.coins - amount,
    }));
    return true;
  }, [shopState.coins]);

  const addItem = useCallback((itemId: string) => {
    setShopState((prev) => {
      const existingItem = prev.ownedItems.find((i) => i.itemId === itemId);
      const newOwnedItems = existingItem
        ? prev.ownedItems.map((i) =>
            i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev.ownedItems, { itemId, quantity: 1 }];

      return {
        ...prev,
        ownedItems: newOwnedItems,
      };
    });
  }, []);

  const addPet = useCallback((petId: string) => {
    if (shopState.ownedPets.includes(petId)) return;
    setShopState((prev) => ({
      ...prev,
      ownedPets: [...prev.ownedPets, petId],
      equippedPet: prev.equippedPet || petId,
    }));
  }, [shopState.ownedPets]);

  return {
    shopState,
    shopItems: SHOP_ITEMS,
    pets: PETS,
    addCoins,
    spendCoins,
    addItem,
    addPet,
    buyItem,
    buyPet,
    equipPet,
    useItem,
    clearActivePowerups,
    getItemQuantity,
    getEquippedPet,
    getActivePowerupEffects,
  };
};
