# ⚡ GameVault | Premium Digital Game Store

**GameVault**, modern oyuncular için tasarlanmış, yüksek performanslı ve estetik bir dijital oyun mağazası platformudur. React ve TypeScript ile geliştirilen bu proje; interaktif fragmanlar, dinamik vitrinler ve gelişmiş kullanıcı deneyimi sunar.

![GameVault Banner](https://img.icons8.com/fluency/96/lightning-bolt.png)

## 🚀 Öne Çıkan Özellikler

### 🎥 İnteraktif Deneyim
* **Sinematik Vitrin (Slider):** "Haftanın Ücretsiz Oyunu" (Gears of War: E-Day) ve beklenen yapımlar için özelleştirilmiş, video arka plan hissi veren otomatik geçişli banner.
* **Fragman Entegrasyonu:** Oyun detaylarında statik görseller yerine, doğrudan oynatılabilir **YouTube Fragmanları (Trailers)**.
* **Akıllı Duyuru Sistemi:** Kullanıcıları açılışta karşılayan, "Erdi Salgın" imzalı özel fırsatları içeren interaktif Pop-up ekranı.

### 🔐 Gelişmiş Kimlik Doğrulama & Yetkilendirme
* **Ziyaretçi Modu:** Kayıt olmadan mağazada gezinti imkanı.
* **Action Guard:** Satın alma, favoriye ekleme ve puanlama işlemleri için otomatik "Giriş Yap" modalı tetikleyicisi.
* **Dinamik Profil:** Giriş yapan kullanıcının isminin ve durumunun header'da anlık gösterimi.

### 🎮 Koleksiyon & Mağaza Yönetimi
* **Kütüphane:** Satın alınan oyunların eklendiği kalıcı alan.
* **İstek Listesi & Favoriler:** İlgilenilen oyunları takip etme ve hızlı erişim.
* **Sepet Simülasyonu:** Hızlı ekleme/çıkarma ve ödeme akışı.
* **Canlı Arama & Filtre:** Anlık kategori filtreleme ve oyun arama.

### ⭐ Dinamik Puanlama
* **Topluluk Etkisi:** Kullanıcıların verdiği yıldızların, oyunun genel puan ortalamasını (ağırlıklı algoritma ile) anlık olarak etkilediği yaşayan puan sistemi.

## 🛠 Kullanılan Teknolojiler

* **Core:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, CSS Modules
* **UI Components:** shadcn/ui (Radix UI Primitive tabanlı)
* **State Management:** React Context API
* **Data Fetching:** TanStack Query (React Query)
* **Icons:** Lucide React
* **Notifications:** Sonner
* **Media:** YouTube Embed API

## 📦 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için terminalde şu komutları sırasıyla uygulayın:

1. **Depoyu Klonlayın:**
   ```bash
   git clone [https://github.com/kullaniciadi/game-vault.git](https://github.com/kullaniciadi/game-vault.git)
   
2. **Proje Dizinine Gidin**
    ```bash
   cd game-vault
   
3. **Bağımlılıkları Yükleyin**
    ```bash
   npm install
   
4. **Uygulamayı Başlatın**
    ```bash
    npm run dev