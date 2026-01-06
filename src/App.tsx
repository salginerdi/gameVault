import {useState, useMemo, useEffect} from "react"
import {useQuery} from '@tanstack/react-query'
import {fetchGames} from './api'
import type {Game} from "./types"
import {GameDetail} from "@/components/GameDetail"
import {CartView} from "@/components/CartView"
import {LibraryView} from "@/components/LibraryView"
import {WishlistView} from "@/components/WishlistView"
import {AuthModal} from "@/components/AuthModal"
import {useGameContext} from "@/context/GameContext"
import {
    Card,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Toaster} from "@/components/ui/sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {
    Gamepad2,
    Search,
    Heart,
    ShoppingBag,
    Home,
    Filter,
    ChevronLeft,
    ChevronRight,
    ShoppingBasket,
    Eye,
    Sparkles,
    Zap,
    Rocket,
    Percent,
    Globe,
    ShieldCheck,
    Instagram,
    Youtube,
    Facebook,
    X,
    FileText,
    HelpCircle,
    RefreshCcw,
    Lock,
    Phone,
    MapPin,
    Mail,
    Gift,
    Timer,
    User,
    LogOut,
    Flame,
    Library,
    ClipboardList,
    Clock,
    Megaphone
} from "lucide-react"
import {cn} from "@/lib/utils"
import {Calendar, Star} from "lucide-react"

