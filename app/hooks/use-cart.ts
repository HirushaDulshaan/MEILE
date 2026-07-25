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
                    return toast.error("Item already in your shopping bag!", {
                        duration: 3000,
                        style: {
                            borderRadius: '100px',
                            background: '#0f172a', // Premium Slate-900 Dark
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '12px 20px',
                            border: '1px solid #334155',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        },
                        iconTheme: {
                            primary: '#ef4444', // Red Cross Icon
                            secondary: '#0f172a',
                        },
                    });
                }

                set({ items: [...get().items, data] });

                toast.success(`Added ${data.name.substring(0, 15)}... to bag`, {
                    duration: 3000,
                    style: {
                        borderRadius: '100px',
                        background: '#0f172a', // Premium Slate-900 Dark
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '12px 20px',
                        border: '1px solid #334155',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    },
                    iconTheme: {
                        primary: '#22c55e', // Vibrant Green Checkmark
                        secondary: '#0f172a',
                    },
                });
            },
            removeItem: (id: number, size: string) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.id === id && item.size === size)
                    ),
                });
                toast.success("Item removed from bag", {
                    duration: 2500,
                    style: {
                        borderRadius: '100px',
                        background: '#0f172a',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '12px 20px',
                        border: '1px solid #334155',
                    },
                    iconTheme: {
                        primary: '#3b82f6', // Blue Icon for Removal
                        secondary: '#0f172a',
                    },
                });
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