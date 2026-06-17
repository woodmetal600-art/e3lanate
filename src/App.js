import { useState, useEffect } from "react";
import { 
  auth, googleProvider, db, 
  signInWithPopup, signOut, onAuthStateChanged, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  collection, addDoc, getDocs, query, orderBy, serverTimestamp,
  where, deleteDoc, doc
} from "./firebase";

const COLORS = {
  primary: "#2563EB",      // Blue
  primaryDark: "#1D4ED8",   // Dark Blue
  primaryLight: "#DBEAFE",   // Light Blue
  accent: "#F59E0B",        // Gold/Amber
  accentLight: "#FEF3C7",   // Light Gold
  text: "#1E293B",          // Dark Slate
  textMuted: "#64748B",     // Slate
  textLight: "#94A3B8",     // Light Slate
  border: "#E2E8F0",        // Slate 200
  bg: "#F8FAFC",            // Slate 50
  white: "#FFFFFF",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  card: "#FFFFFF",
};

const CATEGORIES = [
  { id: "all", name: "الكل", icon: "🔍" },
  { id: "عقارات", name: "عقارات", icon: "🏠" },
  { id: "سيارات", name: "سيارات", icon: "🚗" },
  { id: "إلكترونيات", name: "إلكترونيات", icon: "📱" },
  { id: "أثاث", name: "أثاث", icon: "🛋️" },
  { id: "وظائف", name: "وظائف", icon: "💼" },
  { id: "تجارة", name: "تجارة", icon: "🏪" },
  { id: "موضة", name: "موضة", icon: "👕" },
  { id: "رياضة", name: "رياضة", icon: "⚽" },
];

