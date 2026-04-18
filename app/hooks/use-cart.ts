import { create } from "zustand"; // '/react' කෑල්ල අවශ්‍ය නැහැ
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    size: string;
    qty: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: number, size: string) => void;
    updateQty: (id: number, size: string, action: 'plus' | 'minus') => void;
    clearCart: () => void;
}

// Hirusha, මෙතන 'create<CartStore>()' කියලා brackets දාලා ඊට පස්සේ persist එක පටන් ගන්න
export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (data: CartItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(
                    (item) => item.id === data.id && item.size === data.size
                );

                if (existingItem) {
                    return alert("Item already in cart! 🛒");
                }

                set({ items: [...get().items, data] });
                alert("Added to cart successfully! 🚀");
            },
            removeItem: (id: number, size: string) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.id === id && item.size === size)
                    ),
                });
            },
            updateQty: (id: number, size: string, action: 'plus' | 'minus') => {
                const currentItems = get().items;
                const updatedItems = currentItems.map((item) => {
                    if (item.id === id && item.size === size) {
                        const newQty = action === 'plus' ? item.qty + 1 : item.qty - 1;
                        // Qty එක 1ට වඩා අඩු වෙන්න දෙන්න එපා
                        return { ...item, qty: newQty < 1 ? 1 : newQty };
                    }
                    return item;
                });
                set({ items: updatedItems });
            },
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);