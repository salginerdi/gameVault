import { useState } from "react";
import type { Game } from "@/types";
import { useGameContext } from "@/context/GameContext";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Star, ShoppingBag, ClipboardList, Clock, Play, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameDetailProps {
    game: (Game & { originalPrice?: number }) | null;
    onClose: () => void;
}

export function GameDetail({ game, onClose }: GameDetailProps) {
    const { addToCart, addToWishlist, isInWishlist, userRatings, rateGame } = useGameContext();
    const [hoverRating, setHoverRating] = useState(0);

    if (!game) return null;

    const userRating = userRatings[game.id] || 0;
    const displayRating = hoverRating || userRating;
    const averageRating = userRating ? ((game.rating * 50 + userRating) / 51).toFixed(1) : game.rating;

    const handleBuy = () => {
        addToCart(game);
        onClose();
    };

    const inWishlist = isInWishlist(game.id);

    if (game.isUpcoming) {
        return (
            <Dialog open={!!game} onOpenChange={(isOpen) => !isOpen && onClose()}>
                <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-slate-950 border-0 shadow-2xl flex flex-col gap-0 rounded-2xl">
                    <div className="p-6 pb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Yakında
                            </span>
                            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs font-medium">
                                {game.category}
                            </span>
                        </div>
                        <DialogTitle className="text-3xl sm:text-4xl font-black text-white leading-tight">
                            {game.title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 mt-2 flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                Çıkış Tarihi: {game.releaseDate}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {averageRating} Beklenen Puan
                            </span>
                        </DialogDescription>
                    </div>

                    <div className="relative w-full aspect-video bg-black">
                        {game.trailerUrl ? (
                            <iframe
                                src={game.trailerUrl}
                                title={`${game.title} Fragman`}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                                <Play className="w-16 h-16 text-slate-600 mb-4" />
                                <p className="text-slate-500 font-medium">Fragman Yakında Eklenecek</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-sm">Tahmini Fiyat</span>
                            <span className="text-3xl font-black text-white tracking-tight">
                                {game.price === 0 ? "Ücretsiz" : `$${game.price}`}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl border-slate-700 text-slate-300 font-bold hover:bg-slate-800 hover:border-slate-600 cursor-pointer">
                                Kapat
                            </Button>
                            <Button onClick={() => addToWishlist(game)} disabled={inWishlist} className={cn("h-12 px-8 rounded-xl font-bold shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2", inWishlist ? "bg-amber-600 text-white cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700")}>
                                {inWishlist ? <><Bell className="w-5 h-5" /> İstek Listesinde</> : <><ClipboardList className="w-5 h-5" /> İstek Listesine Ekle</>}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={!!game} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0 shadow-2xl flex flex-col gap-0 rounded-2xl">
                <div className="relative w-full h-72 sm:h-80 bg-slate-100">
                    <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                                {game.category}
                            </span>
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                                <Star className={cn("w-4 h-4", userRating ? "text-blue-400 fill-blue-400" : "text-yellow-400 fill-yellow-400")} />
                                <span className="text-white font-bold text-sm">{averageRating}</span>
                            </div>
                        </div>
                        <DialogTitle className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-sm">
                            {game.title}
                        </DialogTitle>
                    </div>
                </div>

                <div className="p-8 bg-white">
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <DialogDescription className="text-base leading-7 text-slate-600">
                                Bu oyun, kendi türünün en başarılı örneklerinden biri olarak kabul ediliyor. Eşsiz atmosferi ve {averageRating} puanlık kullanıcı değerlendirmesiyle kütüphanenizde yer almayı hak ediyor.
                            </DialogDescription>
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
                                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><Calendar className="w-5 h-5 text-slate-700" /></div>
                                    <div className="flex flex-col"><span className="text-xs uppercase tracking-wide text-slate-400">Yayın Tarihi</span><span className="text-slate-900">{game.releaseDate}</span></div>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
                                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><Tag className="w-5 h-5 text-slate-700" /></div>
                                    <div className="flex flex-col"><span className="text-xs uppercase tracking-wide text-slate-400">Tür</span><span className="text-slate-900">{game.category}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-64 flex flex-col gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit">
                            <div className="flex flex-col gap-1 pb-4 border-b border-slate-200">
                                <span className="text-xs font-bold text-slate-400 uppercase text-center">Kişisel Puanın</span>
                                <div className="flex gap-1.5 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-0.5 cursor-pointer" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => rateGame(game.id, star)}>
                                            <Star className={cn("w-7 h-7 transition-colors duration-200", star <= displayRating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 fill-slate-200")} />
                                        </button>
                                    ))}
                                </div>
                                {userRating > 0 ? <span className="text-center text-xs font-medium text-green-600">{userRating} Yıldız Verildi</span> : <span className="text-center text-xs text-slate-400">Puanlamak için tıkla</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex flex-row items-center justify-between sm:justify-between w-full">
                    <div className="flex flex-col items-start">
                        {game.originalPrice && game.originalPrice > game.price && <span className="text-sm text-slate-400 line-through font-medium">${game.originalPrice}</span>}
                        <span className={cn("text-3xl font-black tracking-tight", game.originalPrice ? "text-rose-600" : "text-slate-900")}>{game.price === 0 ? "Ücretsiz" : `$${game.price}`}</span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl border-slate-300 text-slate-700 font-bold hover:bg-white hover:border-slate-400 cursor-pointer">Vazgeç</Button>
                        <Button onClick={handleBuy} className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95 cursor-pointer flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Sepete Ekle</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}