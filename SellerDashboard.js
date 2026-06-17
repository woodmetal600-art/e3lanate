import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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

const S = {
  container: { fontFamily: "'Cairo', 'Segoe UI', sans-serif", direction: "rtl", minHeight: "100vh", background: COLORS.bg, color: COLORS.text },
  topbar: { background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 },
  sidebar: { width: 260, background: COLORS.white, borderLeft: `1px solid ${COLORS.border}`, minHeight: "calc(100vh - 60px)", padding: 24 },
  main: { flex: 1, padding: 32 },
  layout: { display: "flex" },
  navItem: (active) => ({
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? 700 : 400,
    background: active ? COLORS.primaryLight : "transparent",
    color: active ? COLORS.primary : COLORS.text,
    marginBottom: 4,
  }),
  card: { background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 24 },
  statCard: { background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 24, textAlign: "center" },
  statValue: { fontSize: 32, fontWeight: 800, color: COLORS.primary },
  statLabel: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "right", padding: "12px 16px", borderBottom: `2px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textMuted, fontWeight: 600 },
  td: { textAlign: "right", padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 },
  badge: (color) => ({ background: color + "20", color: color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }),
  btnDanger: { background: COLORS.danger + "15", color: COLORS.danger, border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  btnPrimary: { background: COLORS.primary, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" },
  progressBar: { height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden", marginTop: 8 },
  progressFill: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }),
};

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [myAds, setMyAds] = useState([]);
  const [stats, setStats] = useState({ totalAds: 0, featuredAds: 0, totalViews: 0, totalCalls: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchMyAds(u.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchMyAds = async (uid) => {
    try {
      setLoading(true);
      const q = query(collection(db, "ads"), where("userId", "==", uid));
      const snapshot = await getDocs(q);
      const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyAds(ads);
      setStats({
        totalAds: ads.length,
        featuredAds: ads.filter(a => a.isFeatured).length,
        totalViews: ads.reduce((sum, a) => sum + (a.views || 0), 0),
        totalCalls: ads.reduce((sum, a) => sum + (a.calls || 0), 0),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adId) => {
    if (!window.confirm("متأكد إنك عايز تحذف الإعلان؟")) return;
    try {
      await deleteDoc(doc(db, "ads", adId));
      setMyAds(prev => prev.filter(a => a.id !== adId));
      setStats(prev => ({ ...prev, totalAds: prev.totalAds - 1 }));
    } catch (e) {
      alert("حدث خطأ في الحذف");
    }
  };

  const planLimits = { "مجاني": 3, "بائع نشط": 20, "بائع محترف": 999, "شركة": 999 };
  const currentPlan = "مجاني"; // TODO: Get from user profile
  const adsUsed = stats.totalAds;
  const adsLimit = planLimits[currentPlan];
  const usagePct = Math.min((adsUsed / adsLimit) * 100, 100);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <h2>يجب تسجيل الدخول أولاً</h2>
        <p>عشان تشوف لوحة التحكم</p>
      </div>
    );
  }

  return (
    <div style={S.container}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Topbar */}
      <div style={S.topbar}>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>⚡ إعلاناتي — لوحة التحكم</div>
        <div style={{ fontSize: 14, color: COLORS.textMuted }}>{user.email}</div>
      </div>

      <div style={S.layout}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12 }}>القائمة</div>
            {[
              { id: "overview", label: "📊 نظرة عامة" },
              { id: "ads", label: "📋 إعلاناتي" },
              { id: "stats", label: "📈 إحصائيات" },
              { id: "upgrade", label: "⭐ ترقية الباقة" },
            ].map(item => (
              <div key={item.id} style={S.navItem(activeTab === item.id)} onClick={() => setActiveTab(item.id)}>
                {item.label}
              </div>
            ))}
          </div>

          <div style={{ ...S.card, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>الباقة الحالية: {currentPlan}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>
              {adsUsed} من {adsLimit === 999 ? "∞" : adsLimit} إعلان
            </div>
            <div style={S.progressBar}>
              <div style={S.progressFill(usagePct, usagePct > 90 ? COLORS.danger : COLORS.primary)} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={S.main}>
          {activeTab === "overview" && (
            <>
              <h2 style={{ marginBottom: 24 }}>نظرة عامة</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                <div style={S.statCard}>
                  <div style={S.statValue}>{stats.totalAds}</div>
                  <div style={S.statLabel}>إجمالي الإعلانات</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statValue, color: COLORS.warning }}>{stats.featuredAds}</div>
                  <div style={S.statLabel}>إعلانات مميزة</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statValue, color: COLORS.success }}>{stats.totalViews}</div>
                  <div style={S.statLabel}>إجمالي المشاهدات</div>
                </div>
                <div style={S.statCard}>
                  <div style={{ ...S.statValue, color: COLORS.primary }}>{stats.totalCalls}</div>
                  <div style={S.statLabel}>اتصالات/واتساب</div>
                </div>
              </div>

              <div style={S.card}>
                <h3 style={{ marginBottom: 16 }}>آخر الإعلانات</h3>
                {loading ? (
                  <div>جاري التحميل...</div>
                ) : myAds.length === 0 ? (
                  <div style={{ color: COLORS.textMuted }}>مفيش إعلانات لسه. انشر أول إعلان!</div>
                ) : (
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>الإعلان</th>
                        <th style={S.th}>السعر</th>
                        <th style={S.th}>الحالة</th>
                        <th style={S.th}>المشاهدات</th>
                        <th style={S.th}>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAds.slice(0, 5).map(ad => (
                        <tr key={ad.id}>
                          <td style={S.td}>{ad.title}</td>
                          <td style={S.td}>{ad.price} {ad.unit}</td>
                          <td style={S.td}>
                            <span style={S.badge(ad.isFeatured ? COLORS.warning : COLORS.success)}>
                              {ad.isFeatured ? "مميز" : "نشط"}
                            </span>
                          </td>
                          <td style={S.td}>{ad.views || 0}</td>
                          <td style={S.td}>
                            <button style={S.btnDanger} onClick={() => handleDelete(ad.id)}>🗑️ حذف</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {activeTab === "ads" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2>إعلاناتي</h2>
                <button style={S.btnPrimary} onClick={() => window.location.href = "/"}>+ إعلان جديد</button>
              </div>
              {loading ? (
                <div>جاري التحميل...</div>
              ) : myAds.length === 0 ? (
                <div style={S.card}>
                  <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>مفيش إعلانات</div>
                    <div style={{ marginTop: 8 }}>ابدأ بنشر أول إعلان ليك</div>
                  </div>
                </div>
              ) : (
                <div style={S.card}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>الإعلان</th>
                        <th style={S.th}>الفئة</th>
                        <th style={S.th}>السعر</th>
                        <th style={S.th}>الحالة</th>
                        <th style={S.th}>المشاهدات</th>
                        <th style={S.th}>التاريخ</th>
                        <th style={S.th}>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAds.map(ad => (
                        <tr key={ad.id}>
                          <td style={S.td}>{ad.title}</td>
                          <td style={S.td}>{ad.category}</td>
                          <td style={S.td}>{ad.price} {ad.unit}</td>
                          <td style={S.td}>
                            <span style={S.badge(ad.isFeatured ? COLORS.warning : COLORS.success)}>
                              {ad.isFeatured ? "مميز ⭐" : "نشط"}
                            </span>
                          </td>
                          <td style={S.td}>{ad.views || 0}</td>
                          <td style={S.td}>{ad.createdAt?.toDate?.().toLocaleDateString("ar-EG") || "—"}</td>
                          <td style={S.td}>
                            <button style={S.btnDanger} onClick={() => handleDelete(ad.id)}>🗑️ حذف</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === "stats" && (
            <>
              <h2 style={{ marginBottom: 24 }}>إحصائيات مفصلة</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={S.card}>
                  <h3 style={{ marginBottom: 16 }}>أداء الإعلانات</h3>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>معدل الظهور</span>
                      <span style={{ fontWeight: 700 }}>{stats.totalViews}</span>
                    </div>
                    <div style={S.progressBar}>
                      <div style={S.progressFill(Math.min(stats.totalViews / 1000 * 100, 100), COLORS.primary)} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>معدل التفاعل</span>
                      <span style={{ fontWeight: 700 }}>{stats.totalCalls}</span>
                    </div>
                    <div style={S.progressBar}>
                      <div style={S.progressFill(Math.min(stats.totalCalls / 100 * 100, 100), COLORS.success)} />
                    </div>
                  </div>
                </div>
                <div style={S.card}>
                  <h3 style={{ marginBottom: 16 }}>نصائح لزيادة المبيعات</h3>
                  <ul style={{ padding: 0, listStyle: "none" }}>
                    <li style={{ padding: "8px 0", fontSize: 14, color: COLORS.textMuted }}>✅ أضف صور واضحة للمنتج</li>
                    <li style={{ padding: "8px 0", fontSize: 14, color: COLORS.textMuted }}>✅ اكتب وصف تفصيلي وصادق</li>
                    <li style={{ padding: "8px 0", fontSize: 14, color: COLORS.textMuted }}>✅ حدد سعر تنافسي</li>
                    <li style={{ padding: "8px 0", fontSize: 14, color: COLORS.textMuted }}>✅ رد على الاستفسارات بسرعة</li>
                    <li style={{ padding: "8px 0", fontSize: 14, color: COLORS.textMuted }}>⭐ اجعل إعلانك مميزاً للظهور فوق</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === "upgrade" && (
            <>
              <h2 style={{ marginBottom: 24 }}>ترقية الباقة</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { name: "بائع نشط", price: 100, features: ["٢٠ إعلان", "٥ مميزة", "دعم واتساب"] },
                  { name: "بائع محترف", price: 300, features: ["غير محدود", "٢٠ مميزة", "دعم هاتفي", "تقارير"] },
                  { name: "شركة", price: 1000, features: ["كل المميزات", "٥٠ مميزة", "API", "مدير حساب"] },
                ].map(plan => (
                  <div key={plan.name} style={{ ...S.card, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.primary, marginBottom: 16 }}>{plan.price} جنيه/شهر</div>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
                      {plan.features.map(f => <li key={f} style={{ padding: "6px 0", fontSize: 14 }}>✅ {f}</li>)}
                    </ul>
                    <button style={S.btnPrimary} onClick={() => window.location.href = `/payment?plan=${plan.name}&amount=${plan.price}`}>
                      اشترك الآن
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
