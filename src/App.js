import { useState } from "react";

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  primaryDark: "#3730A3",
  text: "#111827",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  border: "#E5E7EB",
  bg: "#F9FAFB",
  white: "#FFFFFF",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const SAMPLE_ADS = [
  { id: 1, title: "شقة للبيع — مدينة نصر", price: "١٬٢٠٠٬٠٠٠", unit: "جنيه", category: "عقارات", location: "القاهرة", emoji: "🏢", badge: "مميز", badgeColor: COLORS.warning, time: "منذ ٣ ساعات", desc: "شقة ١٢٠م² تشطيب سوبر لوكس، ٣ غرف وصالة، الدور الثالث، موقع ممتاز.", seller: "أحمد محمد", rating: "٤.٨" },
  { id: 2, title: "تويوتا كورولا 2022", price: "٣٥٠٬٠٠٠", unit: "جنيه", category: "سيارات", location: "الجيزة", emoji: "🚗", badge: "جديد", badgeColor: COLORS.success, time: "منذ ٥ ساعات", desc: "سيارة بحالة ممتازة، ماشية ٤٥ ألف كيلو، فل أوبشن، لون أبيض.", seller: "محمد علي", rating: "٤.٥" },
  { id: 3, title: "مطلوب مهندس برمجيات", price: "١٥٬٠٠٠", unit: "جنيه/شهر", category: "وظائف", location: "التجمع الخامس", emoji: "💼", badge: "وظيفة", badgeColor: COLORS.primary, time: "منذ يوم", desc: "مطلوب مهندس React وNode.js خبرة ٣ سنوات على الأقل، دوام كامل.", seller: "شركة تك مصر", rating: "٤.٩" },
  { id: 4, title: "آيفون 15 Pro Max", price: "٥٥٬٠٠٠", unit: "جنيه", category: "إلكترونيات", location: "وسط البلد", emoji: "📱", badge: "جديد", badgeColor: COLORS.success, time: "منذ يومين", desc: "آيفون 15 Pro Max 256GB، لون تيتانيوم، مع الكرتونة والملحقات.", seller: "سارة أحمد", rating: "٤.٧" },
  { id: 5, title: "طقم أنتريه كامل", price: "٢٥٬٠٠٠", unit: "جنيه", category: "أثاث", location: "شبرا الخيمة", emoji: "🛋️", badge: null, time: "منذ ٣ أيام", desc: "طقم أنتريه ٧ قطع بحالة ممتازة، خشب زان طبيعي، لون بيج.", seller: "كريم السيد", rating: "٤.٣" },
  { id: 6, title: "فيلا للإيجار — الشيخ زايد", price: "١٨٬٠٠٠", unit: "جنيه/شهر", category: "عقارات", location: "الجيزة", emoji: "🏠", badge: "مميز", badgeColor: COLORS.warning, time: "منذ ٤ أيام", desc: "فيلا ٣٥٠م² + حديقة، ٥ غرف، ٣ حمامات، جراج، كمبوند راقي.", seller: "نادية حسن", rating: "٥.٠" },
  { id: 7, title: "لابتوب Dell XPS 15", price: "٤٥٬٠٠٠", unit: "جنيه", category: "إلكترونيات", location: "المعادي", emoji: "💻", badge: null, time: "منذ ٥ أيام", desc: "Dell XPS 15 Core i7 الجيل الـ١٣، رام ١٦GB، SSD 512GB.", seller: "عمر خالد", rating: "٤.٦" },
  { id: 8, title: "مطعم للبيع — الزمالك", price: "٨٠٠٬٠٠٠", unit: "جنيه", category: "تجارة", location: "القاهرة", emoji: "🍽️", badge: "مميز", badgeColor: COLORS.warning, time: "منذ أسبوع", desc: "مطعم شغّال على وسط الزمالك، مساحة ١٥٠م²، تجهيزات كاملة.", seller: "هشام فاروق", rating: "٤.٤" },
];

