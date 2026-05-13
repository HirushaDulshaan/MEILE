import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    size: string;
    qty: number;
    sizeId: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: number, size: string) => void;
    updateQty: (id: number, size: string, action: 'plus' | 'minus') => void;
    clearCart: () => void;
}

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
                    return toast.error("This item is already in your cart! 🛒", {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                            fontSize: '12px'
                        }
                    });
                }

                set({ items: [...get().items, data] });
                toast.success(`${data.name} added to cart! 🚀`, {
                    duration: 3000,
                    icon: '🛍️',
                });
            },
            removeItem: (id: number, size: string) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.id === id && item.size === size)
                    ),
                });
                toast.success("Item removed from cart");
            },
            updateQty: (id: number, size: string, action: 'plus' | 'minus') => {
                const currentItems = get().items;
                const updatedItems = currentItems.map((item) => {
                    if (item.id === id && item.size === size) {
                        const newQty = action === 'plus' ? item.qty + 1 : item.qty - 1;
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