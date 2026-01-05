import {useState} from "react";
import {useGameContext, type WishlistGame} from "@/context/GameContext";
import type {Game} from "@/types";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ClipboardList,
    Search,
    ShoppingCart,
    Trash2,
    Bell,
    BellOff,
    Calendar,
    Star,
    Clock,
    Sparkles,
    Tag,
    ArrowRight,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {toast} from "sonner";

interface WishlistViewProps {
    onGoHome: () => void;
    onSelectGame?: (game: Game) => void;
}

export function WishlistView({onGoHome, onSelectGame}: WishlistViewProps) {
    const {wishlist, removeFromWishlist, addToCart, userRatings} = useGameContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "released" | "upcoming">("all");
    const [sortBy, setSortBy] = useState<"recent" | "name" | "price">("recent");
    const [notifications, setNotifications] = useState<Record<number, boolean>>({});

    const filteredGames = wishlist
        .filter((game) => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterStatus === "all" ||
                (filterStatus === "released" && game.isReleased) ||
                (filterStatus === "upcoming" && !game.isReleased);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "recent") {
                return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            }
            if (sortBy === "name") {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === "price") {
                return a.price - b.price;
            }
            return 0;
        });

    const releasedCount = wishlist.filter((g) => g.isReleased).length;
    const upcomingCount = wishlist.filter((g) => !g.isReleased).length;

    const toggleNotification = (gameId: number) => {
        setNotifications((prev) => {
            const newState = {...prev, [gameId]: !prev[gameId]};
            if (newState[gameId]) {
                toast.success("Çıkış bildirimi açıldı! 🔔");
            } else {
                toast.info("Bildirim kapatıldı.");
            }
            return newState;
        });
    };

    const handleAddToCart = (game: WishlistGame) => {
        if (!game.isReleased) {
            toast.warning("Bu oyun henüz çıkmadı!");
            return;
        }
        addToCart(game);
    };

    if (wishlist.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <ClipboardList className="w-16 h-16 text-slate-400"/>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900">İstek Listen Boş</h2>
                <p className="text-slate-500 mb-6 max-w-md">
                    İlgini çeken oyunları istek listene ekleyerek takip edebilir, çıkışlarından haberdar olabilirsin.
                </p>
                <Button onClick={onGoHome} size="lg"
                        className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white">
                    Oyunları Keşfet
                </Button>
            </div>
        );
    }

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 mb-2">
                        <ClipboardList className="w-8 h-8 text-amber-600"/>
                        İstek Listem
                    </h2>
                    <p className="text-slate-500">
                        <span className="font-medium text-emerald-600">{releasedCount}</span> çıkmış •{" "}
                        <span className="font-medium text-purple-600">{upcomingCount}</span> yakında
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                        <Input
                            placeholder="Oyun ara..."
                            className="pl-10 w-48 bg-slate-50 border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                        <SelectTrigger className="w-40 bg-slate-50 border-slate-200">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="released">Çıkmış Oyunlar</SelectItem>
                            <SelectItem value="upcoming">Yakında Çıkacak</SelectItem>
                        </SelectContent>
                    </Select>


                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                        <SelectTrigger className="w-36 bg-slate-50 border-slate-200">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Son Eklenen</SelectItem>
                            <SelectItem value="name">İsim (A-Z)</SelectItem>
                            <SelectItem value="price">Fiyat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredGames.length === 0 ? (
                <div className="text-center py-16">
                    <Search className="w-12 h-12 mx-auto text-slate-300 mb-4"/>
                    <p className="text-slate-500">Arama kriterlerine uygun oyun bulunamadı.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map((game) => (
                        <WishlistCard
                            key={game.id}
                            game={game}
                            onRemove={removeFromWishlist}
                            onAddToCart={handleAddToCart}
                            onToggleNotification={toggleNotification}
                            hasNotification={notifications[game.id] || false}
                            userRating={userRatings[game.id]}
                            onSelect={onSelectGame}
                        />
                    ))}
                </div>
            )}

            {releasedCount > 0 && (
                <div
                    className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">
                                Tüm Çıkmış Oyunları Sepete Ekle
                            </h3>
                            <p className="text-slate-500 text-sm">
                                İstek listendeki {releasedCount} oyunu tek tıkla sepetine ekle.
                            </p>
                        </div>
                        <Button
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 h-11 rounded-xl cursor-pointer"
                            onClick={() => {
                                wishlist.filter((g) => g.isReleased).forEach((g) => addToCart(g));
                            }}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2"/>
                            Tümünü Ekle
                            <ArrowRight className="w-4 h-4 ml-2"/>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function WishlistCard({
                          game,
                          onRemove,
                          onAddToCart,
                          onToggleNotification,
                          hasNotification,
                          userRating,
                          onSelect,
                      }: {
    game: WishlistGame;
    onRemove: (id: number) => void;
    onAddToCart: (game: WishlistGame) => void;
    onToggleNotification: (id: number) => void;
    hasNotification: boolean;
    userRating?: number;
    onSelect?: (game: Game) => void;
}) {
    return (
        <div
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div
                className="relative h-44 overflow-hidden cursor-pointer"
                onClick={() => onSelect?.(game)}
            >
                <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>

                <div className="absolute top-3 left-3">
                    {game.isReleased ? (
                        <span
                            className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5"/> Satışta
                        </span>
                    ) : (
                        <span
                            className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5"/> Yakında
                        </span>
                    )}
                </div>

                {!game.isReleased && (
                    <button
                        className={cn(
                            "absolute top-3 right-3 p-2 rounded-lg transition-all cursor-pointer",
                            hasNotification
                                ? "bg-amber-500 text-white"
                                : "bg-black/40 text-white hover:bg-amber-500"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleNotification(game.id);
                        }}
                    >
                        {hasNotification ? (
                            <Bell className="w-4 h-4"/>
                        ) : (
                            <BellOff className="w-4 h-4"/>
                        )}
                    </button>
                )}

                <div className="absolute bottom-3 left-3">
                    <span className="bg-slate-900/80 text-white text-xs font-medium px-2 py-1 rounded-md">
                        {game.category}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3
                    className="font-bold text-lg text-slate-900 mb-2 line-clamp-1 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => onSelect?.(game)}
                >
                    {game.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Star
                            className={cn("w-3.5 h-3.5", userRating ? "fill-yellow-400 text-yellow-400" : "fill-slate-300 text-slate-300")}/>
                        <span className="font-medium">{userRating || game.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5"/>
                        <span>{game.releaseDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5"/>
                        <span>{new Date(game.addedAt).toLocaleDateString("tr-TR")}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        {game.isReleased ? (
                            <span className="text-xl font-black text-slate-900">
                                {game.price === 0 ? "Ücretsiz" : `$${game.price}`}
                            </span>
                        ) : (
                            <span className="text-sm font-medium text-purple-600">
                                Fiyat açıklanacak
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-lg border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
                            onClick={() => onRemove(game.id)}
                        >
                            <Trash2 className="w-4 h-4"/>
                        </Button>

                        {game.isReleased && (
                            <Button
                                className="h-9 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-lg cursor-pointer"
                                onClick={() => onAddToCart(game)}
                            >
                                <ShoppingCart className="w-4 h-4 mr-1"/> Sepete Ekle
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}