const GOVERNORATES = ["القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "أسوان", "الأقصر", "بورسعيد", "السويس"];

const S = {
  app: { fontFamily: "'Cairo', 'Segoe UI', sans-serif", direction: "rtl", minHeight: "100vh", background: COLORS.bg, color: COLORS.text },

  // Topbar - Blue gradient
  topbar: { 
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, 
    padding: "0 24px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between", 
    height: 70, 
    position: "sticky", 
    top: 0, 
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(37, 99, 235, 0.2)"
  },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoIcon: { 
    width: 42, 
    height: 42, 
    borderRadius: 12, 
    background: COLORS.accent, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    color: COLORS.white, 
    fontSize: 20,
    fontWeight: 800
  },
  logoText: { fontSize: 22, fontWeight: 800, color: COLORS.white },
  logoSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: -2 },
  topbarActions: { display: "flex", gap: 12, alignItems: "center" },
  btnSell: { 
    background: COLORS.accent, 
    color: COLORS.white, 
    border: "none", 
    padding: "10px 20px", 
    borderRadius: 8, 
    fontSize: 14, 
    fontWeight: 700, 
    cursor: "pointer", 
    fontFamily: "inherit", 
    display: "flex", 
    alignItems: "center", 
    gap: 6,
    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
  },
  btnLogin: { 
    background: "rgba(255,255,255,0.15)", 
    color: COLORS.white, 
    border: "none", 
    padding: "10px 18px", 
    borderRadius: 8, 
    fontSize: 14, 
    cursor: "pointer", 
    fontFamily: "inherit",
    backdropFilter: "blur(10px)"
  },
  btnUser: { 
    background: "transparent", 
    color: COLORS.white, 
    border: "none", 
    padding: "8px", 
    fontSize: 14, 
    cursor: "pointer", 
    fontFamily: "inherit", 
    display: "flex", 
    alignItems: "center", 
    gap: 6 
  },

  // Hero Section
  hero: { 
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 50%, ${COLORS.primary} 100%)`, 
    padding: "60px 24px", 
    textAlign: "center",
    position: "relative",
    overflow: "hidden"
  },
  heroPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: "radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)",
    backgroundSize: "40px 40px"
  },
  heroTitle: { fontSize: 40, fontWeight: 800, color: COLORS.white, marginBottom: 12, position: "relative", zIndex: 1 },
  heroSub: { fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 32, position: "relative", zIndex: 1 },

  // Search Bar
  searchBar: { 
    maxWidth: 700, 
    margin: "0 auto", 
    display: "flex", 
    gap: 0,
    background: COLORS.white, 
    borderRadius: 12, 
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    position: "relative",
    zIndex: 1
  },
  searchInput: { 
    flex: 1, 
    border: "none", 
    padding: "16px 20px", 
    fontSize: 16, 
    outline: "none", 
    fontFamily: "inherit" 
  },
  searchBtn: { 
    background: COLORS.accent, 
    color: COLORS.white, 
    border: "none", 
    padding: "16px 28px", 
    fontSize: 16, 
    cursor: "pointer", 
    fontWeight: 700, 
    fontFamily: "inherit" 
  },

  // Categories
  catsSection: { 
    background: COLORS.white, 
    padding: "24px", 
    borderBottom: `1px solid ${COLORS.border}` 
  },
  catsTitle: { 
    fontSize: 14, 
    fontWeight: 700, 
    color: COLORS.textMuted, 
    marginBottom: 16, 
    textAlign: "center" 
  },
  catsGrid: { 
    display: "flex", 
    gap: 16, 
    overflowX: "auto", 
    padding: "4px", 
    justifyContent: "center",
    flexWrap: "wrap"
  },
  catCard: (active) => ({ 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: 8, 
    padding: "16px 20px", 
    borderRadius: 12, 
    cursor: "pointer", 
    border: `2px solid ${active ? COLORS.primary : COLORS.border}`, 
    background: active ? COLORS.primaryLight : COLORS.white, 
    color: active ? COLORS.primary : COLORS.text, 
    fontFamily: "inherit", 
    minWidth: 80,
    transition: "all 0.2s",
    boxShadow: active ? "0 4px 12px rgba(37, 99, 235, 0.15)" : "none"
  }),
  catIcon: { fontSize: 28 },
  catName: { fontSize: 13, fontWeight: 600 },

  // Main Content
  main: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px" },
  sectionHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 24 
  },
  sectionTitle: { fontSize: 24, fontWeight: 800 },
  sectionLink: { 
    fontSize: 14, 
    color: COLORS.primary, 
    cursor: "pointer", 
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 4
  },

  // Ads Grid
  adsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
    gap: 24 
  },
  adCard: { 
    background: COLORS.card, 
    borderRadius: 16, 
    border: `1px solid ${COLORS.border}`, 
    overflow: "hidden", 
    cursor: "pointer", 
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  },
  adCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
  },
  adImage: { 
    height: 220, 
    background: COLORS.primaryLight, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 64, 
    position: "relative" 
  },
  adBadge: { 
    position: "absolute", 
    top: 12, 
    left: 12, 
    background: COLORS.accent, 
    color: COLORS.white, 
    padding: "6px 14px", 
    borderRadius: 20, 
    fontSize: 12, 
    fontWeight: 700 
  },
  adHeart: { 
    position: "absolute", 
    top: 12, 
    right: 12, 
    width: 40, 
    height: 40, 
    borderRadius: "50%", 
    background: COLORS.white, 
    border: "none", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    cursor: "pointer", 
    fontSize: 20, 
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
  },
  adBody: { padding: "16px 20px" },
  adPrice: { 
    fontSize: 22, 
    fontWeight: 800, 
    color: COLORS.primary, 
    marginBottom: 6 
  },
  adTitle: { 
    fontSize: 15, 
    color: COLORS.text, 
    marginBottom: 12, 
    lineHeight: 1.5, 
    height: 44, 
    overflow: "hidden",
    fontWeight: 600
  },
  adFooter: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingTop: 12, 
    borderTop: `1px solid ${COLORS.border}` 
  },
  adLocation: { 
    fontSize: 13, 
    color: COLORS.textMuted, 
    display: "flex", 
    alignItems: "center", 
    gap: 4 
  },
  adTime: { fontSize: 12, color: COLORS.textLight },

  // Detail Page
  detailPage: { maxWidth: 900, margin: "0 auto", padding: "32px 24px" },
  detailBack: { 
    display: "flex", 
    alignItems: "center", 
    gap: 8, 
    color: COLORS.textMuted, 
    cursor: "pointer", 
    marginBottom: 24, 
    fontSize: 14,
    fontWeight: 600
  },
  detailGrid: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: 32 
  },
  detailImage: { 
    height: 450, 
    background: COLORS.primaryLight, 
    borderRadius: 16, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 120 
  },
  detailInfo: { display: "flex", flexDirection: "column", gap: 20 },
  detailPrice: { 
    fontSize: 42, 
    fontWeight: 800, 
    color: COLORS.primary 
  },
  detailTitle: { fontSize: 28, fontWeight: 700, lineHeight: 1.3 },
  detailMeta: { 
    display: "flex", 
    gap: 20, 
    color: COLORS.textMuted, 
    fontSize: 14,
    flexWrap: "wrap"
  },
  detailMetaItem: { display: "flex", alignItems: "center", gap: 6 },
  detailSection: { 
    background: COLORS.white, 
    borderRadius: 12, 
    border: `1px solid ${COLORS.border}`, 
    padding: 24 
  },
  detailSectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16 },
  detailDesc: { fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8 },
  sellerCard: { 
    display: "flex", 
    alignItems: "center", 
    gap: 16, 
    padding: 20,
    background: COLORS.bg,
    borderRadius: 12
  },
  sellerAvatar: { 
    width: 60, 
    height: 60, 
    borderRadius: "50%", 
    background: COLORS.primary, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 24, 
    fontWeight: 700, 
    color: COLORS.white 
  },
  sellerName: { fontSize: 18, fontWeight: 700 },
  sellerMeta: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  contactBtn: { 
    background: COLORS.primary, 
    color: COLORS.white, 
    border: "none", 
    padding: "16px 32px", 
    borderRadius: 12, 
    fontSize: 16, 
    fontWeight: 700, 
    cursor: "pointer", 
    width: "100%", 
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
  },
  chatBtn: { 
    background: COLORS.white, 
    color: COLORS.primary, 
    border: `2px solid ${COLORS.primary}`, 
    padding: "16px 32px", 
    borderRadius: 12, 
    fontSize: 16, 
    fontWeight: 700, 
    cursor: "pointer", 
    width: "100%", 
    fontFamily: "inherit" 
  },

  // Modal
  modalOverlay: { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(30, 41, 59, 0.7)", 
    zIndex: 200, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 16,
    backdropFilter: "blur(8px)"
  },
  modalBox: { 
    background: COLORS.white, 
    borderRadius: 16, 
    width: "100%", 
    maxWidth: 480, 
    maxHeight: "90vh", 
    overflowY: "auto",
    boxShadow: "0 24px 48px rgba(0,0,0,0.2)"
  },
  modalHeader: { 
    padding: "24px", 
    borderBottom: `1px solid ${COLORS.border}`, 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  modalTitle: { fontSize: 22, fontWeight: 800 },
  modalClose: { 
    width: 36, 
    height: 36, 
    border: "none", 
    background: COLORS.bg, 
    borderRadius: "50%",
    cursor: "pointer", 
    fontSize: 18, 
    color: COLORS.textMuted,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalBody: { padding: 24 },
  formGroup: { marginBottom: 20 },
  formLabel: { display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, color: COLORS.text },
  formInput: { 
    width: "100%", 
    border: `2px solid ${COLORS.border}`, 
    borderRadius: 10, 
    padding: "14px 16px", 
    fontSize: 15, 
    outline: "none", 
    fontFamily: "inherit", 
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  },
  formSelect: { 
    width: "100%", 
    border: `2px solid ${COLORS.border}`, 
    borderRadius: 10, 
    padding: "14px 16px", 
    fontSize: 15, 
    outline: "none", 
    fontFamily: "inherit", 
    background: COLORS.white, 
    boxSizing: "border-box" 
  },
  formTextarea: { 
    width: "100%", 
    border: `2px solid ${COLORS.border}`, 
    borderRadius: 10, 
    padding: "14px 16px", 
    fontSize: 15, 
    outline: "none", 
    fontFamily: "inherit", 
    resize: "vertical", 
    minHeight: 120, 
    boxSizing: "border-box" 
  },
  btnPrimary: { 
    background: COLORS.primary, 
    color: COLORS.white, 
    border: "none", 
    padding: "16px 24px", 
    borderRadius: 10, 
    fontSize: 16, 
    fontWeight: 700, 
    cursor: "pointer", 
    width: "100%", 
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
  },
  btnSecondary: { 
    background: COLORS.bg, 
    color: COLORS.text, 
    border: `2px solid ${COLORS.border}`, 
    padding: "16px 24px", 
    borderRadius: 10, 
    fontSize: 16, 
    fontWeight: 700, 
    cursor: "pointer", 
    width: "100%", 
    fontFamily: "inherit" 
  },
  googleBtn: { 
    background: COLORS.white, 
    color: COLORS.text, 
    border: `2px solid ${COLORS.border}`, 
    padding: "14px 24px", 
    borderRadius: 10, 
    fontSize: 15, 
    cursor: "pointer", 
    width: "100%", 
    fontFamily: "inherit", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 8, 
    fontWeight: 700 
  },

  // Toast
  toast: (type) => ({ 
    position: "fixed", 
    bottom: 24, 
    left: "50%", 
    transform: "translateX(-50%)", 
    background: type === "error" ? COLORS.danger : COLORS.success, 
    color: "#fff", 
    padding: "16px 32px", 
    borderRadius: 12, 
    fontSize: 15, 
    fontWeight: 700, 
    zIndex: 500, 
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)" 
  }),

  // My Ads Page
  myAdsPage: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px" },
  pageTitle: { fontSize: 28, fontWeight: 800, marginBottom: 8 },
  pageSub: { fontSize: 14, color: COLORS.textMuted, marginBottom: 32 },
  tabs: { 
    display: "flex", 
    gap: 0, 
    borderBottom: `2px solid ${COLORS.border}`, 
    marginBottom: 32 
  },
  tab: (active) => ({ 
    padding: "14px 28px", 
    fontSize: 15, 
    fontWeight: active ? 700 : 400, 
    cursor: "pointer", 
    border: "none", 
    background: "transparent", 
    borderBottom: active ? `3px solid ${COLORS.primary}` : "none", 
    color: active ? COLORS.primary : COLORS.textMuted, 
    fontFamily: "inherit" 
  }),
  emptyState: { textAlign: "center", padding: 100, color: COLORS.textMuted },
  emptyIcon: { fontSize: 72, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: 700, marginBottom: 8, color: COLORS.text },
  emptyDesc: { fontSize: 15, marginBottom: 24 },

  // Chat
  chatPage: { maxWidth: 800, margin: "0 auto", padding: "24px", height: "calc(100vh - 70px)", display: "flex", flexDirection: "column" },
  chatHeader: { 
    display: "flex", 
    alignItems: "center", 
    gap: 16, 
    padding: "20px 0", 
    borderBottom: `2px solid ${COLORS.border}` 
  },
  chatMessages: { flex: 1, overflowY: "auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: 12 },
  chatBubble: (isMe) => ({ 
    alignSelf: isMe ? "flex-start" : "flex-end", 
    background: isMe ? COLORS.primary : COLORS.bg, 
    color: isMe ? COLORS.white : COLORS.text, 
    padding: "14px 20px", 
    borderRadius: 16, 
    maxWidth: "70%", 
    fontSize: 15,
    lineHeight: 1.5,
    boxShadow: isMe ? "0 4px 12px rgba(37, 99, 235, 0.15)" : "0 2px 8px rgba(0,0,0,0.05)"
  }),
  chatInput: { 
    display: "flex", 
    gap: 12, 
    padding: "20px 0", 
    borderTop: `2px solid ${COLORS.border}` 
  },
  chatInputField: { 
    flex: 1, 
    border: `2px solid ${COLORS.border}`, 
    borderRadius: 24, 
    padding: "14px 24px", 
    fontSize: 15, 
    outline: "none", 
    fontFamily: "inherit" 
  },
  chatSendBtn: { 
    background: COLORS.primary, 
    color: COLORS.white, 
    border: "none", 
    width: 52, 
    height: 52, 
    borderRadius: "50%", 
    cursor: "pointer", 
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
  },

  // Stats cards
  statsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: 20, 
    marginBottom: 32 
  },
  statCard: { 
    background: COLORS.white, 
    borderRadius: 12, 
    padding: 24, 
    textAlign: "center", 
    border: `1px solid ${COLORS.border}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  },
  statValue: { fontSize: 36, fontWeight: 800, color: COLORS.primary },
  statLabel: { fontSize: 14, color: COLORS.textMuted, marginTop: 8 },

  // Delete button
  deleteBtn: {
    background: "#FEE2E2",
    color: COLORS.danger,
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600
  }
};