const CATEGORIES = ["الكل", "عقارات", "سيارات", "وظائف", "إلكترونيات", "أثاث", "تجارة"];
const GOVERNORATES = ["القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "أسوان", "الأقصر"];

const S = {
  app: { fontFamily: "'Cairo', 'Segoe UI', sans-serif", direction: "rtl", minHeight: "100vh", background: COLORS.bg, color: COLORS.text },
  topbar: { background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoIcon: { width: 36, height: 36, borderRadius: 10, background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 },
  logoText: { fontSize: 20, fontWeight: 700, color: COLORS.primary },
  navLinks: { display: "flex", gap: 8, alignItems: "center" },
  btnOutline: { border: `1px solid ${COLORS.border}`, background: "transparent", padding: "7px 16px", borderRadius: 8, fontSize: 14, cursor: "pointer", color: COLORS.text, fontFamily: "inherit" },
  btnPrimary: { background: COLORS.primary, color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" },
  hero: { background: COLORS.primary, padding: "48px 24px 56px", textAlign: "center" },
  heroTitle: { fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 10 },
  heroSub: { fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 28 },
  searchBox: { maxWidth: 620, margin: "0 auto", display: "flex", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
  searchSelect: { border: "none", padding: "14px 16px", fontSize: 14, background: COLORS.bg, color: COLORS.textMuted, borderLeft: `1px solid ${COLORS.border}`, outline: "none", cursor: "pointer", fontFamily: "inherit" },
  searchInput: { flex: 1, border: "none", padding: "14px 16px", fontSize: 15, outline: "none", fontFamily: "inherit" },
  searchBtn: { background: COLORS.primary, color: "#fff", border: "none", padding: "14px 24px", fontSize: 15, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" },
  statsBar: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: COLORS.white, borderBottom: `1px solid ${COLORS.border}` },
  statItem: { padding: "16px 24px", textAlign: "center", borderLeft: `1px solid ${COLORS.border}` },
  statNum: { fontSize: 22, fontWeight: 800, color: COLORS.primary },
  statLbl: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  catsBar: { background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "12px 24px", display: "flex", gap: 8, overflowX: "auto" },
  catPill: (active) => ({ padding: "7px 18px", borderRadius: 20, fontSize: 14, cursor: "pointer", border: `1px solid ${active ? COLORS.primary : COLORS.border}`, background: active ? COLORS.primary : COLORS.white, color: active ? "#fff" : COLORS.textMuted, fontFamily: "inherit", whiteSpace: "nowrap", fontWeight: active ? 600 : 400 }),
  mainLayout: { display: "grid", gridTemplateColumns: "240px 1fr", maxWidth: 1200, margin: "0 auto", padding: "24px 16px", gap: 24 },
  sidebar: { background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, height: "fit-content" },
  sideTitle: { fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  checkLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: COLORS.text, marginBottom: 10, cursor: "pointer" },
  priceRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 },
  priceInput: { border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%" },
  adsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  adCard: { background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s, transform 0.1s" },
  adImg: (bg) => ({ height: 160, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }),
  adBadge: (color) => ({ position: "absolute", top: 10, right: 10, background: color, color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }),
  adBody: { padding: "14px 16px" },
  adTitle: { fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  adLoc: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 },
  adPrice: { fontSize: 18, fontWeight: 800, color: COLORS.primary },
  adUnit: { fontSize: 12, color: COLORS.textMuted, fontWeight: 400 },
  adFoot: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` },
  adTime: { fontSize: 11, color: COLORS.textLight },
  iconBtn: { width: 32, height: 32, border: `1px solid ${COLORS.border}`, borderRadius: 8, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: COLORS.textMuted },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modalBox: { background: COLORS.white, borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: 700 },
  modalBody: { padding: 24 },
  formGroup: { marginBottom: 18 },
  formLabel: { display: "block", fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6 },
  formInput: { width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  formSelect: { width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", background: COLORS.white, boxSizing: "border-box" },
  formTextarea: { width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical", minHeight: 100, boxSizing: "border-box" },
  uploadBox: { border: `2px dashed ${COLORS.border}`, borderRadius: 10, padding: 28, textAlign: "center", cursor: "pointer", color: COLORS.textMuted, fontSize: 14 },
  detailImg: { height: 280, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 },
  detailBody: { padding: "20px 24px" },
  detailTitle: { fontSize: 22, fontWeight: 800, marginBottom: 8 },
  detailPrice: { fontSize: 28, fontWeight: 800, color: COLORS.primary, marginBottom: 16 },
  detailRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 },
  sellerBox: { display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: `1px solid ${COLORS.border}` },
  avatar: { width: 44, height: 44, borderRadius: "50%", background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: COLORS.primary },
  actionsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 },
  btnCall: { border: `2px solid ${COLORS.primary}`, color: COLORS.primary, background: "transparent", borderRadius: 10, padding: 12, fontSize: 15, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
  btnWa: { background: "#25D366", color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 15, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
  emptyBadge: { width: 20, height: 20 },
};

const BG_COLORS = { "عقارات": "#EEF2FF", "سيارات": "#FFF7ED", "وظائف": "#F0FDF4", "إلكترونيات": "#FDF2F8", "أثاث": "#FFFBEB", "تجارة": "#FFF1F2" };

export default function AdsApp() {
  const [page, setPage] = useState("home");
  const [selectedAd, setSelectedAd] = useState(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showPostAd, setShowPostAd] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [postForm, setPostForm] = useState({ title: "", category: "", price: "", location: "", desc: "" });
  const [toast, setToast] = useState(null);
  const [ads, setAds] = useState(SAMPLE_ADS);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const filteredAds = ads.filter(ad => {
    const matchCat = activeCategory === "الكل" || ad.category === activeCategory;
    const matchSearch = !searchQuery || ad.title.includes(searchQuery) || ad.category.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) { showToast("من فضلك أدخل البيانات كاملة", "error"); return; }
    setIsLoggedIn(true);
    setShowLogin(false);
    showToast("أهلاً بك! تم تسجيل الدخول بنجاح ✓");
  };

  const handlePostAd = () => {
    if (!isLoggedIn) { setShowPostAd(false); setShowLogin(true); return; }
    if (!postForm.title || !postForm.category || !postForm.price) { showToast("من فضلك أكمل البيانات المطلوبة", "error"); return; }
    const newAd = {
      id: ads.length + 1, title: postForm.title, price: postForm.price, unit: "جنيه",
      category: postForm.category, location: postForm.location || "القاهرة",
      emoji: "📌", badge: "جديد", badgeColor: COLORS.success, time: "الآن",
      desc: postForm.desc, seller: "أنت", rating: "جديد"
    };
    setAds(prev => [newAd, ...prev]);
    setShowPostAd(false);
    setPostForm({ title: "", category: "", price: "", location: "", desc: "" });
    showToast("تم نشر إعلانك بنجاح! ✓");
  };

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? COLORS.danger : COLORS.success, color: "#fff", padding: "12px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, zIndex: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.logo} onClick={() => setPage("home")}>
          <div style={S.logoIcon}>⚡</div>
          <span style={S.logoText}>إعلاناتي</span>
        </div>
        <div style={S.navLinks}>
          {isLoggedIn && (
            <button style={S.btnOutline} onClick={() => setPage("favorites")}>
              ❤️ المحفوظة ({favorites.length})
            </button>
          )}
          {isLoggedIn ? (
            <button style={S.btnOutline} onClick={() => { setIsLoggedIn(false); showToast("تم تسجيل الخروج"); }}>تسجيل خروج</button>
          ) : (
            <button style={S.btnOutline} onClick={() => setShowLogin(true)}>تسجيل الدخول</button>
          )}
          <button style={S.btnPrimary} onClick={() => setShowPostAd(true)}>+ نشر إعلان</button>
        </div>
      </div>

      {/* Hero */}
      {page === "home" && (
        <>
          <div style={S.hero}>
            <h1 style={S.heroTitle}>ابحث عن كل حاجة محتاجها في مكان واحد</h1>
            <p style={S.heroSub}>ملايين الإعلانات في مصر — عقارات، سيارات، وظائف، وأكتر</p>
            <div style={S.searchBox}>
              <select style={S.searchSelect} onChange={e => setActiveCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input style={S.searchInput} placeholder="ابحث عن أي شيء..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && setPage("home")} />
              <button style={S.searchBtn}>🔍 بحث</button>
            </div>
          </div>

          <div style={S.statsBar}>
            {[["١٫٢م+", "إعلان نشط"], ["٣٨٠ ألف", "مستخدم مسجل"], ["٢٧ محافظة", "تغطية كاملة"], ["١٢٠ ألف", "صفقة ناجحة"]].map(([num, lbl]) => (
              <div key={lbl} style={S.statItem}>
                <div style={S.statNum}>{num}</div>
                <div style={S.statLbl}>{lbl}</div>
              </div>
            ))}
          </div>

          <div style={S.catsBar}>
            {CATEGORIES.map(c => (
              <button key={c} style={S.catPill(activeCategory === c)} onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>

          <div style={S.mainLayout}>
            {/* Sidebar */}
            <div style={S.sidebar}>
              <div style={{ marginBottom: 20 }}>
                <div style={S.sideTitle}>الموقع</div>
                {GOVERNORATES.map(g => (
                  <label key={g} style={S.checkLabel}>
                    <input type="checkbox" style={{ accentColor: COLORS.primary }} /> {g}
                  </label>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={S.sideTitle}>نطاق السعر (جنيه)</div>
                <div style={S.priceRow}>
                  <input style={S.priceInput} type="number" placeholder="من" />
                  <input style={S.priceInput} type="number" placeholder="إلى" />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={S.sideTitle}>الحالة</div>
                {["الكل", "جديد", "مستعمل"].map(s => (
                  <label key={s} style={S.checkLabel}>
                    <input type="radio" name="cond" defaultChecked={s === "الكل"} style={{ accentColor: COLORS.primary }} /> {s}
                  </label>
                ))}
              </div>
              <div>
                <div style={S.sideTitle}>تاريخ النشر</div>
                {["أي وقت", "اليوم", "هذا الأسبوع", "هذا الشهر"].map(d => (
                  <label key={d} style={S.checkLabel}>
                    <input type="radio" name="date" defaultChecked={d === "أي وقت"} style={{ accentColor: COLORS.primary }} /> {d}
                  </label>
                ))}
              </div>
              <button style={{ ...S.btnPrimary, width: "100%", marginTop: 16, padding: 10 }}>تطبيق الفلتر</button>
            </div>

            {/* Ads Grid */}
            <div>
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, color: COLORS.textMuted }}>{filteredAds.length} إعلان</span>
                <select style={{ ...S.formSelect, width: "auto", padding: "7px 12px" }}>
                  <option>الأحدث أولاً</option>
                  <option>السعر: الأقل أولاً</option>
                  <option>السعر: الأعلى أولاً</option>
                </select>
              </div>
              {filteredAds.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: COLORS.textMuted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>مفيش نتائج</div>
                  <div style={{ fontSize: 14, marginTop: 6 }}>جرب تغير الفلتر أو البحث</div>
                </div>
              ) : (
                <div style={S.adsGrid}>
                  {filteredAds.map(ad => (
                    <div key={ad.id} style={S.adCard} onClick={() => { setSelectedAd(ad); setPage("detail"); }}>
                      <div style={S.adImg(BG_COLORS[ad.category] || "#F3F4F6")}>
                        {ad.emoji}
                        {ad.badge && <span style={S.adBadge(ad.badgeColor)}>{ad.badge}</span>}
                      </div>
                      <div style={S.adBody}>
                        <div style={S.adTitle}>{ad.title}</div>
                        <div style={S.adLoc}>📍 {ad.location}</div>
                        <div style={S.adPrice}>{ad.price} <span style={S.adUnit}>{ad.unit}</span></div>
                        <div style={S.adFoot}>
                          <span style={S.adTime}>{ad.time}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ ...S.iconBtn, color: favorites.includes(ad.id) ? COLORS.danger : COLORS.textMuted }} onClick={e => toggleFav(ad.id, e)}>
                              {favorites.includes(ad.id) ? "❤️" : "🤍"}
                            </button>
                            <button style={S.iconBtn} onClick={e => e.stopPropagation()}>💬</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Favorites Page */}
      {page === "favorites" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button style={S.btnOutline} onClick={() => setPage("home")}>→ رجوع</button>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>الإعلانات المحفوظة</h2>
          </div>
          {favorites.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: COLORS.textMuted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>مفيش إعلانات محفوظة</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>اضغط على قلب أي إعلان لحفظه</div>
              <button style={{ ...S.btnPrimary, marginTop: 20 }} onClick={() => setPage("home")}>تصفح الإعلانات</button>
            </div>
          ) : (
            <div style={S.adsGrid}>
              {ads.filter(a => favorites.includes(a.id)).map(ad => (
                <div key={ad.id} style={S.adCard} onClick={() => { setSelectedAd(ad); setPage("detail"); }}>
                  <div style={S.adImg(BG_COLORS[ad.category] || "#F3F4F6")}>{ad.emoji}</div>
                  <div style={S.adBody}>
                    <div style={S.adTitle}>{ad.title}</div>
                    <div style={S.adLoc}>📍 {ad.location}</div>
                    <div style={S.adPrice}>{ad.price} <span style={S.adUnit}>{ad.unit}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Page */}
      {page === "detail" && selectedAd && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
          <button style={{ ...S.btnOutline, marginBottom: 20 }} onClick={() => setPage("home")}>→ رجوع للإعلانات</button>
          <div style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
            <div style={{ ...S.detailImg, background: BG_COLORS[selectedAd.category] || "#F3F4F6" }}>
              {selectedAd.emoji}
              {selectedAd.badge && <span style={{ ...S.adBadge(selectedAd.badgeColor), fontSize: 13, padding: "5px 14px" }}>{selectedAd.badge}</span>}
            </div>
            <div style={S.detailBody}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={S.detailTitle}>{selectedAd.title}</div>
                <button style={{ ...S.iconBtn, width: 40, height: 40, fontSize: 20 }} onClick={() => toggleFav(selectedAd.id, { stopPropagation: () => {} })}>
                  {favorites.includes(selectedAd.id) ? "❤️" : "🤍"}
                </button>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 14 }}>📍 {selectedAd.location} · {selectedAd.time}</div>
              <div style={S.detailPrice}>{selectedAd.price} <span style={{ fontSize: 16, fontWeight: 400, color: COLORS.textMuted }}>{selectedAd.unit}</span></div>

              <div style={{ background: COLORS.bg, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>تفاصيل الإعلان</div>
                <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.8 }}>{selectedAd.desc}</div>
              </div>

              <div style={S.detailRow}><span style={{ color: COLORS.textMuted }}>الفئة</span><span style={{ fontWeight: 700 }}>{selectedAd.category}</span></div>
              <div style={S.detailRow}><span style={{ color: COLORS.textMuted }}>الموقع</span><span style={{ fontWeight: 700 }}>{selectedAd.location}</span></div>
              <div style={S.detailRow}><span style={{ color: COLORS.textMuted }}>تاريخ النشر</span><span style={{ fontWeight: 700 }}>{selectedAd.time}</span></div>
              <div style={{ ...S.detailRow, borderBottom: "none" }}><span style={{ color: COLORS.textMuted }}>حالة الإعلان</span><span style={{ fontWeight: 700, color: COLORS.success }}>متاح ✓</span></div>

              <div style={S.sellerBox}>
                <div style={S.avatar}>{selectedAd.seller[0]}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedAd.seller}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>⭐ {selectedAd.rating} — بائع موثوق</div>
                </div>
              </div>

              <div style={S.actionsRow}>
                <button style={S.btnCall}>📞 اتصال</button>
                <button style={S.btnWa}>💬 واتساب</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div style={S.modal} onClick={() => setShowLogin(false)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <span style={S.modalTitle}>تسجيل الدخول</span>
              <button style={{ ...S.iconBtn, fontSize: 20 }} onClick={() => setShowLogin(false)}>✕</button>
            </div>
            <div style={S.modalBody}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 40 }}>⚡</div>
                <div style={{ fontSize: 16, color: COLORS.textMuted, marginTop: 8 }}>أهلاً بك في إعلاناتي</div>
              </div>
              <div style={S.formGroup}>
                <label style={S.formLabel}>البريد الإلكتروني</label>
                <input style={S.formInput} type="email" placeholder="example@email.com" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>
              <div style={S.formGroup}>
                <label style={S.formLabel}>كلمة المرور</label>
                <input style={S.formInput} type="password" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
              </div>
              <button style={{ ...S.btnPrimary, width: "100%", padding: 13, fontSize: 16, borderRadius: 10 }} onClick={handleLogin}>تسجيل الدخول</button>
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: COLORS.textMuted }}>
                مش عندك حساب؟ <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 700 }}>سجّل دلوقتي</span>
              </div>
              <div style={{ textAlign: "center", marginTop: 20, padding: "16px 0", borderTop: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textLight }}>
                أو استمر بـ
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button style={{ ...S.btnOutline, padding: 11, borderRadius: 10, fontSize: 14 }}>🌐 Google</button>
                <button style={{ ...S.btnOutline, padding: 11, borderRadius: 10, fontSize: 14 }}>📘 Facebook</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Ad Modal */}
      {showPostAd && (
        <div style={S.modal} onClick={() => setShowPostAd(false)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ ...S.modalHeader, background: COLORS.primary }}>
              <span style={{ ...S.modalTitle, color: "#fff" }}>نشر إعلان جديد</span>
              <button style={{ ...S.iconBtn, color: "#fff", border: "none" }} onClick={() => setShowPostAd(false)}>✕</button>
            </div>
            <div style={S.modalBody}>
              <div style={S.uploadBox}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                أضف صور الإعلان (اختياري)
                <div style={{ fontSize: 12, marginTop: 4, color: COLORS.textLight }}>JPG، PNG — حتى ٥ صور</div>
              </div>
              <div style={{ height: 16 }} />
              <div style={S.formGroup}>
                <label style={S.formLabel}>فئة الإعلان *</label>
                <select style={S.formSelect} value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })}>
                  <option value="">اختر الفئة</option>
                  {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={S.formGroup}>
                <label style={S.formLabel}>عنوان الإعلان *</label>
                <input style={S.formInput} type="text" placeholder="مثال: شقة للبيع بمدينة نصر" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={S.formGroup}>
                  <label style={S.formLabel}>السعر (جنيه) *</label>
                  <input style={S.formInput} type="number" placeholder="٠" value={postForm.price} onChange={e => setPostForm({ ...postForm, price: e.target.value })} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.formLabel}>المحافظة</label>
                  <select style={S.formSelect} value={postForm.location} onChange={e => setPostForm({ ...postForm, location: e.target.value })}>
                    <option value="">اختر</option>
                    {GOVERNORATES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div style={S.formGroup}>
                <label style={S.formLabel}>وصف الإعلان</label>
                <textarea style={S.formTextarea} placeholder="اكتب تفاصيل الإعلان هنا..." value={postForm.desc} onChange={e => setPostForm({ ...postForm, desc: e.target.value })} />
              </div>
              <button style={{ ...S.btnPrimary, width: "100%", padding: 14, fontSize: 16, borderRadius: 10 }} onClick={handlePostAd}>
                🚀 نشر الإعلان الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}