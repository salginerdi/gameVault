import { useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, ArrowRight, ShoppingBag, CreditCard, CheckCircle2, ArrowLeft, Loader2, ShieldCheck, Lock, Library } from "lucide-react";

interface CartViewProps {
    onGoHome: () => void;
    onGoToLibrary?: () => void;
}

export function CartView({ onGoHome, onGoToLibrary }: CartViewProps) {
    const { cart, removeFromCart, purchaseGames } = useGameContext();

    const [isCheckout, setIsCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [purchasedCount, setPurchasedCount] = useState(0);

    const [formData, setFormData] = useState({
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });

    const totalPrice = cart.reduce((total, game) => total + game.price, 0);

    const originalTotalPrice = cart.reduce((total, game) => total + (game.originalPrice || game.price), 0);

    const totalDiscount = originalTotalPrice - totalPrice;
    const discountRate = originalTotalPrice > 0 ? Math.round((totalDiscount / originalTotalPrice) * 100) : 0;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setFormData({ ...formData, cardName: value });
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 16) value = value.slice(0, 16);
        const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
        setFormData({ ...formData, cardNumber: formatted });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);

        if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }

        setFormData({ ...formData, expiryDate: value });
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 3) {
            setFormData({ ...formData, cvv: value });
        }
    };

    const handlePurchase = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.cardNumber.replace(/\s/g, "").length < 16) {
            toast.error("Geçersiz kart numarası.");
            return;
        }
        if (formData.expiryDate.length < 5) {
            toast.error("Geçersiz son kullanma tarihi.");
            return;
        }
        if (formData.cvv.length < 3) {
            toast.error("Geçersiz CVV.");
            return;
        }
        if (formData.cardName.trim().length < 3) {
            toast.error("Lütfen kart üzerindeki ismi tam giriniz.");
            return;
        }

        setIsProcessing(true);
        const count = cart.length;

        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setPurchasedCount(count);
            purchaseGames();

            toast.success("Ödeme Başarılı! Oyunlar kütüphanene eklendi. 🎮");
        }, 2000);
    };

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <ShoppingBag className="w-16 h-16 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900">Sepetin Henüz Boş</h2>
                <p className="text-slate-500 mb-6 max-w-md">
                    Henüz hiçbir oyun eklemedin. Kütüphaneye dönüp harika maceralar keşfetmeye ne dersin?
                </p>
                <Button onClick={onGoHome} size="lg" className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white">
                    Oyunlara Göz At
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                <div className="bg-green-100 p-6 rounded-full mb-6 text-green-600">
                    <CheckCircle2 className="w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-slate-900">Siparişin Alındı!</h2>
                <p className="text-slate-500 mb-2 max-w-md">
                    Teşekkürler! {purchasedCount} oyun kütüphanene eklendi.
                </p>
                <p className="text-slate-400 text-sm mb-8">
                    Sipariş bilgilerin e-posta adresine gönderildi.
                </p>
                <div className="flex gap-4">
                    <Button onClick={onGoHome} size="lg" variant="outline" className="cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50">
                        Alışverişe Devam Et
                    </Button>
                    {onGoToLibrary && (
                        <Button onClick={onGoToLibrary} size="lg" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Library className="w-5 h-5 mr-2" />
                            Kütüphaneme Git
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">

            <div className="flex items-center gap-4 mb-8">
                {isCheckout && (
                    <Button variant="ghost" size="icon" onClick={() => setIsCheckout(false)} className="rounded-full hover:bg-slate-100 cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}
                <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                    {isCheckout ? (
                        <>
                            <CreditCard className="w-8 h-8 text-blue-600" /> Ödeme Bilgileri
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-8 h-8 text-blue-600" /> Sepetim <span className="text-slate-400 text-lg font-normal">({cart.length} ürün)</span>
                        </>
                    )}
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                <div className={`lg:col-span-2 space-y-4 ${isCheckout ? "hidden lg:block opacity-50 pointer-events-none" : ""}`}>
                    {cart.map((game) => (
                        <div key={game.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden p-4 flex flex-col gap-3 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <img
                                    src={game.coverImage}
                                    alt={game.title}
                                    className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-slate-900 truncate">{game.title}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{game.category}</p>
                                </div>

                                <div className="text-right">
                                    {game.originalPrice !== undefined && game.originalPrice > 0 && game.originalPrice > game.price && (
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-slate-400 line-through">${game.originalPrice}</span>
                                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                                -%{Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)}
                                            </span>
                                        </div>
                                    )}
                                    <span className="font-bold text-lg text-slate-900">
                                        {game.price === 0 ? "Ücretsiz" : `$${game.price}`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(game.id)}
                                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer h-8 px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Sil
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24 shadow-lg">

                        {isCheckout ? (
                            <form onSubmit={handlePurchase} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-2 mb-2 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium">
                                    <ShieldCheck className="w-5 h-5" /> Güvenli Ödeme Altyapısı
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-900">Kart Üzerindeki İsim</Label>
                                    <Input
                                        id="name"
                                        placeholder="AD SOYAD"
                                        className="bg-slate-50 border-slate-200 uppercase placeholder:text-slate-400 focus:ring-blue-500/20"
                                        value={formData.cardName}
                                        onChange={handleNameChange}
                                        maxLength={40}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="number" className="text-slate-900">Kart Numarası</Label>
                                    <Input
                                        id="number"
                                        placeholder="0000 0000 0000 0000"
                                        className="bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:ring-blue-500/20"
                                        value={formData.cardNumber}
                                        onChange={handleCardNumberChange}
                                        maxLength={19}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry" className="text-slate-900">SKT (AA/YY)</Label>
                                        <Input
                                            id="expiry"
                                            placeholder="MM/YY"
                                            className="bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:ring-blue-500/20"
                                            value={formData.expiryDate}
                                            onChange={handleExpiryChange}
                                            maxLength={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv" className="text-slate-900">CVV</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="123"
                                            type="password"
                                            className="bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:ring-blue-500/20"
                                            value={formData.cvv}
                                            onChange={handleCvvChange}
                                            maxLength={3}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-4 pt-4 flex justify-between font-bold text-lg text-slate-900">
                                    <span>Toplam</span>
                                    <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full text-lg h-12 cursor-pointer shadow-lg hover:shadow-blue-500/25 transition-all bg-slate-900 hover:bg-blue-600 text-white"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> İşleniyor...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 mr-2" /> Güvenle Öde
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <>
                                <h3 className="font-bold text-xl mb-4 border-b border-slate-100 pb-4 text-slate-900">Sipariş Özeti</h3>

                                <div className="space-y-2 mb-6 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Ara Toplam</span>
                                        <span className="text-slate-900">${originalTotalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">İndirimler</span>
                                        <span className="text-emerald-600 font-medium">
                                            -${totalDiscount.toFixed(2)}
                                            {discountRate > 0 && ` (%${discountRate})`}
                                        </span>
                                    </div>
                                    <div className="border-t border-slate-100 my-2 pt-2 flex justify-between font-bold text-lg text-slate-900">
                                        <span>Toplam</span>
                                        <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsCheckout(true)}
                                    className="w-full text-lg h-12 cursor-pointer shadow-lg hover:shadow-blue-500/25 transition-all bg-slate-900 hover:bg-slate-800 text-white"
                                >
                                    Ödemeye Geç <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                <p className="text-xs text-center text-slate-400 mt-4 flex justify-center items-center gap-1">
                                    🔒 256-bit SSL ile güvenli ödeme
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}