function App() {
    const {data: games, isLoading, isError} = useQuery({
        queryKey: ['games'],
        queryFn: fetchGames,
    })

    const {
        favorites, toggleFavorite, cart, addToCart, userRatings, user, logout, setAuthModalOpen,
        library, wishlist, addToWishlist, isInLibrary, isInWishlist
    } = useGameContext()

    const [view, setView] = useState<"home" | "favorites" | "cart" | "new-releases" | "on-sale" | "help" | "returns" | "privacy" | "terms" | "contact" | "library" | "wishlist">("home")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedGame, setSelectedGame] = useState<Game | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [isScrolled, setIsScrolled] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(true)

    const ITEMS_PER_PAGE = 8
    const FREE_GAME_ID = 28;

    const slides = [
        {
            id: "free-game",
            type: "special",
            bgImage: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1097840/library_hero.jpg",
            title: "GEARS OF WAR: E-DAY",
            desc: "Efsane geri dönüyor. İnsanlığın kaderini belirleyen o ilk günü deneyimle. Sadece bu haftaya özel ücretsiz.",
            price: 69.99,
            isFree: true
        },
        {
            id: "gta-vi",
            type: "hero",
            bgImage: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/library_hero.jpg",
            title: "GRAND THEFT AUTO VI",
            desc: "Vice City'e hoş geldiniz. Gelmiş geçmiş en büyük açık dünya deneyimine hazır olun. Ön siparişler yakında.",
            badge: "Çok Yakında",
            badgeColor: "bg-purple-600",
            btnText: "Hemen İncele"
        },
        {
            id: "monster-hunter",
            type: "hero",
            bgImage: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2246340/library_hero.jpg",
            title: "MONSTER HUNTER WILDS",
            desc: "Av sezonu açıldı. Devasa yaratıklar, yeni ekosistemler ve sınırsız macera seni bekliyor.",
            badge: "Yeni Çıkan",
            badgeColor: "bg-orange-600",
            btnText: "Hemen İncele"
        },
        {
            id: "generic-deals",
            type: "generic",
            title: "Yeni Dünyaları Keşfetmeye Hazır Mısın?",
            desc: "Binlerce oyun, eşsiz maceralar ve kaçırılmayacak indirim fırsatları. Kütüphaneni genişletmenin tam zamanı.",
            btnText: "Keşfetmeye Başla"
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll, {passive: true})
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (view === "home") {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length)
            }, 6000)
            return () => clearInterval(timer)
        }
    }, [view, slides.length])

    const resetToHome = () => {
        setView("home")
        setSelectedCategory("All")
        setSearchTerm("")
        setCurrentPage(1)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const navigateTo = (page: typeof view) => {
        setView(page)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const categories = useMemo(() => {
        if (!games) return []
        const allCategories = games.map(game => game.category)
        return [...new Set(allCategories)]
    }, [games])

    const filteredGames = games?.filter(game => {
        const matchesCategory = selectedCategory === "All" || game.category === selectedCategory
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
        const isDiscounted = game.id % 3 === 0;
        const isNewRelease = game.releaseDate.includes("2023") || game.releaseDate.includes("2024") || game.releaseDate.includes("2025");
        if (view === "favorites") return matchesCategory && matchesSearch && favorites.includes(game.id)
        if (view === "on-sale") return matchesCategory && matchesSearch && isDiscounted
        if (view === "new-releases") return matchesCategory && matchesSearch && isNewRelease
        return matchesCategory && matchesSearch
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedCategory, searchTerm, view])

    const totalItems = filteredGames?.length || 0
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentGames = filteredGames?.slice(startIndex, endIndex)

    const getHeroContent = () => {
        switch (view) {
            case "favorites":
                return {
                    title: "Efsanevi Oyun Koleksiyonun",
                    desc: "Seçtiğin en özel oyunlar burada seni bekliyor.",
                    badge: "Koleksiyonun"
                }
            case "new-releases":
                return {
                    title: "En Yeni Maceraları Keşfet",
                    desc: "Oyun dünyasının en taze yapımları ve son çıkan başyapıtlar.",
                    badge: "Yeni Çıkanlar"
                }
            case "on-sale":
                return {
                    title: "Kaçırılmayacak Büyük Fırsatlar",
                    desc: "Bütçe dostu fiyatlarla kütüphaneni genişletmenin tam zamanı.",
                    badge: "Çılgın İndirimler"
                }
            default:
                return {
                    title: "Yeni Dünyaları Keşfetmeye Hazır Mısın?",
                    desc: "Binlerce oyun, eşsiz maceralar ve kaçırılmayacak indirim fırsatları.",
                    badge: "Haftanın Fırsatları"
                }
        }
    }

    const heroContent = getHeroContent()
    const isInfoPage = ["help", "returns", "privacy", "terms", "contact"].includes(view)
    const isSpecialPage = ["library", "wishlist", "cart"].includes(view)

    const renderInfoPage = () => {
        switch (view) {
            case "help":
                return (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="text-center space-y-4 mb-12">
                            <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-600 mb-4"><HelpCircle
                                className="w-12 h-12"/></div>
                            <h2 className="text-4xl font-black text-slate-900">Yardım Merkezi</h2>
                            <p className="text-xl text-slate-500">Nasıl yardımcı olabiliriz?</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {["Hesap İşlemleri", "Ödeme Sorunları", "İndirme ve Kurulum", "Teknik Destek"].map((item) => (
                                <Card key={item}
                                      className="p-6 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
                                    <h3 className="font-bold text-lg mb-2">{item}</h3>
                                    <p className="text-slate-500 text-sm">Bu konu hakkında detaylı bilgi ve çözüm
                                        önerileri için tıklayın.</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            case "returns":
                return (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="text-center space-y-4 mb-12">
                            <div className="inline-flex p-4 rounded-2xl bg-rose-50 text-rose-600 mb-4"><RefreshCcw
                                className="w-12 h-12"/></div>
                            <h2 className="text-4xl font-black text-slate-900">İade Politikası</h2>
                        </div>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg text-slate-600">GameVault olarak müşteri memnuniyetini önemsiyoruz.
                                Satın aldığınız oyundan memnun kalmamanız durumunda aşağıdaki koşullar dahilinde iade
                                talep edebilirsiniz.</p>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 my-8">
                                <h3 className="font-bold text-lg">İade Koşulları</h3>
                                <ul className="list-disc list-inside space-y-2 text-slate-600">
                                    <li>Satın alma işleminden sonraki <strong>14 gün</strong> içinde iade talebi
                                        oluşturulmalıdır.
                                    </li>
                                    <li>Oyunun oynanma süresi <strong>2 saati</strong> geçmemelidir.</li>
                                    <li>İndirilebilir içerikler (DLC) ve oyun içi satın alımlarda iade
                                        yapılamamaktadır.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            case "privacy":
                return (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="text-center space-y-4 mb-12">
                            <div className="inline-flex p-4 rounded-2xl bg-emerald-50 text-emerald-600 mb-4"><Lock
                                className="w-12 h-12"/></div>
                            <h2 className="text-4xl font-black text-slate-900">Gizlilik Politikası</h2>
                        </div>
                        <div className="space-y-6 text-slate-600">
                            <p>Verilerinizin güvenliği bizim için en önemli önceliktir. Bu gizlilik politikası,
                                GameVault üzerinden toplanan verilerin nasıl işlendiğini açıklar.</p>
                            <h3 className="text-xl font-bold text-slate-900">Toplanan Veriler</h3>
                            <p>Hizmetlerimizi iyileştirmek amacıyla e-posta adresi, kullanıcı adı ve oyun tercihleri
                                gibi temel bilgileri topluyoruz. Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmakta
                                olup sunucularımızda saklanmamaktadır.</p>
                        </div>
                    </div>
                )
            case "terms":
                return (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="text-center space-y-4 mb-12">
                            <div className="inline-flex p-4 rounded-2xl bg-amber-50 text-amber-600 mb-4"><FileText
                                className="w-12 h-12"/></div>
                            <h2 className="text-4xl font-black text-slate-900">Kullanım Koşulları</h2>
                        </div>
                        <div className="space-y-6 text-slate-600">
                            <p>GameVault platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <p className="text-sm">Platform üzerindeki tüm içerikler, logolar ve oyun materyalleri
                                    telif hakları ile korunmaktadır. İzinsiz kopyalanması, dağıtılması veya ticari
                                    amaçla kullanılması yasaktır.</p>
                            </div>
                        </div>
                    </div>
                )
            case "contact":
                return (
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                        <div className="text-center space-y-4 mb-12">
                            <div className="inline-flex p-4 rounded-2xl bg-slate-100 text-slate-600 mb-4"><Phone
                                className="w-12 h-12"/></div>
                            <h2 className="text-4xl font-black text-slate-900">İletişim</h2>
                            <p className="text-xl text-slate-500">Bize ulaşın, size en kısa sürede dönüş yapalım.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl"><MapPin
                                        className="w-6 h-6 text-slate-700"/></div>
                                    <div>
                                        <h3 className="font-bold text-lg">Merkez Ofis</h3>
                                        <p className="text-slate-500">Teknoloji Vadisi, No: 42<br/>İstanbul, Türkiye</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl"><Mail
                                        className="w-6 h-6 text-slate-700"/></div>
                                    <div>
                                        <h3 className="font-bold text-lg">E-Posta</h3>
                                        <p className="text-slate-500">support@gamevault.com<br/>info@gamevault.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Adınız</label>
                                            <Input placeholder="Adınız" className="bg-slate-50 focus:ring-slate-300"/>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Soyadınız</label>
                                            <Input placeholder="Soyadınız"
                                                   className="bg-slate-50 focus:ring-slate-300"/>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">E-Posta</label>
                                        <Input placeholder="ornek@email.com"
                                               className="bg-slate-50 focus:ring-slate-300"/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Mesajınız</label>
                                        <textarea
                                            className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                            placeholder="Size nasıl yardımcı olabiliriz?"></textarea>
                                    </div>
                                    <Button
                                        className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl cursor-pointer">Gönder</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div
                            className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
                        <Gamepad2
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-slate-600"/>
                    </div>
                    <div className="text-lg font-medium text-slate-500 animate-pulse">Mağaza Yükleniyor...</div>
                </div>
            </div>
        )
    }

    if (isError) {
        return <div className="flex h-screen items-center justify-center text-rose-500 font-medium bg-slate-50">Veriler
            yüklenirken bir hata oluştu.</div>
    }

    return (
        <div
            className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900 flex flex-col">

            <header
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-500 border-b border-transparent",
                    isScrolled
                        ? "bg-white/90 backdrop-blur-md shadow-sm border-slate-200 py-3"
                        : "bg-white py-5"
                )}
            >
                <div className="container mx-auto px-6 flex flex-col xl:flex-row gap-5 justify-between items-center">

                    <div className="flex items-center gap-8 w-full xl:w-auto justify-between xl:justify-start">
                        <div
                            onClick={resetToHome}
                            className="flex items-center gap-2.5 cursor-pointer group select-none"
                        >
                            <div
                                className="p-2.5 bg-slate-900 rounded-xl text-white group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-slate-900/20">
                                <Gamepad2 className="w-6 h-6"/>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                                    GameVault
                                </h1>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Premium Gaming Store</span>
                            </div>
                        </div>

                        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
                            <Button
                                variant="ghost"
                                onClick={resetToHome}
                                className={cn(
                                    "rounded-full px-5 h-9 text-sm font-medium transition-all duration-300 cursor-pointer",
                                    view === "home"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                <Home className="w-4 h-4 mr-2"/> Mağaza
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => navigateTo("new-releases")}
                                className={cn(
                                    "rounded-full px-5 h-9 text-sm font-medium transition-all duration-300 cursor-pointer",
                                    view === "new-releases"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                <Rocket className="w-4 h-4 mr-2"/> Yeni Çıkanlar
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => navigateTo("on-sale")}
                                className={cn(
                                    "rounded-full px-5 h-9 text-sm font-medium transition-all duration-300 cursor-pointer",
                                    view === "on-sale"
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-slate-500 hover:text-emerald-600 hover:bg-slate-200/50"
                                )}
                            >
                                <Percent className="w-4 h-4 mr-2"/> İndirimler
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => navigateTo("library")}
                                className={cn(
                                    "rounded-full px-5 h-9 text-sm font-medium transition-all duration-300 gap-2 cursor-pointer",
                                    view === "library"
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
                                )}
                            >
                                <Library className="w-4 h-4"/>
                                Kütüphane
                                {library.length > 0 && (
                                    <span
                                        className="bg-indigo-100 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                        {library.length}
                                    </span>
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => navigateTo("wishlist")}
                                className={cn(
                                    "rounded-full px-5 h-9 text-sm font-medium transition-all duration-300 gap-2 cursor-pointer",
                                    view === "wishlist"
                                        ? "bg-white text-amber-600 shadow-sm"
                                        : "text-slate-500 hover:text-amber-600 hover:bg-slate-200/50"
                                )}
                            >
                                <ClipboardList className="w-4 h-4"/>
                                İstek Listesi
                                {wishlist.length > 0 && (
                                    <span
                                        className="bg-amber-100 text-amber-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => navigateTo("favorites")}
                                className={cn(
                                    "rounded-full px-5 h-9 text-sm font-medium transition-all duration-300 gap-2 cursor-pointer",
                                    view === "favorites"
                                        ? "bg-white text-rose-600 shadow-sm"
                                        : "text-slate-500 hover:text-rose-600 hover:bg-slate-200/50"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", view === "favorites" && "fill-current")}/>
                                Favoriler
                                {favorites.length > 0 && (
                                    <span
                                        className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                        {favorites.length}
                                    </span>
                                )}
                            </Button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                        <div className="flex items-center gap-2">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost"
                                                className="relative h-11 rounded-xl gap-2 px-3 hover:bg-slate-100 cursor-pointer">
                                            <div
                                                className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="hidden sm:flex flex-col items-start text-xs">
                                                <span className="font-bold text-slate-900">{user.name}</span>
                                                <span className="text-emerald-500 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                    Çevrimiçi
                                                </span>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50"
                                        align="end">
                                        <DropdownMenuLabel
                                            className="font-bold text-slate-900">Hesabım</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-slate-100"/>
                                        <DropdownMenuItem onClick={() => setView("library")}
                                                          className="cursor-pointer rounded-lg focus:bg-slate-50">
                                            <Library className="w-4 h-4 mr-2"/> Kütüphanem
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setView("wishlist")}
                                                          className="cursor-pointer rounded-lg focus:bg-slate-50">
                                            <ClipboardList className="w-4 h-4 mr-2"/> İstek Listem
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setView("favorites")}
                                                          className="cursor-pointer rounded-lg focus:bg-slate-50">
                                            <Heart className="w-4 h-4 mr-2"/> Favorilerim
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setView("cart")}
                                                          className="cursor-pointer rounded-lg focus:bg-slate-50">
                                            <ShoppingBag className="w-4 h-4 mr-2"/> Siparişlerim
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-100"/>
                                        <DropdownMenuItem onClick={logout}
                                                          className="cursor-pointer rounded-lg text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                            <LogOut className="w-4 h-4 mr-2"/> Çıkış Yap
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={() => setAuthModalOpen(true)}
                                    className="relative h-11 rounded-xl gap-2 px-3 hover:bg-slate-100 cursor-pointer"
                                >
                                    <div
                                        className="h-8 w-8 rounded-lg bg-slate-200 text-slate-400 flex items-center justify-center font-bold">
                                        <User className="w-4 h-4"/>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start text-xs">
                                        <span className="font-bold text-slate-900">Giriş Yap</span>
                                        <span className="text-slate-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                            Çevrimdışı
                                        </span>
                                    </div>
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigateTo("cart")}
                                className={cn(
                                    "relative w-11 h-11 rounded-xl border border-transparent bg-slate-100/50 transition-all duration-300 hover:bg-slate-200 cursor-pointer group flex-shrink-0",
                                    view === "cart" && "bg-slate-900 border-slate-900 text-white hover:bg-slate-800 hover:border-slate-800 hover:text-white"
                                )}
                            >
                                <ShoppingBag
                                    className={cn("w-5 h-5 transition-transform group-hover:scale-110", view === "cart" ? "text-white" : "text-slate-600 group-hover:text-slate-900")}/>
                                {cart.length > 0 && (
                                    <span
                                        className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white animate-in zoom-in">
                                        {cart.length}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <AuthModal/>

            <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
                <DialogContent
                    className="sm:max-w-[600px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                    <div className="relative h-64 bg-slate-900">
                        <img
                            src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/library_hero.jpg"
                            alt="Grand Theft Auto VI" className="w-full h-full object-cover"/>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"/>
                        <div className="absolute bottom-4 left-6 flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <Megaphone className="w-6 h-6"/>
                            </div>
                            <h2 className="text-white font-black text-2xl uppercase tracking-tight">Erdi Salgın'dan Size
                                Duyuru Var</h2>
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        <p className="text-slate-600 font-medium text-lg leading-relaxed">
                            "GameVault ailesine hoş geldiniz! Sizin için seçtiğimiz haftanın oyununa göz atmayı ve
                            kütüphanenizi genişletmeyi unutmayın. Yeni maceralara hazır olun, keyifli oyunlar dilerim!"
                        </p>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200">
                                <img
                                    src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1097840/library_hero.jpg"
                                    alt="Gears of War" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900">Gears of War: E-Day</h4>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Haftanın
                                    Ücretsiz Oyunu</p>
                            </div>
                            <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse"/>
                        </div>
                        <Button onClick={() => setIsAnnouncementOpen(false)}
                                className="w-full h-12 bg-slate-900 text-white hover:bg-blue-600 font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-slate-900/10">
                            Siteye Giriş Yap ve Keşfet
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <main className="container mx-auto px-6 py-8 flex-grow">
                <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full group">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-700 transition-colors"/>
                            <Input
                                placeholder="Oyun ara..."
                                className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300 rounded-xl transition-all text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="w-full sm:w-56">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger
                                    className="w-full bg-slate-50 border-slate-200 focus:ring-2 focus:ring-slate-300 rounded-xl h-12 px-4 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Filter className="w-4 h-4"/>
                                        <SelectValue placeholder="Kategori Seç"/>
                                    </div>
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50">
                                    <SelectItem value="All" className="rounded-lg cursor-pointer font-medium">Tüm
                                        Oyunlar</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}
                                                    className="rounded-lg cursor-pointer">
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant={view === "new-releases" ? "default" : "outline"}
                                size="sm"
                                onClick={() => navigateTo("new-releases")}
                                className={cn(
                                    "h-10 px-4 rounded-xl font-medium cursor-pointer transition-all",
                                    view === "new-releases"
                                        ? "bg-slate-900 text-white hover:bg-slate-800"
                                        : "border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <Rocket className="w-4 h-4 mr-1.5"/>
                                Yeni
                            </Button>
                            <Button
                                variant={view === "on-sale" ? "default" : "outline"}
                                size="sm"
                                onClick={() => navigateTo("on-sale")}
                                className={cn(
                                    "h-10 px-4 rounded-xl font-medium cursor-pointer transition-all",
                                    view === "on-sale"
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "border-slate-200 hover:bg-slate-50 text-emerald-600"
                                )}
                            >
                                <Percent className="w-4 h-4 mr-1.5"/>
                                İndirim
                            </Button>
                        </div>
                    </div>
                </div>

                {view === "home" && (
                    <div className="relative w-full h-[600px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl group">

                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={cn("absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out",
                                    index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                                )}
                            >
                                {slide.type === "generic" ? (
                                    <div className="absolute inset-0 bg-slate-900 w-full h-full">
                                        <div
                                            className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"/>
                                        <div
                                            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"/>
                                        <div
                                            className="relative z-10 max-w-2xl h-full flex flex-col justify-center p-10 md:p-16">
                                            <div
                                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-6 w-fit">
                                                <Sparkles className="w-4 h-4 text-yellow-300"/>
                                                <span
                                                    className="text-xs font-bold uppercase tracking-wider text-white/90">Haftanın Fırsatları</span>
                                            </div>
                                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-white">{slide.title}</h1>
                                            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8 max-w-lg">{slide.desc}</p>
                                            <Button
                                                onClick={() => document.getElementById('games-grid')?.scrollIntoView({behavior: 'smooth'})}
                                                className="rounded-xl h-12 px-8 bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer w-fit">
                                                {slide.btnText}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-transparent z-10"/>
                                        <img src={slide.bgImage} alt={slide.title}
                                             className="absolute inset-0 w-full h-full object-cover"/>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent/30 z-10"/>

                                        <div
                                            className="relative z-20 h-full flex flex-col justify-end p-8 md:p-14 lg:p-20">
                                            {slide.isFree && (
                                                <div className="flex items-start justify-between w-full mb-4">
                                                    <div
                                                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                                                        <Gift className="w-4 h-4 text-yellow-400"/> Haftanın Ücretsiz
                                                        Oyunu
                                                    </div>
                                                    <div className="hidden md:flex flex-col items-end text-right">
                                                        <div
                                                            className="flex items-center gap-3 text-3xl font-black text-white font-mono tracking-tight drop-shadow-lg">
                                                            <Timer
                                                                className="w-6 h-6 text-rose-500 animate-pulse"/> 02:14:45
                                                        </div>
                                                        <span
                                                            className="text-slate-300 font-bold text-xs uppercase tracking-[0.2em] mt-1 opacity-80">Sona Eriyor</span>
                                                    </div>
                                                </div>
                                            )}

                                            {slide.badge && (
                                                <div
                                                    className={cn("inline-flex items-center gap-2 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg mb-4 w-fit", slide.badgeColor)}>
                                                    <Flame className="w-3.5 h-3.5"/> {slide.badge}
                                                </div>
                                            )}

                                            <div className="max-w-4xl">
                                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9] drop-shadow-2xl">
                                                    {slide.title}
                                                </h2>

                                                <div
                                                    className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-10">
                                                    <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed drop-shadow-md">
                                                        {slide.desc}
                                                    </p>

                                                    {slide.isFree ? (
                                                        <div className="flex items-center gap-6 flex-shrink-0">
                                                            <div className="flex flex-col items-end">
                                                                <span
                                                                    className="text-xl text-slate-400 line-through font-bold decoration-rose-500 decoration-4">${slide.price}</span>
                                                                <span
                                                                    className="text-5xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(34,197,94,0.6)]">ÜCRETSİZ</span>
                                                            </div>
                                                            <Button
                                                                onClick={() => {
                                                                    const gameToAdd = games?.find(g => g.id === FREE_GAME_ID);
                                                                    if (gameToAdd) addToCart({
                                                                        ...gameToAdd,
                                                                        price: 0,
                                                                        originalPrice: gameToAdd.price
                                                                    });
                                                                }}
                                                                className="h-20 px-12 rounded-2xl bg-white text-slate-950 hover:bg-rose-600 hover:text-white font-black text-xl tracking-tight transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(225,29,72,0.6)] hover:scale-105 active:scale-95 group/btn cursor-pointer"
                                                            >
                                                                KÜTÜPHANEYE EKLE <Rocket
                                                                className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 transition-transform"/>
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            onClick={() => {
                                                                if (slide.id === "gta-vi") {
                                                                    const found = games?.find(g => g.id === 1);
                                                                    if (found) setSelectedGame(found);
                                                                } else if (slide.id === "monster-hunter") {
                                                                    const found = games?.find(g => g.id === 3);
                                                                    if (found) setSelectedGame(found);
                                                                }
                                                            }}
                                                            className="h-16 px-10 rounded-2xl bg-white text-slate-900 hover:bg-blue-600 hover:text-white font-black text-lg tracking-tight transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                                                        >
                                                            {slide.btnText || "İncele"}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentSlide(idx);
                                    }}
                                    className={cn("h-3 rounded-full transition-all duration-500 shadow-sm cursor-pointer",
                                        idx === currentSlide ? "w-12 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {(view === "favorites" || view === "new-releases" || view === "on-sale") && (
                    <div
                        className="relative w-full h-80 rounded-3xl overflow-hidden mb-12 text-white bg-gradient-to-r from-slate-900 to-slate-800">
                        <div
                            className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"/>

                        <div className="relative z-10 max-w-2xl h-full flex flex-col justify-center p-10 md:p-16">
                            <div
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-6 w-fit">
                                <Sparkles className="w-4 h-4 text-yellow-300"/>
                                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                                    {heroContent.badge}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                                {heroContent.title}
                            </h1>

                            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8 max-w-lg">
                                {heroContent.desc}
                            </p>

                            <Button
                                onClick={() => document.getElementById('games-grid')?.scrollIntoView({behavior: 'smooth'})}
                                className="rounded-xl h-12 px-8 bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer w-fit">
                                Keşfetmeye Başla
                            </Button>
                        </div>
                    </div>
                )}

                {view === "library" && (
                    <LibraryView onGoHome={resetToHome}/>
                )}

                {view === "wishlist" && (
                    <WishlistView
                        onGoHome={resetToHome}
                        onSelectGame={(game) => setSelectedGame(game)}
                    />
                )}

                {view === "cart" ? (
                    <CartView
                        onGoHome={resetToHome}
                        onGoToLibrary={() => navigateTo("library")}
                    />
                ) : isInfoPage ? (
                    renderInfoPage()
                ) : !isSpecialPage && (
                    <div id="games-grid">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {currentGames?.map((originalGame) => {
                                const isDiscounted = originalGame.id % 3 === 0;
                                const isFreeGameOfTheWeek = originalGame.id === FREE_GAME_ID;
                                const gameInLibrary = isInLibrary(originalGame.id);
                                const gameInWishlist = isInWishlist(originalGame.id);

                                let finalPrice = originalGame.price;
                                let originalPrice = originalGame.price;

                                if (isFreeGameOfTheWeek) {
                                    finalPrice = 0;
                                } else if (isDiscounted) {
                                    finalPrice = Math.floor(originalGame.price * 0.8);
                                }

                                const game = {...originalGame, price: finalPrice, originalPrice: originalPrice};
                                const userVote = userRatings[game.id];
                                const displayedRating = userVote ? ((game.rating * 50 + userVote) / 51).toFixed(1) : game.rating;

                                return (
                                    <Card
                                        key={game.id}
                                        onClick={() => setSelectedGame({
                                            ...game,
                                            originalPrice: originalGame.price
                                        } as any)}
                                        className="group relative flex flex-col border-0 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden cursor-pointer"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                            <img
                                                src={game.coverImage}
                                                alt={game.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"/>

                                            {gameInLibrary && (
                                                <div
                                                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                    <Library className="w-3.5 h-3.5"/> KÜTÜPHANENDE
                                                </div>
                                            )}

                                            {!gameInLibrary && originalGame.isUpcoming && (
                                                <div
                                                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                    <Clock className="w-3.5 h-3.5"/> YAKINDA
                                                </div>
                                            )}

                                            {!gameInLibrary && !originalGame.isUpcoming && isFreeGameOfTheWeek && (
                                                <div
                                                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-green-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
                                                    <Gift className="w-3.5 h-3.5 fill-white"/> HAFTANIN ÜCRETSİZ OYUNU
                                                </div>
                                            )}

                                            {!gameInLibrary && !originalGame.isUpcoming && !isFreeGameOfTheWeek && isDiscounted && (
                                                <div
                                                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-rose-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                    <Zap className="w-3.5 h-3.5 fill-white"/> %20 İNDİRİM
                                                </div>
                                            )}

                                            <div className="absolute top-4 right-4 z-20 flex gap-2">
                                                {!gameInLibrary && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            addToWishlist(game)
                                                        }}
                                                        className={cn(
                                                            "p-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/20",
                                                            gameInWishlist
                                                                ? "bg-amber-500 text-white"
                                                                : "bg-white/10 hover:bg-white/20 text-white"
                                                        )}
                                                    >
                                                        <ClipboardList className="w-5 h-5"/>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleFavorite(game.id)
                                                    }}
                                                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
                                                >
                                                    <Heart
                                                        className={cn(
                                                            "w-5 h-5 transition-colors duration-300",
                                                            favorites.includes(game.id) ? "fill-rose-500 text-rose-500" : "text-white"
                                                        )}
                                                    />
                                                </button>
                                            </div>

                                            <div
                                                className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                                <div
                                                    className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                                                    <Star
                                                        className={cn("w-3.5 h-3.5", userVote ? "fill-blue-500 text-blue-500" : "fill-yellow-400 text-yellow-500")}/>
                                                    {displayedRating} {userVote &&
                                                    <span className="text-[10px] text-slate-500 font-normal">(Senin Puanın)</span>}
                                                </div>
                                                <div
                                                    className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wider border border-white/10">
                                                    {game.category}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-grow p-5">
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                                                    {game.title}
                                                </h3>
                                                <div className="flex items-center text-xs text-slate-500 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5"/>
                                                    {game.releaseDate}
                                                </div>
                                            </div>

                                            <div
                                                className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                                <div className="flex flex-col">
                                                    {!gameInLibrary && (isDiscounted || isFreeGameOfTheWeek) && (
                                                        <span
                                                            className="text-xs text-slate-400 line-through font-medium mb-0.5">
                                                            ${originalGame.price}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        {gameInLibrary ? (
                                                            <span className="text-lg font-bold text-indigo-600">
                                                                Sahipsin
                                                            </span>
                                                        ) : originalGame.isUpcoming ? (
                                                            <span className="text-lg font-bold text-purple-600">
                                                                Yakında • ${game.price}
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className={cn("text-xl font-extrabold tracking-tight", (isDiscounted || isFreeGameOfTheWeek) ? "text-rose-600" : "text-slate-900")}>
                                                                {game.price === 0 ? "Ücretsiz" : `$${game.price}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedGame({
                                                                ...game,
                                                                originalPrice: originalGame.price
                                                            } as any);
                                                        }}
                                                    >
                                                        <Eye className="w-5 h-5"/>
                                                    </Button>

                                                    {gameInLibrary ? (
                                                        <Button
                                                            className="h-10 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all duration-300 active:scale-95 cursor-pointer font-bold text-xs gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigateTo("library");
                                                            }}
                                                        >
                                                            <Library className="w-4 h-4"/>
                                                            KÜTÜPHANE
                                                        </Button>
                                                    ) : originalGame.isUpcoming ? (
                                                        <Button
                                                            className={cn(
                                                                "h-10 px-4 rounded-xl shadow-md transition-all duration-300 active:scale-95 cursor-pointer font-bold text-xs gap-2",
                                                                gameInWishlist
                                                                    ? "bg-amber-500 text-white hover:bg-amber-600"
                                                                    : "bg-purple-600 text-white hover:bg-purple-700"
                                                            )}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToWishlist(game);
                                                            }}
                                                        >
                                                            <ClipboardList className="w-4 h-4"/>
                                                            {gameInWishlist ? "LİSTEDE" : "İSTEK LİSTESİ"}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            className="h-10 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-slate-200 transition-all duration-300 active:scale-95 cursor-pointer font-bold text-xs gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(game);
                                                            }}
                                                        >
                                                            <ShoppingBasket className="w-4 h-4"/>
                                                            EKLE
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {filteredGames && filteredGames.length > ITEMS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-3 mt-16 py-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="h-11 px-6 rounded-xl border-slate-200 hover:bg-white hover:border-slate-400 hover:text-slate-900 cursor-pointer font-medium transition-all hover:shadow-md disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2"/> Önceki
                                </Button>

                                <div
                                    className="h-11 px-6 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">
                                    {currentPage} / {totalPages}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="h-11 px-6 rounded-xl border-slate-200 hover:bg-white hover:border-slate-400 hover:text-slate-900 cursor-pointer font-medium transition-all hover:shadow-md disabled:opacity-50"
                                >
                                    Sonraki <ChevronRight className="w-4 h-4 ml-2"/>
                                </Button>
                            </div>
                        )}

                        {filteredGames?.length === 0 && (
                            <div
                                className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-500">
                                <div
                                    className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                    <Search className="w-10 h-10 text-slate-300"/>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sonuç Bulunamadı</h3>
                                <p className="text-slate-500 mb-8">Arama kriterlerinize uygun oyun yok.</p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("All")
                                    }}
                                    className="h-11 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium"
                                >
                                    Filtreleri Temizle
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/50 mt-auto">
                <div className="container mx-auto px-6 pt-16 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-white">
                                <div className="p-2 bg-slate-700 rounded-lg">
                                    <Gamepad2 className="w-5 h-5 text-white"/>
                                </div>
                                <span className="text-xl font-bold tracking-tight">GameVault</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Oyun dünyasının kalbi burada atıyor. En yeni oyunlar, en iyi fiyatlar ve eşsiz bir
                                alışveriş deneyimi için GameVault yanınızda.
                            </p>
                            <div className="flex gap-4">
                                <a href="#"
                                   className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-black-600 hover:text-white transition-all cursor-pointer">
                                    <X className="w-4 h-4"/>
                                </a>
                                <a href="#"
                                   className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-orange-300 hover:text-white transition-all cursor-pointer">
                                    <Instagram className="w-4 h-4"/>
                                </a>
                                <a href="#"
                                   className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                                    <Youtube className="w-4 h-4"/>
                                </a>
                                <a href="#"
                                   className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-slate-600 hover:text-white transition-all cursor-pointer">
                                    <Facebook className="w-4 h-4"/>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6">Hızlı Erişim</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a onClick={() => navigateTo("home")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Mağaza</a></li>
                                <li><a onClick={() => navigateTo("library")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Kütüphane</a>
                                </li>
                                <li><a onClick={() => navigateTo("wishlist")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">İstek
                                    Listesi</a></li>
                                <li><a onClick={() => navigateTo("favorites")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Favoriler</a>
                                </li>
                                <li><a onClick={() => navigateTo("cart")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Sepetim</a>
                                </li>
                                <li><a onClick={() => navigateTo("new-releases")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Yeni
                                    Çıkanlar</a></li>
                                <li><a onClick={() => navigateTo("on-sale")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">İndirimler</a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6">Destek</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a onClick={() => navigateTo("help")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Yardım
                                    Merkezi</a></li>
                                <li><a onClick={() => navigateTo("returns")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">İade
                                    Politikası</a></li>
                                <li><a onClick={() => navigateTo("privacy")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Gizlilik
                                    Politikası</a></li>
                                <li><a onClick={() => navigateTo("terms")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">Kullanım
                                    Koşulları</a></li>
                                <li><a onClick={() => navigateTo("contact")}
                                       className="hover:text-slate-200 transition-colors cursor-pointer">İletişim</a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6">Partnerlerimiz</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className="bg-slate-900 p-3 rounded-lg flex items-center justify-center border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                                    <span
                                        className="font-bold text-slate-500 hover:text-white transition-colors">NVIDIA</span>
                                </div>
                                <div
                                    className="bg-slate-900 p-3 rounded-lg flex items-center justify-center border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                                    <span
                                        className="font-bold text-slate-500 hover:text-white transition-colors">AMD</span>
                                </div>
                                <div
                                    className="bg-slate-900 p-3 rounded-lg flex items-center justify-center border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                                    <span
                                        className="font-bold text-slate-500 hover:text-white transition-colors">UNITY</span>
                                </div>
                                <div
                                    className="bg-slate-900 p-3 rounded-lg flex items-center justify-center border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                                    <span
                                        className="font-bold text-slate-500 hover:text-white transition-colors">UNREAL</span>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                <h4 className="text-slate-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4"/> Güvenli Alışveriş
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Tüm işlemleriniz 256-bit SSL sertifikası ile koruma altındadır.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                        <p>© 2026 GameVault Inc. Tüm hakları saklıdır.</p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                                <Globe className="w-4 h-4"/>
                                <span>Türkçe (TR)</span>
                            </div>
                            <span className="hidden md:block">|</span>
                            <div className="flex gap-4">
                                <a onClick={() => navigateTo("privacy")}
                                   className="hover:text-slate-400 cursor-pointer">Gizlilik</a>
                                <a onClick={() => navigateTo("terms")}
                                   className="hover:text-slate-400 cursor-pointer">Yasal</a>
                                <a href="#" className="hover:text-slate-400 cursor-pointer">Çerezler</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <GameDetail
                game={selectedGame}
                onClose={() => setSelectedGame(null)}
            />
            <Toaster position="top-center" richColors theme="light" className="font-sans font-medium"/>
        </div>
    )
}

export default App