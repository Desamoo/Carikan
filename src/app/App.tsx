import { useState, useEffect, useRef } from "react";
import {
  MapPin, Phone, MessageCircle, UtensilsCrossed, Building2,
  Wrench, Monitor, ShoppingBag, Heart, Search, Menu, X,
  Star, Clock, Truck, Package, ArrowLeft, BookOpen,
  ChevronRight, Store, Users, CheckCircle, ExternalLink,
  Filter, TrendingUp, Sparkles, Palmtree, Home,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "kuliner" | "pengrajin" | "toko" | "properti" | "wisata" | "jasa";
type City = "Samarinda" | "Balikpapan" | "Tenggarong" | "Bontang" | "Penajam" | "Sangatta";
type View = "home" | "listing" | "detail" | "article";

interface UMKM {
  id: string;
  name: string;
  category: Category;
  city: City;
  district: string;
  description: string;
  longDescription: string;
  imageId: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  menu?: { name: string; price: string; description: string }[];
  services?: string[];
  hasDelivery: boolean;
  hasPickup: boolean;
  acceptsOrders: boolean;
  rating: number;
  reviewCount: number;
  established: string;
  tags: string[];
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageId: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  featured: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TAGLINE_WORDS = [
  "Kuliner",
  "Pengrajin",
  "Toko",
  "Tempat Tinggal",
  "Spot Liburan",
  "Jasa Lokal",
];

const CATEGORIES: { id: Category; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: "kuliner",   label: "Kuliner",        icon: UtensilsCrossed, color: "#E76F51", bg: "#FEF0EC" },
  { id: "pengrajin", label: "Pengrajin",       icon: Wrench,          color: "#2D6A4F", bg: "#EAF4EE" },
  { id: "toko",      label: "Toko & Ritel",    icon: ShoppingBag,     color: "#C0783A", bg: "#FBF2E9" },
  { id: "properti",  label: "Tempat Tinggal",  icon: Home,            color: "#457B9D", bg: "#EAF2F8" },
  { id: "wisata",    label: "Spot Liburan",    icon: Palmtree,        color: "#7B5EA7", bg: "#F3EEF9" },
  { id: "jasa",      label: "Jasa Lokal",      icon: Building2,       color: "#C94040", bg: "#FAEAEA" },
];

const CITIES: City[] = ["Samarinda", "Balikpapan", "Tenggarong", "Bontang", "Penajam", "Sangatta"];

const UMKM_DATA: UMKM[] = [];

const ARTICLES: Article[] = [
  {
    id: "a1", featured: true,
    title: "10 Kuliner Wajib di Samarinda yang Bikin Kamu Betah Tidak Pulang",
    excerpt: "Dari soto banjar yang kuahnya bikin mbrebes mili sampai nasi bekepor yang hampir punah — ini adalah panduan makan di Samarinda versi orang yang pernah tinggal 3 tahun di sini.",
    imageId: "photo-1604908176997-125f25cc6f3d",
    author: "Admin_Okk", date: "2026-06-20", readTime: 9, category: "Kuliner", featured: true,
  },
  {
    id: "a2", featured: true,
    title: "Pengrajin Dayak Kaltim: Warisan Tangan yang Harus Kita Jaga",
    excerpt: "Di balik gemerlap IKN Nusantara, ada pengrajin manik dan tenun Dayak yang butuh perhatian kita. Gue menghabiskan seminggu keliling Tenggarong dan Samarinda untuk menemukan mereka.",
    imageId: "photo-1558769132-cb1aea458c5e",
    author: "Admin_Okk", date: "2026-06-12", readTime: 11, category: "Pengrajin & Budaya", featured: true,
  },
  {
    id: "a3", featured: false,
    title: "5 Spot Liburan di Kaltim yang Belum Banyak Orang Tahu",
    excerpt: "Pantai pasir hitam di Muara Badak, danau di tengah hutan Kutai, air terjun di Sangatta — Kalimantan Timur menyimpan lebih banyak dari yang kamu kira.",
    imageId: "photo-1507525428034-b723cf961d3e",
    author: "Admin_Okk", date: "2026-06-05", readTime: 8, category: "Wisata", featured: false,
  },
  {
    id: "a4", featured: false,
    title: "Review Penginapan Tepi Mahakam di Tenggarong: Worth It?",
    excerpt: "Saya menginap dua malam di Rumah Kayu Mahakam dan menyaksikan pesut dari balkon. Ini pengalaman yang tidak akan saya lupakan seumur hidup.",
    imageId: "photo-1510798831971-661eb04b3739",
    author: "Admin_Okk", date: "2026-05-28", readTime: 7, category: "Penginapan", featured: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const img = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

function trackWAClick(umkmId: string, umkmName: string) {
  try {
    const leads: unknown[] = JSON.parse(localStorage.getItem("carikan_leads") || "[]");
    leads.push({ umkmId, umkmName, timestamp: new Date().toISOString() });
    localStorage.setItem("carikan_leads", JSON.stringify(leads));
  } catch {}
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function getCategoryMeta(id: Category) {
  return CATEGORIES.find((c) => c.id === id)!;
}

// ─── Animated Tagline ─────────────────────────────────────────────────────────
function AnimatedTagline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % TAGLINE_WORDS.length);
        setVisible(true);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-2"
      style={{ fontFamily: "'Lora', Georgia, serif" }}
    >
      <span className="text-white">Carikan</span>
      <br />
      <span
        className="text-accent transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(12px)",
          display: "inline-block",
        }}
      >
        {TAGLINE_WORDS[index]}
      </span>
      <br />
      <span className="text-white/70 text-2xl sm:text-3xl font-normal italic" style={{ fontFamily: "'Lora', serif" }}>
        di Kalimantan Timur
      </span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({
  onHome, onListing, searchQuery, setSearchQuery,
}: {
  onHome: () => void;
  onListing: (city?: City, cat?: Category) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          <button onClick={onHome} className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Search className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Carikan
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                carikan.my.id
              </span>
            </div>
          </button>

          <div
            className={`hidden sm:flex flex-1 max-w-md items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
              searchFocused ? "border-primary ring-2 ring-primary/20" : "border-border bg-muted"
            }`}
          >
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Carikan kuliner, pengrajin, wisata di Kaltim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && onListing()}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-1 ml-auto">
            <button onClick={onHome} className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
              Beranda
            </button>
            <button onClick={() => onListing()} className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
              Direktori
            </button>
            <button onClick={() => onListing()} className="ml-2 px-4 py-1.5 text-sm font-semibold bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
              + Daftarkan Usaha
            </button>
          </nav>

          <button className="md:hidden ml-auto p-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="sm:hidden pb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Carikan di Kaltim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onListing()}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 flex flex-col gap-1">
            <button onClick={() => { onHome(); setMobileOpen(false); }} className="text-left px-3 py-2 text-sm font-medium hover:bg-muted rounded-md">Beranda</button>
            <button onClick={() => { onListing(); setMobileOpen(false); }} className="text-left px-3 py-2 text-sm font-medium hover:bg-muted rounded-md">Direktori</button>
            <button onClick={() => { onListing(); setMobileOpen(false); }} className="mt-1 px-3 py-2 text-sm font-semibold bg-accent text-accent-foreground rounded-lg">+ Daftarkan Usaha</button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ onListing, onDetail, onArticle }: {
  onListing: (city?: City, cat?: Category) => void;
  onDetail: (id: string) => void;
  onArticle: (id: string) => void;
}) {
  const featuredArticles = ARTICLES.filter((a) => a.featured);
  const latestArticles = ARTICLES.filter((a) => !a.featured);
  const featuredUMKM = UMKM_DATA.filter((u) => u.rating >= 4.8).slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3Ccircle cx='80' cy='0' r='2'/%3E%3Ccircle cx='0' cy='80' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs font-medium mb-8 border border-white/10">
              <Sparkles className="w-3 h-3" />
              Direktori UMKM & Usaha Lokal Kalimantan Timur
            </div>

            <AnimatedTagline />

            <p className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed mt-6">
              Dari soto banjar legendaris sampai pengrajin manik Dayak — lebih dari{" "}
              <strong className="text-white">500+ usaha lokal</strong> Kaltim ada di sini.
              Dukung ekonomi daerah, mulai dari halaman ini.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onListing()}
                className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors shadow-lg"
              >
                Jelajahi Semua
              </button>
              <button
                onClick={() => onListing()}
                className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Daftarkan Usaha Kamu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: Store,      value: UMKM_DATA.length.toString(),  label: "Usaha Terdaftar" },
              { icon: MapPin,     value: "6",     label: "Kota di Kaltim" },
              { icon: Users,      value: "8K+",   label: "Pengunjung Terhubung" },
              { icon: TrendingUp, value: "96%",   label: "Rating Positif" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg text-foreground leading-none">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Carikan Berdasarkan Kategori
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map(({ id, label, icon: Icon, color, bg }) => (
            <button
              key={id}
              onClick={() => onListing(undefined, id)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group bg-card"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Artikel &amp; Review Kaltim
          </h2>
          <button className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Semua artikel <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid lg:grid-cols-5 gap-5">
          <button
            onClick={() => onArticle(featuredArticles[0].id)}
            className="lg:col-span-3 group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="relative h-64 lg:h-80 bg-muted overflow-hidden">
              <img
                src={img(featuredArticles[0].imageId, 800, 600)}
                alt={featuredArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="inline-block px-2.5 py-1 bg-accent text-white text-xs font-semibold rounded-full mb-3">
                  {featuredArticles[0].category}
                </span>
                <h3 className="text-white text-xl font-bold leading-snug mb-2" style={{ fontFamily: "'Lora', serif" }}>
                  {featuredArticles[0].title}
                </h3>
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <span>{formatDate(featuredArticles[0].date)}</span>
                  <span>•</span>
                  <span>{featuredArticles[0].readTime} menit baca</span>
                </div>
              </div>
            </div>
          </button>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {[featuredArticles[1], ...latestArticles].slice(0, 3).map((article) => (
              <button
                key={article.id}
                onClick={() => onArticle(article.id)}
                className="group flex gap-4 p-3 rounded-xl bg-card border border-border hover:shadow-md transition-all text-left"
              >
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img
                    src={img(article.imageId, 200, 200)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-accent">{article.category}</span>
                  <h4 className="text-sm font-semibold text-foreground leading-snug mt-1 line-clamp-2" style={{ fontFamily: "'Lora', serif" }}>
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime} mnt</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured UMKM */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Pilihan Editor
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Usaha lokal Kaltim dengan ulasan terbaik</p>
            </div>
            <button onClick={() => onListing()} className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Lihat semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredUMKM.map((umkm) => (
              <UMKMCard key={umkm.id} umkm={umkm} onClick={() => onDetail(umkm.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Kota di Kalimantan Timur
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CITIES.map((city) => {
            const count = UMKM_DATA.filter((u) => u.city === city).length;
            return (
              <button
                key={city}
                onClick={() => onListing(city)}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all"
              >
                <MapPin className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm text-foreground">{city}</span>
                <span className="text-xs text-muted-foreground">{count} usaha</span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="bg-primary text-white/70 text-sm py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-sm">Carikan</span>
              <span className="text-white/50 text-[10px]">carikan.my.id</span>
            </div>
          </div>
          <p className="text-center">© 2026 Carikan. Mendukung usaha lokal Kalimantan Timur.</p>
        </div>
      </footer>
    </main>
  );
}

// ─── UMKM Card ────────────────────────────────────────────────────────────────
function UMKMCard({ umkm, onClick }: { umkm: UMKM; onClick: () => void }) {
  const cat = getCategoryMeta(umkm.category);
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      className="group text-left bg-card rounded-2xl border border-border hover:shadow-lg hover:border-primary/20 transition-all overflow-hidden"
    >
      <div className="relative h-44 bg-muted overflow-hidden">
        <img
          src={img(umkm.imageId, 600, 400)}
          alt={umkm.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: cat.bg, color: cat.color }}
          >
            <Icon className="w-3 h-3" />
            {cat.label}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-base leading-snug mb-1 group-hover:text-primary transition-colors">
          {umkm.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{umkm.district}, {umkm.city}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {umkm.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">{umkm.rating}</span>
            <span className="text-xs text-muted-foreground">({umkm.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            {umkm.hasDelivery && (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center" title="Antar">
                <Truck className="w-3 h-3 text-primary" />
              </div>
            )}
            {umkm.acceptsOrders && (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center" title="Terima Pesanan">
                <Package className="w-3 h-3 text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Listing Page ─────────────────────────────────────────────────────────────
function ListingPage({ onDetail, initialCity, initialCategory, searchQuery }: {
  onDetail: (id: string) => void;
  initialCity?: City;
  initialCategory?: Category;
  searchQuery: string;
}) {
  const [selectedCity, setSelectedCity] = useState<City | null>(initialCity || null);
  const [selectedCat, setSelectedCat] = useState<Category | null>(initialCategory || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSelectedCity(initialCity || null);
    setSelectedCat(initialCategory || null);
  }, [initialCity, initialCategory]);

  const filtered = UMKM_DATA.filter((u) => {
    if (selectedCity && u.city !== selectedCity) return false;
    if (selectedCat && u.category !== selectedCat) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Kota</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedCity(null)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCity ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}
          >
            <span>Semua Kota</span>
            <span className={`text-xs ${!selectedCity ? "text-white/70" : "text-muted-foreground"}`}>{UMKM_DATA.length}</span>
          </button>
          {CITIES.map((city) => {
            const count = UMKM_DATA.filter((u) => u.city === city && (!selectedCat || u.category === selectedCat)).length;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity === city ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}
              >
                <span>{city}</span>
                <span className={`text-xs ${selectedCity === city ? "text-white/70" : "text-muted-foreground"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Kategori</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedCat(null)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCat ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}
          >
            <span>Semua</span>
            <span className={`text-xs ${!selectedCat ? "text-white/70" : "text-muted-foreground"}`}>{UMKM_DATA.length}</span>
          </button>
          {CATEGORIES.map(({ id, label, icon: Icon, color, bg }) => {
            const count = UMKM_DATA.filter((u) => u.category === id && (!selectedCity || u.city === selectedCity)).length;
            return (
              <button
                key={id}
                onClick={() => setSelectedCat(id === selectedCat ? null : id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${selectedCat === id ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}
              >
                <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: selectedCat === id ? "rgba(255,255,255,0.2)" : bg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: selectedCat === id ? "#fff" : color }} />
                </span>
                <span className="flex-1 text-left">{label}</span>
                <span className={`text-xs ${selectedCat === id ? "text-white/70" : "text-muted-foreground"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Direktori Kaltim
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} usaha ditemukan
              {selectedCity && ` di ${selectedCity}`}
              {selectedCat && ` · ${getCategoryMeta(selectedCat).label}`}
              {searchQuery && ` · "${searchQuery}"`}
            </p>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium">
            <Filter className="w-4 h-4" />Filter
          </button>
        </div>

        {(selectedCity || selectedCat) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedCity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                <MapPin className="w-3 h-3" />{selectedCity}
                <button onClick={() => setSelectedCity(null)} className="ml-1"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCat && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-full">
                {getCategoryMeta(selectedCat).label}
                <button onClick={() => setSelectedCat(null)} className="ml-1"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-5">
              <SidebarContent />
            </div>
          </aside>

          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-card p-5 overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-foreground">Filter</h2>
                  <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Belum ada usaha terdaftar</h3>
                <p className="text-sm text-muted-foreground">Jadilah usaha pertama yang bergabung</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((umkm) => (
                  <UMKMCard key={umkm.id} umkm={umkm} onClick={() => onDetail(umkm.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Detail Page ──────────────────────────────────────────────────────────────
function DetailPage({ umkm, onBack }: { umkm: UMKM; onBack: () => void }) {
  const cat = getCategoryMeta(umkm.category);
  const Icon = cat.icon;
  const [waClicked, setWaClicked] = useState(false);

  function handleWAClick() {
    trackWAClick(umkm.id, umkm.name);
    setWaClicked(true);
    const msg = encodeURIComponent(
      `Halo ${umkm.ownerName}, saya menemukan usaha ${umkm.name} di Carikan (carikan.my.id) dan ingin tanya lebih lanjut.`
    );
    window.open(`https://wa.me/${umkm.whatsapp}?text=${msg}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="relative h-64 sm:h-80 bg-muted overflow-hidden">
        <img src={img(umkm.imageId, 1200, 600)} alt={umkm.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/30 hover:bg-black/50 text-white text-sm font-medium rounded-lg backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />Kembali
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: cat.bg, color: cat.color }}>
            <Icon className="w-3.5 h-3.5" />{cat.label}
          </span>
          <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            {umkm.name}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-foreground">{umkm.rating}</span>
                <span className="text-sm text-muted-foreground">({umkm.reviewCount} ulasan)</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" /><span>{umkm.district}, {umkm.city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" /><span>Berdiri {umkm.established}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {umkm.hasDelivery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  <Truck className="w-3.5 h-3.5" /> Antar ke Alamat
                </span>
              )}
              {umkm.hasPickup && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  <Store className="w-3.5 h-3.5" /> Ambil di Tempat
                </span>
              )}
              {umkm.acceptsOrders && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  <Package className="w-3.5 h-3.5" /> Terima Pesanan
                </span>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-bold text-foreground mb-3">Tentang Usaha Ini</h2>
              <div className="text-muted-foreground text-sm leading-relaxed">
                {umkm.longDescription.split("\n\n").map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>{para}</p>
                ))}
              </div>
            </div>

            {umkm.menu && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-bold text-foreground mb-4">Menu & Harga</h2>
                <div className="flex flex-col gap-3">
                  {umkm.menu.map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-accent">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {umkm.services && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-bold text-foreground mb-4">Layanan Tersedia</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {umkm.services.map((service, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {umkm.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{umkm.ownerName}</div>
                  <div className="text-xs text-muted-foreground">Pemilik Usaha</div>
                </div>
              </div>

              <button
                onClick={handleWAClick}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#25D366] hover:bg-[#1da955] text-white font-bold text-sm rounded-xl transition-colors shadow-md mb-3"
              >
                <MessageCircle className="w-5 h-5" />
                {waClicked ? "Membuka WhatsApp..." : "Hubungi via WhatsApp"}
              </button>
              {waClicked && (
                <p className="text-xs text-center text-muted-foreground mb-3">
                  Terima kasih telah mendukung usaha lokal Kaltim!
                </p>
              )}

              <a
                href={`tel:${umkm.phone}`}
                className="w-full flex items-center justify-center gap-2.5 py-3 border border-border text-foreground font-medium text-sm rounded-xl hover:bg-muted transition-colors"
              >
                <Phone className="w-4 h-4" />{umkm.phone}
              </a>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{umkm.address}</p>
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(umkm.address)}`, "_blank")}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-primary font-medium border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />Buka di Google Maps
                </button>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/10 p-4 text-xs text-muted-foreground leading-relaxed">
              <strong className="text-primary">carikan.my.id</strong> — Setiap klik WA dicatat untuk membantu pemilik usaha mengukur jangkauan promosinya.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Article Page ─────────────────────────────────────────────────────────────
function ArticlePage({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative h-64 sm:h-80 bg-muted overflow-hidden">
        <img src={img(article.imageId, 1200, 600)} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/30 hover:bg-black/50 text-white text-sm font-medium rounded-lg backdrop-blur-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />Kembali
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-block px-2.5 py-1 bg-accent text-white text-xs font-semibold rounded-full mb-3">{article.category}</span>
          <h1 className="text-white text-2xl sm:text-3xl font-bold leading-snug" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            {article.title}
          </h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
          <span>{article.author}</span>
          <span>•</span>
          <span>{formatDate(article.date)}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime} menit baca</span>
        </div>
        <p className="text-lg text-foreground leading-relaxed mb-6" style={{ fontFamily: "'Lora', Georgia, serif" }}>
          {article.excerpt}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed italic">
          [Konten artikel lengkap akan tersedia setelah dipublikasikan oleh redaksi carikan.my.id]
        </p>
      </div>
    </main>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedUMKM, setSelectedUMKM] = useState<UMKM | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filterCity, setFilterCity] = useState<City | undefined>(undefined);
  const [filterCat, setFilterCat] = useState<Category | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  function scrollTop() {
    containerRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }

  function goHome() {
    setView("home"); setSelectedUMKM(null); setSelectedArticle(null); scrollTop();
  }
  function goListing(city?: City, cat?: Category) {
    setFilterCity(city); setFilterCat(cat); setView("listing"); scrollTop();
  }
  function goDetail(id: string) {
    const umkm = UMKM_DATA.find((u) => u.id === id);
    if (umkm) { setSelectedUMKM(umkm); setView("detail"); scrollTop(); }
  }
  function goArticle(id: string) {
    const art = ARTICLES.find((a) => a.id === id);
    if (art) { setSelectedArticle(art); setView("article"); scrollTop(); }
  }

  return (
    <div
      ref={containerRef}
      className="size-full overflow-y-auto"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.22); }
      `}</style>

      <Navbar onHome={goHome} onListing={goListing} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {view === "home"    && <HomePage onListing={goListing} onDetail={goDetail} onArticle={goArticle} />}
      {view === "listing" && <ListingPage onDetail={goDetail} initialCity={filterCity} initialCategory={filterCat} searchQuery={searchQuery} />}
      {view === "detail"  && selectedUMKM    && <DetailPage umkm={selectedUMKM} onBack={() => goListing(selectedUMKM.city as City)} />}
      {view === "article" && selectedArticle && <ArticlePage article={selectedArticle} onBack={goHome} />}
    </div>
  );
}
