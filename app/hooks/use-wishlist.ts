import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (data: WishlistItem) => void;
    removeItem: (id: string) => void;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (data: WishlistItem) => {
                const currentItems = get().items;
                const isExisting = currentItems.find((item) => item.id === data.id);

                if (isExisting) {
                    return toast.error("Already in Wishlist! ❤️");
                }

                set({ items: [...get().items, data] });
                toast.success("Added to Wishlist! ✨", { icon: '❤️' });
            },
            removeItem: (id: string) => {
                set({ items: get().items.filter((item) => item.id !== id) });
                toast.success("Removed from Wishlist");
            },
        }),
        {
            name: "wishlist-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);