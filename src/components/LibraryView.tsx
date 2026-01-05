import { useState } from "react";
import { useGameContext, type LibraryGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Library,
    Download,
    Play,
    Trash2,
    Search,
    Filter,
    Grid3X3,
    List,
    Clock,
    HardDrive,
    CheckCircle2,
    Loader2,
    Calendar,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LibraryViewProps {
    onGoHome: () => void;
}

export function LibraryView({ onGoHome }: LibraryViewProps) {
    const { library, installGame, uninstallGame, userRatings } = useGameContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "installed" | "not-installed">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<"recent" | "name" | "rating">("recent");

    const filteredGames = library
        .filter((game) => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterStatus === "all" ||
                (filterStatus === "installed" && game.isInstalled) ||
                (filterStatus === "not-installed" && !game.isInstalled);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "recent") {
                return new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime();
            }
            if (sortBy === "name") {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === "rating") {
                return (userRatings[b.id] || b.rating) - (userRatings[a.id] || a.rating);
            }
            return 0;
        });

    const installedCount = library.filter((g) => g.isInstalled).length;
    const totalCount = library.length;

    if (library.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <Library className="w-16 h-16 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900">Kütüphanen Boş</h2>
                <p className="text-slate-500 mb-6 max-w-md">
                    Henüz hiç oyun satın almadın. Mağazaya gidip harika oyunlar keşfetmeye ne dersin?
                </p>
                <Button onClick={onGoHome} size="lg" className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white">
                    Mağazaya Git
                </Button>
            </div>
        );
    }

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 mb-2">
                        <Library className="w-8 h-8 text-indigo-600" />
                        Kütüphanem
                    </h2>
                    <p className="text-slate-500">
                        <span className="font-medium text-slate-700">{totalCount}</span> oyun •{" "}
                        <span className="font-medium text-emerald-600">{installedCount}</span> kurulu
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Oyun ara..."
                            className="pl-10 w-48 bg-slate-50 border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                        <SelectTrigger className="w-40 bg-slate-50 border-slate-200">
                            <Filter className="w-4 h-4 mr-2 text-slate-500" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="installed">Kurulu</SelectItem>
                            <SelectItem value="not-installed">Kurulu Değil</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                        <SelectTrigger className="w-36 bg-slate-50 border-slate-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Son Eklenen</SelectItem>
                            <SelectItem value="name">İsim (A-Z)</SelectItem>
                            <SelectItem value="rating">Puan</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 w-8 p-0 rounded-md",
                                viewMode === "grid" && "bg-white shadow-sm"
                            )}
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 w-8 p-0 rounded-md",
                                viewMode === "list" && "bg-white shadow-sm"
                            )}
                            onClick={() => setViewMode("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {filteredGames.length === 0 ? (
                <div className="text-center py-16">
                    <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Arama kriterlerine uygun oyun bulunamadı.</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGames.map((game) => (
                        <LibraryCard key={game.id} game={game} onInstall={installGame} onUninstall={uninstallGame} userRating={userRatings[game.id]} />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredGames.map((game) => (
                        <LibraryListItem key={game.id} game={game} onInstall={installGame} onUninstall={uninstallGame} userRating={userRatings[game.id]} />
                    ))}
                </div>
            )}
        </div>
    );
}

function LibraryCard({
                         game,
                         onInstall,
                         onUninstall,
                         userRating,
                     }: {
    game: LibraryGame;
    onInstall: (id: number) => void;
    onUninstall: (id: number) => void;
    userRating?: number;
}) {
    const isInstalling = game.installProgress !== undefined && game.installProgress > 0 && game.installProgress < 100;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="relative h-44 overflow-hidden">
                <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-3 right-3">
                    {game.isInstalled ? (
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Kurulu
                        </span>
                    ) : isInstalling ? (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> %{game.installProgress}
                        </span>
                    ) : (
                        <span className="bg-slate-800/80 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                            Kurulu Değil
                        </span>
                    )}
                </div>

                <div className="absolute bottom-3 left-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase">
                        {game.category}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{game.title}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className={cn("w-3.5 h-3.5", userRating ? "fill-yellow-400 text-yellow-400" : "fill-slate-300 text-slate-300")} />
                        <span className="font-medium">{userRating || game.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(game.purchasedAt).toLocaleDateString("tr-TR")}</span>
                    </div>
                </div>

                {isInstalling && (
                    <div className="mb-4">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${game.installProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    {game.isInstalled ? (
                        <>
                            <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer">
                                <Play className="w-4 h-4 mr-2" /> Oyna
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-xl border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
                                onClick={() => onUninstall(game.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    ) : isInstalling ? (
                        <Button disabled className="flex-1 h-10 rounded-xl cursor-not-allowed">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Kuruluyor...
                        </Button>
                    ) : (
                        <Button
                            className="flex-1 h-10 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl cursor-pointer"
                            onClick={() => onInstall(game.id)}
                        >
                            <Download className="w-4 h-4 mr-2" /> Kur
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function LibraryListItem({
                             game,
                             onInstall,
                             onUninstall,
                             userRating,
                         }: {
    game: LibraryGame;
    onInstall: (id: number) => void;
    onUninstall: (id: number) => void;
    userRating?: number;
}) {
    const isInstalling = game.installProgress !== undefined && game.installProgress > 0 && game.installProgress < 100;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-all">
            <img
                src={game.coverImage}
                alt={game.title}
                className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 truncate">{game.title}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {game.category}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Star className={cn("w-3.5 h-3.5", userRating ? "fill-yellow-400 text-yellow-400" : "fill-slate-300 text-slate-300")} />
                        {userRating || game.rating}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(game.purchasedAt).toLocaleDateString("tr-TR")}
                    </div>
                    {game.isInstalled && (
                        <div className="flex items-center gap-1 text-emerald-600">
                            <HardDrive className="w-3.5 h-3.5" />
                            Kurulu
                        </div>
                    )}
                </div>

                {isInstalling && (
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden w-48">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${game.installProgress}%` }}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                {game.isInstalled ? (
                    <>
                        <Button className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer">
                            <Play className="w-4 h-4 mr-1" /> Oyna
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            onClick={() => onUninstall(game.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </>
                ) : isInstalling ? (
                    <Button disabled className="h-9 px-4 rounded-lg cursor-not-allowed">
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" /> %{game.installProgress}
                    </Button>
                ) : (
                    <Button
                        className="h-9 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-lg cursor-pointer"
                        onClick={() => onInstall(game.id)}
                    >
                        <Download className="w-4 h-4 mr-1" /> Kur
                    </Button>
                )}
            </div>
        </div>
    );
}