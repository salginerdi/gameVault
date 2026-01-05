import { createContext, useContext, useState, type ReactNode } from "react";
import type { Game, User } from "@/types";
import { toast } from "sonner";

export interface LibraryGame extends Game {
    purchasedAt: Date;
    isInstalled: boolean;
    installProgress?: number;
}

export interface WishlistGame extends Game {
    addedAt: Date;
    releaseDate: string;
    isReleased: boolean;
}

interface GameContextType {
    favorites: number[];
    toggleFavorite: (id: number) => void;
    cart: Game[];
    addToCart: (game: Game) => void;
    removeFromCart: (gameId: number) => void;
    clearCart: () => void;
    userRatings: Record<number, number>;
    rateGame: (gameId: number, rating: number) => void;
    user: User | null;
    login: (name: string, email: string) => void;
    register: (name: string, email: string) => void;
    logout: () => void;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (isOpen: boolean) => void;
    library: LibraryGame[];
    purchaseGames: () => void;
    installGame: (gameId: number) => void;
    uninstallGame: (gameId: number) => void;
    wishlist: WishlistGame[];
    addToWishlist: (game: Game) => void;
    removeFromWishlist: (gameId: number) => void;
    isInLibrary: (gameId: number) => boolean;
    isInWishlist: (gameId: number) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [cart, setCart] = useState<Game[]>([]);
    const [userRatings, setUserRatings] = useState<Record<number, number>>({});

    const [library, setLibrary] = useState<LibraryGame[]>([]);
    const [wishlist, setWishlist] = useState<WishlistGame[]>([]);

    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const checkAuth = (message?: string) => {
        if (!user) {
            setAuthModalOpen(true);
            toast.error(message || "Bu işlem için önce giriş yapmalısınız.");
            return false;
        }
        return true;
    };

    const toggleFavorite = (id: number) => {
        if (!checkAuth("Favorilere eklemek için giriş yapmalısınız.")) return;

        const isAlreadyFavorite = favorites.includes(id);
        if (isAlreadyFavorite) {
            toast.info("Oyun favorilerden çıkarıldı");
            setFavorites((prev) => prev.filter((favId) => favId !== id));
        } else {
            toast.success("Oyun favorilere eklendi! ❤️");
            setFavorites((prev) => [...prev, id]);
        }
    };

    const addToCart = (game: Game) => {
        if (!checkAuth("Satın alma işlemi için giriş yapmalısınız.")) return;

        if (library.find((item) => item.id === game.id)) {
            toast.warning("Bu oyun zaten kütüphanenizde!");
            return;
        }

        const isInCart = cart.find((item) => item.id === game.id);
        if (isInCart) {
            toast.warning("Bu oyun zaten sepetinizde var!");
            return;
        }
        toast.success(`${game.title} sepete eklendi! 🛒`);
        setCart((prev) => [...prev, game]);
    };

    const removeFromCart = (gameId: number) => {
        toast.info("Ürün sepetten çıkarıldı.");
        setCart((prev) => prev.filter((game) => game.id !== gameId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const purchaseGames = () => {
        const purchasedGames: LibraryGame[] = cart.map((game) => ({
            ...game,
            purchasedAt: new Date(),
            isInstalled: false,
            installProgress: 0,
        }));

        setLibrary((prev) => [...prev, ...purchasedGames]);

        const purchasedIds = cart.map((g) => g.id);
        setWishlist((prev) => prev.filter((g) => !purchasedIds.includes(g.id)));

        clearCart();
    };

    const installGame = (gameId: number) => {
        setLibrary((prev) =>
            prev.map((game) => {
                if (game.id === gameId) {
                    simulateInstall(gameId);
                    return { ...game, installProgress: 0 };
                }
                return game;
            })
        );
        toast.info("Kurulum başlatıldı...");
    };

    const simulateInstall = (gameId: number) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setLibrary((prev) =>
                    prev.map((game) =>
                        game.id === gameId
                            ? { ...game, isInstalled: true, installProgress: 100 }
                            : game
                    )
                );
                toast.success("Kurulum tamamlandı! 🎮");
            } else {
                setLibrary((prev) =>
                    prev.map((game) =>
                        game.id === gameId
                            ? { ...game, installProgress: Math.round(progress) }
                            : game
                    )
                );
            }
        }, 500);
    };

    const uninstallGame = (gameId: number) => {
        setLibrary((prev) =>
            prev.map((game) =>
                game.id === gameId
                    ? { ...game, isInstalled: false, installProgress: 0 }
                    : game
            )
        );
        toast.info("Oyun kaldırıldı.");
    };

    const addToWishlist = (game: Game) => {
        if (!checkAuth("İstek listesine eklemek için giriş yapmalısınız.")) return;

        if (library.find((item) => item.id === game.id)) {
            toast.warning("Bu oyun zaten kütüphanenizde!");
            return;
        }

        if (wishlist.find((item) => item.id === game.id)) {
            toast.warning("Bu oyun zaten istek listenizde!");
            return;
        }

        const wishlistGame: WishlistGame = {
            ...game,
            addedAt: new Date(),
            isReleased: !game.releaseDate.includes("2026") && !game.releaseDate.includes("2027"),
        };

        setWishlist((prev) => [...prev, wishlistGame]);
        toast.success(`${game.title} istek listesine eklendi! 📋`);
    };

    const removeFromWishlist = (gameId: number) => {
        setWishlist((prev) => prev.filter((game) => game.id !== gameId));
        toast.info("Oyun istek listesinden çıkarıldı.");
    };

    const isInLibrary = (gameId: number) => {
        return library.some((game) => game.id === gameId);
    };

    const isInWishlist = (gameId: number) => {
        return wishlist.some((game) => game.id === gameId);
    };

    const rateGame = (gameId: number, rating: number) => {
        if (!checkAuth("Puan vermek için giriş yapmalısınız.")) return;

        setUserRatings((prev) => ({ ...prev, [gameId]: rating }));
        toast.success(`Oyuna ${rating} yıldız verdiniz! ⭐`);
    };

    const login = (name: string, email: string) => {
        setUser({ id: Date.now().toString(), name, email });
        setAuthModalOpen(false);
        toast.success(`Hoş geldin, ${name}!`);
    };

    const register = (name: string, email: string) => {
        setUser({ id: Date.now().toString(), name, email });
        setAuthModalOpen(false);
        toast.success(`Hesabınız oluşturuldu. Hoş geldin ${name}!`);
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        setLibrary([]);
        setWishlist([]);
        setFavorites([]);
        setUserRatings({});
        toast.info("Çıkış yapıldı.");
    };

    return (
        <GameContext.Provider value={{
            favorites, toggleFavorite, cart, addToCart, removeFromCart, clearCart, userRatings, rateGame,
            user, login, register, logout, isAuthModalOpen, setAuthModalOpen,
            library, purchaseGames, installGame, uninstallGame,
            wishlist, addToWishlist, removeFromWishlist, isInLibrary, isInWishlist
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
}