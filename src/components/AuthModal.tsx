import { useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";

export function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen, login, register } = useGameContext();
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === "login") {
            login(name, email);
        } else {
            register(name, email);
        }
        setEmail("");
        setPassword("");
        setName("");
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value as "login" | "register");
        setEmail("");
        setPassword("");
        setName("");
    };

    return (
        <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
            <DialogContent className="sm:max-w-[400px] bg-white p-0 overflow-hidden gap-0 border-0 shadow-2xl">
                <div className="bg-slate-900 p-6 text-center">
                    <DialogTitle className="text-2xl font-black text-white tracking-tight mb-2">
                        GameVault'a Katıl
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Oyun dünyasının ayrıcalıklarından yararlanmak için giriş yap.
                    </DialogDescription>
                </div>

                <div className="p-6">
                    <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="login" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm cursor-pointer">
                                Giriş Yap
                            </TabsTrigger>
                            <TabsTrigger value="register" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm cursor-pointer">
                                Kayıt Ol
                            </TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2 animate-in slide-in-from-left-2">
                                <Label htmlFor="name">
                                    {activeTab === "login" ? "Kullanıcı Adı" : "Ad Soyad"}
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="name"
                                        required
                                        placeholder={activeTab === "login" ? "Kullanıcı adınız" : "Adınız Soyadınız"}
                                        className="pl-10 bg-slate-50 border-slate-200"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-Posta</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="ornek@email.com"
                                        className="pl-10 bg-slate-50 border-slate-200"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        placeholder="******"
                                        className="pl-10 bg-slate-50 border-slate-200"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 transition-all hover:scale-[1.02] cursor-pointer">
                                {activeTab === "login" ? (
                                    <>Giriş Yap <LogIn className="ml-2 w-4 h-4" /></>
                                ) : (
                                    <>Hesap Oluştur <UserPlus className="ml-2 w-4 h-4" /></>
                                )}
                            </Button>
                        </form>
                    </Tabs>
                </div>
                <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                    Devam ederek Kullanım Koşulları'nı kabul etmiş sayılırsınız.
                </div>
            </DialogContent>
        </Dialog>
    );
}