export default function E3lanateApp() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedAd, setSelectedAd] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showPostAd, setShowPostAd] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [myAds, setMyAds] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", isRegister: false });
  const [postForm, setPostForm] = useState({ title: "", category: "", price: "", location: "", desc: "" });
  const [toast, setToast] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ads");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
      if (user) fetchMyAds(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const adsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt ? formatTime(doc.data().createdAt) : "الآن",
      }));
      setAds(adsList.length > 0 ? adsList : getSampleAds());
    } catch (e) {
      console.error("Error fetching ads:", e);
      setAds(getSampleAds());
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAds = async (uid) => {
    try {
      const q = query(collection(db, "ads"), where("userId", "==", uid), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const adsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyAds(adsList);
    } catch (e) {
      console.error("Error fetching my ads:", e);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "الآن";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    if (diff < 1) return "الآن";
    if (diff < 60) return `منذ ${diff} دقيقة`;
    if (diff < 1440) return `منذ ${Math.floor(diff / 60)} ساعة`;
    return `منذ ${Math.floor(diff / 1440)} يوم`;
  };

  const getSampleAds = () => [
    { id: "1", title: "شقة للبيع — مدينة نصر", price: "1200000", unit: "جنيه", category: "عقارات", location: "القاهرة", emoji: "🏠", time: "منذ ٣ ساعات", desc: "شقة ١٢٠م² تشطيب سوبر لوكس، ٣ غرف وصالة، الدور الثالث، موقع ممتاز قرب المترو.", seller: "أحمد محمد", userId: "", views: 45 },
    { id: "2", title: "تويوتا كورولا 2022", price: "350000", unit: "جنيه", category: "سيارات", location: "الجيزة", emoji: "🚗", time: "منذ ٥ ساعات", desc: "سيارة بحالة ممتازة، ماشية ٤٥ ألف كيلو، فل أوبشن، لون أبيض، رخصة سارية.", seller: "محمد علي", userId: "", views: 32 },
    { id: "3", title: "آيفون 15 Pro Max 256GB", price: "55000", unit: "جنيه", category: "إلكترونيات", location: "وسط البلد", emoji: "📱", time: "منذ يوم", desc: "آيفون 15 Pro Max 256GB، لون تيتانيوم، مع الكرتونة والملحقات الأصلية، ضمان سنة.", seller: "سارة أحمد", userId: "", views: 67 },
    { id: "4", title: "طقم أنتريه كامل ٧ قطع", price: "25000", unit: "جنيه", category: "أثاث", location: "شبرا الخيمة", emoji: "🛋️", time: "منذ ٣ أيام", desc: "طقم أنتريه ٧ قطع بحالة ممتازة، خشب زان طبيعي، لون بيج، تفصيل محلي.", seller: "كريم السيد", userId: "", views: 23 },
    { id: "5", title: "مطلوب مهندس برمجيات", price: "15000", unit: "جنيه/شهر", category: "وظائف", location: "التجمع الخامس", emoji: "💼", time: "منذ يوم", desc: "مطلوب مهندس React وNode.js خبرة ٣ سنوات على الأقل، دوام كامل، راتب مجزي + بونص.", seller: "شركة تك مصر", userId: "", views: 89 },
    { id: "6", title: "لابتوب Dell XPS 15", price: "45000", unit: "جنيه", category: "إلكترونيات", location: "المعادي", emoji: "💻", time: "منذ ٥ أيام", desc: "Dell XPS 15 Core i7 الجيل الـ١٣، رام ١٦GB، SSD 512GB، شاشة 4K، بحالة الزيرو.", seller: "عمر خالد", userId: "", views: 41 },
  ];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFav = (id, e) => {
    e?.stopPropagation();
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    showToast(favorites.includes(id) ? "تم إزالة من المفضلة" : "تم الإضافة للمفضلة");
  };

  const filteredAds = ads.filter(ad => {
    const matchCat = activeCategory === "all" || ad.category === activeCategory;
    const matchSearch = !searchQuery || ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) { 
      showToast("أدخل البريد وكلمة المرور", "error"); 
      return; 
    }
    try {
      if (loginForm.isRegister) {
        await createUserWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        showToast("تم إنشاء الحساب بنجاح! 🎉");
      } else {
        await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        showToast("أهلاً بك! تم تسجيل الدخول ✅");
      }
      setShowLogin(false);
      setLoginForm({ email: "", password: "", isRegister: false });
    } catch (e) {
      const errors = {
        "auth/user-not-found": "المستخدم غير موجود",
        "auth/wrong-password": "كلمة المرور غير صحيحة",
        "auth/email-already-in-use": "البريد مسجل بالفعل",
        "auth/invalid-email": "بريد غير صالح",
        "auth/weak-password": "كلمة المرور ضعيفة (٦ أحرف على الأقل)",
      };
      showToast(errors[e.code] || "حدث خطأ", "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLogin(false);
      showToast("تم تسجيل الدخول بـ Google ✅");
    } catch (e) {
      showToast("حدث خطأ في تسجيل الدخول", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setCurrentUser(null);
      setMyAds([]);
      showToast("تم تسجيل الخروج");
      setCurrentView("home");
    } catch (e) {
      showToast("حدث خطأ", "error");
    }
  };

  const handlePostAd = async () => {
    if (!isLoggedIn) { 
      setShowPostAd(false); 
      setShowLogin(true); 
      return; 
    }
    if (!postForm.title || !postForm.category || !postForm.price) { 
      showToast("أكمل البيانات المطلوبة", "error"); 
      return; 
    }
    try {
      setLoading(true);
      const adData = {
        title: postForm.title,
        price: postForm.price,
        unit: "جنيه",
        category: postForm.category,
        location: postForm.location || "القاهرة",
        emoji: CATEGORIES.find(c => c.id === postForm.category)?.icon || "📌",
        desc: postForm.desc,
        seller: currentUser?.displayName || currentUser?.email?.split("@")[0] || "مستخدم",
        userId: currentUser?.uid,
        createdAt: serverTimestamp(),
        views: 0,
      };
      await addDoc(collection(db, "ads"), adData);
      setShowPostAd(false);
      setPostForm({ title: "", category: "", price: "", location: "", desc: "" });
      showToast("تم نشر الإعلان بنجاح! 🎉");
      await fetchAds();
      if (currentUser) fetchMyAds(currentUser.uid);
    } catch (e) {
      showToast("حدث خطأ: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
    try {
      await deleteDoc(doc(db, "ads", adId));
      setMyAds(prev => prev.filter(a => a.id !== adId));
      setAds(prev => prev.filter(a => a.id !== adId));
      showToast("تم حذف الإعلان");
    } catch (e) {
      showToast("حدث خطأ في الحذف", "error");
    }
  };

  const handleChat = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    setCurrentView("chat");
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { text: chatInput, isMe: true, time: new Date() }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: "شكراً لتواصلك! سأرد عليك في أقرب وقت.", isMe: false, time: new Date() }]);
    }, 1000);
  };

  const renderTopbar = () => (
    <div style={S.topbar}>
      <div style={S.logo} onClick={() => setCurrentView("home")}>
        <div style={S.logoIcon}>⚡</div>
        <div>
          <div style={S.logoText}>إعلاناتي</div>
          <div style={S.logoSub}>سوق مصر الإلكتروني</div>
        </div>
      </div>
      <div style={S.topbarActions}>
        {isLoggedIn && (
          <button style={S.btnUser} onClick={() => setCurrentView("myAds")}>
            📋 إعلاناتي
          </button>
        )}
        {isLoggedIn && (
          <button style={S.btnUser} onClick={() => setCurrentView("favorites")}>
            ❤️ ({favorites.length})
          </button>
        )}
        {isLoggedIn ? (
          <button style={S.btnLogin} onClick={handleLogout}>تسجيل خروج</button>
        ) : (
          <button style={S.btnLogin} onClick={() => setShowLogin(true)}>تسجيل دخول</button>
        )}
        <button style={S.btnSell} onClick={() => isLoggedIn ? setShowPostAd(true) : setShowLogin(true)}>
          <span>➕</span> بيع أغراضك
        </button>
      </div>
    </div>
  );

  const renderHero = () => (
    <div style={S.hero}>
      <div style={S.heroPattern}></div>
      <h1 style={S.heroTitle}>ابحث عن كل حاجة محتاجها في مكان واحد</h1>
      <p style={S.heroSub}>ملايين الإعلانات في مصر — عقارات، سيارات، وظائف، وأكتر</p>
      <div style={S.searchBar}>
        <input 
          style={S.searchInput} 
          placeholder="ابحث في إعلاناتي..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchAds()}
        />
        <button style={S.searchBtn} onClick={fetchAds}>🔍</button>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div style={S.catsSection}>
      <div style={S.catsTitle}>تصفح حسب الفئة</div>
      <div style={S.catsGrid}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            style={S.catCard(activeCategory === cat.id)} 
            onClick={() => setActiveCategory(cat.id)}
          >
            <span style={S.catIcon}>{cat.icon}</span>
            <span style={S.catName}>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAdCard = (ad) => (
    <div 
      key={ad.id} 
      style={S.adCard} 
      onClick={() => { setSelectedAd(ad); setCurrentView("detail"); }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={S.adImage}>
        {ad.emoji}
        <button style={S.adHeart} onClick={e => toggleFav(ad.id, e)}>
          {favorites.includes(ad.id) ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={S.adBody}>
        <div style={S.adPrice}>{Number(ad.price).toLocaleString()} {ad.unit}</div>
        <div style={S.adTitle}>{ad.title}</div>
        <div style={S.adFooter}>
          <span style={S.adLocation}>📍 {ad.location}</span>
          <span style={S.adTime}>{ad.time}</span>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <>
      {renderHero()}
      {renderCategories()}
      <div style={S.main}>
        <div style={S.sectionHeader}>
          <span style={S.sectionTitle}>إعلانات مميزة</span>
          <span style={S.sectionLink}>عرض الكل ←</span>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>جاري التحميل...</div>
        ) : filteredAds.length === 0 ? (
          <div style={S.emptyState}>
            <div style={S.emptyIcon}>🔍</div>
            <div style={S.emptyTitle}>لا توجد نتائج</div>
            <div style={S.emptyDesc}>جرب تغيير البحث أو الفئة</div>
          </div>
        ) : (
          <div style={S.adsGrid}>
            {filteredAds.map(renderAdCard)}
          </div>
        )}
      </div>
    </>
  );

  const renderDetail = () => {
    if (!selectedAd) return null;
    return (
      <div style={S.detailPage}>
        <div style={S.detailBack} onClick={() => setCurrentView("home")}>
          <span>←</span> رجوع للإعلانات
        </div>
        <div style={S.detailGrid}>
          <div style={S.detailImage}>{selectedAd.emoji}</div>
          <div style={S.detailInfo}>
            <div style={S.detailPrice}>{Number(selectedAd.price).toLocaleString()} {selectedAd.unit}</div>
            <div style={S.detailTitle}>{selectedAd.title}</div>
            <div style={S.detailMeta}>
              <span style={S.detailMetaItem}>📍 {selectedAd.location}</span>
              <span style={S.detailMetaItem}>⏰ {selectedAd.time}</span>
              <span style={S.detailMetaItem}>👁 {selectedAd.views || 0} مشاهدة</span>
            </div>

            <div style={S.detailSection}>
              <div style={S.detailSectionTitle}>الوصف</div>
              <div style={S.detailDesc}>{selectedAd.desc}</div>
            </div>

            <div style={S.detailSection}>
              <div style={S.detailSectionTitle}>تفاصيل</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><span style={{ color: COLORS.textMuted }}>الفئة:</span> {selectedAd.category}</div>
                <div><span style={{ color: COLORS.textMuted }}>الموقع:</span> {selectedAd.location}</div>
                <div><span style={{ color: COLORS.textMuted }}>الحالة:</span> <span style={{ color: COLORS.success }}>متاح ✓</span></div>
                <div><span style={{ color: COLORS.textMuted }}>السعر:</span> {Number(selectedAd.price).toLocaleString()} {selectedAd.unit}</div>
              </div>
            </div>

            <div style={S.sellerCard}>
              <div style={S.sellerAvatar}>{selectedAd.seller?.[0] || "👤"}</div>
              <div>
                <div style={S.sellerName}>{selectedAd.seller}</div>
                <div style={S.sellerMeta}>بائع موثوق ⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            <button style={S.contactBtn} onClick={handleChat}>💬 دردش مع البائع</button>
            <button style={S.chatBtn}>📞 اتصل بالبائع</button>
          </div>
        </div>
      </div>
    );
  };

  const renderMyAds = () => (
    <div style={S.myAdsPage}>
      <h1 style={S.pageTitle}>إعلاناتي</h1>
      <p style={S.pageSub}>إدارة إعلاناتك ومتابعة أدائها</p>

      <div style={S.tabs}>
        <button style={S.tab(activeTab === "ads")} onClick={() => setActiveTab("ads")}>📋 إعلاناتي</button>
        <button style={S.tab(activeTab === "favorites")} onClick={() => setActiveTab("favorites")}>❤️ المفضلة</button>
        <button style={S.tab(activeTab === "stats")} onClick={() => setActiveTab("stats")}>📈 إحصائيات</button>
      </div>

      {activeTab === "ads" && (
        myAds.length === 0 ? (
          <div style={S.emptyState}>
            <div style={S.emptyIcon}>📭</div>
            <div style={S.emptyTitle}>لا توجد إعلانات</div>
            <div style={S.emptyDesc}>ابدأ بنشر أول إعلان لك</div>
            <button style={{ ...S.btnPrimary, maxWidth: 200, marginTop: 16 }} onClick={() => setShowPostAd(true)}>
              + نشر إعلان
            </button>
          </div>
        ) : (
          <div style={S.adsGrid}>
            {myAds.map(ad => (
              <div key={ad.id} style={S.adCard}>
                <div style={S.adImage}>{ad.emoji}</div>
                <div style={S.adBody}>
                  <div style={S.adPrice}>{Number(ad.price).toLocaleString()} {ad.unit}</div>
                  <div style={S.adTitle}>{ad.title}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button style={{ ...S.btnPrimary, flex: 1, padding: 10, fontSize: 13 }} onClick={() => { setSelectedAd(ad); setCurrentView("detail"); }}>
                      عرض
                    </button>
                    <button style={S.deleteBtn} onClick={() => handleDeleteAd(ad.id)}>
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "favorites" && (
        favorites.length === 0 ? (
          <div style={S.emptyState}>
            <div style={S.emptyIcon}>🤍</div>
            <div style={S.emptyTitle}>لا توجد مفضلات</div>
            <div style={S.emptyDesc}>اضغط على القلب في أي إعلان لحفظه</div>
          </div>
        ) : (
          <div style={S.adsGrid}>
            {ads.filter(a => favorites.includes(a.id)).map(renderAdCard)}
          </div>
        )
      )}

      {activeTab === "stats" && (
        <>
          <div style={S.statsGrid}>
            <div style={S.statCard}>
              <div style={S.statValue}>{myAds.length}</div>
              <div style={S.statLabel}>إجمالي الإعلانات</div>
            </div>
            <div style={S.statCard}>
              <div style={{ ...S.statValue, color: COLORS.success }}>{myAds.reduce((s, a) => s + (a.views || 0), 0)}</div>
              <div style={S.statLabel}>إجمالي المشاهدات</div>
            </div>
            <div style={S.statCard}>
              <div style={{ ...S.statValue, color: COLORS.warning }}>{favorites.length}</div>
              <div style={S.statLabel}>المفضلة</div>
            </div>
          </div>
          <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>نصائح لزيادة المبيعات</h3>
            <ul style={{ padding: 0, listStyle: "none" }}>
              <li style={{ padding: "8px 0", fontSize: 15, color: COLORS.textMuted }}>✅ أضف صور واضحة للمنتج</li>
              <li style={{ padding: "8px 0", fontSize: 15, color: COLORS.textMuted }}>✅ اكتب وصف تفصيلي وصادق</li>
              <li style={{ padding: "8px 0", fontSize: 15, color: COLORS.textMuted }}>✅ حدد سعر تنافسي</li>
              <li style={{ padding: "8px 0", fontSize: 15, color: COLORS.textMuted }}>✅ رد على الاستفسارات بسرعة</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );

  const renderChat = () => (
    <div style={S.chatPage}>
      <div style={S.chatHeader}>
        <button style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }} onClick={() => setCurrentView("detail")}>←</button>
        <div style={S.sellerAvatar}>👤</div>
        <div>
          <div style={{ fontWeight: 700 }}>{selectedAd?.seller || "البائع"}</div>
          <div style={{ fontSize: 12, color: COLORS.success }}>متصل الآن</div>
        </div>
      </div>
      <div style={S.chatMessages}>
        {chatMessages.length === 0 && (
          <div style={{ textAlign: "center", color: COLORS.textMuted, padding: 40 }}>
            ابدأ المحادثة مع البائع
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} style={{ display: "flex", flexDirection: msg.isMe ? "row" : "row-reverse" }}>
            <div style={S.chatBubble(msg.isMe)}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div style={S.chatInput}>
        <input 
          style={S.chatInputField} 
          placeholder="اكتب رسالتك..." 
          value={chatInput} 
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendChatMessage()}
        />
        <button style={S.chatSendBtn} onClick={sendChatMessage}>📨</button>
      </div>
    </div>
  );

  const renderLoginModal = () => (
    <div style={S.modalOverlay} onClick={() => setShowLogin(false)}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <h2 style={S.modalTitle}>{loginForm.isRegister ? "إنشاء حساب" : "تسجيل الدخول"}</h2>
          <button style={S.modalClose} onClick={() => setShowLogin(false)}>✕</button>
        </div>
        <div style={S.modalBody}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>أهلاً بك في إعلاناتي</div>
          </div>

          <div style={S.formGroup}>
            <label style={S.formLabel}>البريد الإلكتروني</label>
            <input style={S.formInput} type="email" placeholder="example@email.com" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>كلمة المرور</label>
            <input style={S.formInput} type="password" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
          </div>

          <button style={S.btnPrimary} onClick={handleLogin}>
            {loginForm.isRegister ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>

          <div style={{ textAlign: "center", margin: "16px 0", color: COLORS.textMuted, fontSize: 14 }}>
            {loginForm.isRegister ? (
              <>عندك حساب؟ <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 700 }} onClick={() => setLoginForm({...loginForm, isRegister: false})}>سجّل دخول</span></>
            ) : (
              <>مش عندك حساب؟ <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 700 }} onClick={() => setLoginForm({...loginForm, isRegister: true})}>سجّل دلوقتي</span></>
            )}
          </div>

          <div style={{ textAlign: "center", color: COLORS.textMuted, fontSize: 14, margin: "12px 0" }}>أو</div>

          <button style={S.googleBtn} onClick={handleGoogleLogin}>
            <span>🔍</span> Google
          </button>
        </div>
      </div>
    </div>
  );

  const renderPostAdModal = () => (
    <div style={S.modalOverlay} onClick={() => setShowPostAd(false)}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <h2 style={S.modalTitle}>نشر إعلان جديد</h2>
          <button style={S.modalClose} onClick={() => setShowPostAd(false)}>✕</button>
        </div>
        <div style={S.modalBody}>
          <div style={{ background: COLORS.bg, borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 20, border: `2px dashed ${COLORS.border}` }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 700 }}>أضف صور الإعلان</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>JPG, PNG - حتى 5 صور</div>
          </div>

          <div style={S.formGroup}>
            <label style={S.formLabel}>الفئة *</label>
            <select style={S.formSelect} value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })}>
              <option value="">اختر الفئة</option>
              {CATEGORIES.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <div style={S.formGroup}>
            <label style={S.formLabel}>عنوان الإعلان *</label>
            <input style={S.formInput} placeholder="مثال: شقة للبيع في مدينة نصر" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
          </div>

          <div style={S.formGroup}>
            <label style={S.formLabel}>السعر (جنيه) *</label>
            <input style={S.formInput} type="number" placeholder="مثال: 1200000" value={postForm.price} onChange={e => setPostForm({ ...postForm, price: e.target.value })} />
          </div>

          <div style={S.formGroup}>
            <label style={S.formLabel}>المحافظة</label>
            <select style={S.formSelect} value={postForm.location} onChange={e => setPostForm({ ...postForm, location: e.target.value })}>
              <option value="">اختر المحافظة</option>
              {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div style={S.formGroup}>
            <label style={S.formLabel}>الوصف</label>
            <textarea style={S.formTextarea} placeholder="اكتب وصف تفصيلي للإعلان..." value={postForm.desc} onChange={e => setPostForm({ ...postForm, desc: e.target.value })} />
          </div>

          <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handlePostAd} disabled={loading}>
            {loading ? "جاري النشر..." : "✓ نشر الإعلان"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {toast && <div style={S.toast(toast.type)}>{toast.msg}</div>}

      {renderTopbar()}

      {currentView === "home" && renderHome()}
      {currentView === "detail" && renderDetail()}
      {currentView === "myAds" && renderMyAds()}
      {currentView === "chat" && renderChat()}
      {currentView === "favorites" && (
        <div style={S.myAdsPage}>
          <h1 style={S.pageTitle}>المفضلة</h1>
          <p style={S.pageSub}>الإعلانات اللي حفظتها</p>
          {favorites.length === 0 ? (
            <div style={S.emptyState}>
              <div style={S.emptyIcon}>🤍</div>
              <div style={S.emptyTitle}>لا توجد مفضلات</div>
              <div style={S.emptyDesc}>اضغط على القلب في أي إعلان لحفظه</div>
            </div>
          ) : (
            <div style={S.adsGrid}>
              {ads.filter(a => favorites.includes(a.id)).map(renderAdCard)}
            </div>
          )}
        </div>
      )}

      {showLogin && renderLoginModal()}
      {showPostAd && renderPostAdModal()}
    </div>
  );
}