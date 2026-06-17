import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const PLANS = [
  {
    name: "مجاني",
    price: 0,
    period: "للأبد",
    description: "ابدأ رحلتك في البيع",
    features: [
      "٣ إعلانات نشطة",
      "بدون تمييز",
      "دعم عبر الإيميل",
      "إحصائيات أساسية",
    ],
    notIncluded: [
      "إعلانات مميزة",
      "شارة بائع نشط",
      "دعم هاتفي",
      "تقارير متقدمة",
    ],
    popular: false,
    btnText: "ابدأ مجاناً",
  },
  {
    name: "بائع نشط",
    price: 100,
    period: "/ شهر",
    description: "للبائعين الجادين",
    features: [
      "٢٠ إعلان نشط",
      "٥ إعلانات مميزة/شهر",
      "شارة بائع نشط 🔵",
      "دعم عبر الواتساب",
      "إحصائيات متقدمة",
    ],
    notIncluded: [
      "إعلانات غير محدودة",
      "دعم هاتفي",
    ],
    popular: true,
    btnText: "اشترك الآن",
  },
  {
    name: "بائع محترف",
    price: 300,
    period: "/ شهر",
    description: "للشركات والمحترفين",
    features: [
      "إعلانات غير محدودة",
      "٢٠ إعلان مميز/شهر",
      "شارة بائع موثوق ⭐",
      "دعم هاتفي",
      "تقارير شهرية",
      "أولوية في البحث",
    ],
    notIncluded: [],
    popular: false,
    btnText: "اشترك الآن",
  },
  {
    name: "شركة",
    price: 1000,
    period: "/ شهر",
    description: "للشركات الكبرى",
    features: [
      "كل مميزات المحترف",
      "٥٠ إعلان مميز/شهر",
      "حساب متعدد المستخدمين",
      "مدير حساب مخصص",
      "تسويق على فيسبوك",
      "API للربط",
    ],
    notIncluded: [],
    popular: false,
    btnText: "تواصل معنا",
  },
];

const FEATURED_ADS = [
  { duration: "٧ أيام", price: 50, description: "إعلانك يظهر في أعلى النتائج" },
  { duration: "٣٠ يوم", price: 150, description: "تغطية شهر كامل بأعلى نتائج البحث" },
  { duration: "صفحة رئيسية", price: 200, description: "ظهور في الصفحة الرئيسية + تمييز" },
];

const S = {
  container: { fontFamily: "'Cairo', 'Segoe UI', sans-serif", direction: "rtl", minHeight: "100vh", background: COLORS.bg, color: COLORS.text },
  hero: { background: COLORS.primary, padding: "60px 24px", textAlign: "center", color: "#fff" },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 12 },
  heroSub: { fontSize: 18, color: "rgba(255,255,255,0.85)", maxWidth: 600, margin: "0 auto" },
  section: { maxWidth: 1200, margin: "0 auto", padding: "48px 24px" },
  sectionTitle: { fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 8 },
  sectionSub: { fontSize: 16, color: COLORS.textMuted, textAlign: "center", marginBottom: 40 },
  plansGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  planCard: (popular) => ({
    background: COLORS.white,
    borderRadius: 16,
    border: `2px solid ${popular ? COLORS.primary : COLORS.border}`,
    padding: 32,
    position: "relative",
    boxShadow: popular ? "0 8px 30px rgba(79,70,229,0.15)" : "none",
  }),
  popularBadge: {
    position: "absolute",
    top: -12,
    left: "50%",
    transform: "translateX(-50%)",
    background: COLORS.primary,
    color: "#fff",
    padding: "6px 20px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
  },
  planName: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  planDesc: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },
  planPrice: { fontSize: 42, fontWeight: 800, color: COLORS.primary, marginBottom: 4 },
  planPeriod: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24 },
  featureList: { listStyle: "none", padding: 0, margin: "0 0 24px 0" },
  featureItem: (included) => ({
    padding: "8px 0",
    fontSize: 14,
    color: included ? COLORS.text : COLORS.textLight,
    display: "flex",
    alignItems: "center",
    gap: 8,
  }),
  btnPrimary: {
    background: COLORS.primary,
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    fontFamily: "inherit",
  },
  btnOutline: {
    background: "transparent",
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    padding: "12px 24px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    fontFamily: "inherit",
  },
  featuredSection: { background: COLORS.white, padding: "48px 24px" },
  featuredGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" },
  featuredCard: {
    background: COLORS.bg,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${COLORS.border}`,
    textAlign: "center",
  },
  featuredPrice: { fontSize: 32, fontWeight: 800, color: COLORS.success },
  faqSection: { maxWidth: 800, margin: "0 auto", padding: "48px 24px" },
  faqItem: { borderBottom: `1px solid ${COLORS.border}`, padding: "20px 0" },
  faqQ: { fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between" },
  faqA: { fontSize: 14, color: COLORS.textMuted, marginTop: 12, lineHeight: 1.7 },
  ctaSection: { background: COLORS.primaryLight, padding: "60px 24px", textAlign: "center" },
};

const FAQS = [
  { q: "إزاي أدفع؟", a: "تقدر تدفع بـ فوري، فودافون كاش، أو بطاقة ائتمان. كل المعاملات مؤمنة." },
  { q: "ممكن ألغي الاشتراك في أي وقت؟", a: "أيوه، تقدر تلغي الاشتراك في أي وقت. الاسترداد حسب سياسة الاستخدام." },
  { q: "إعلان مميز يعني إيه؟", a: "إعلانك يظهر في أعلى نتائج البحث مع شارة "مميز" وخلفية ملونة." },
  { q: "الباقة المجانية فيها إيه؟", a: "٣ إعلانات نشطة بدون تمييز. مناسبة لو عايز تجرب الموقع الأول." },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (plan.price === 0) {
      navigate("/");
    } else {
      // Redirect to payment page
      navigate(`/payment?plan=${plan.name}&amount=${plan.price}`);
    }
  };

  return (
    <div style={S.container}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Hero */}
      <div style={S.hero}>
        <h1 style={S.heroTitle}>اختر خطتك المناسبة</h1>
        <p style={S.heroSub}>ابدأ مجاناً واطور أعمالك مع باقات تناسب كل مستوى</p>
      </div>

      {/* Plans */}
      <div style={S.section}>
        <h2 style={S.sectionTitle}>باقات الاشتراك</h2>
        <p style={S.sectionSub}>اختار الباقة اللي تناسبك وابدأ في البيع</p>
        <div style={S.plansGrid}>
          {PLANS.map(plan => (
            <div key={plan.name} style={S.planCard(plan.popular)}>
              {plan.popular && <div style={S.popularBadge}>الأكثر شيوعاً</div>}
              <div style={S.planName}>{plan.name}</div>
              <div style={S.planDesc}>{plan.description}</div>
              <div style={S.planPrice}>{plan.price === 0 ? "مجاني" : `${plan.price} جنيه`}</div>
              <div style={S.planPeriod}>{plan.price > 0 ? plan.period : ""}</div>
              <ul style={S.featureList}>
                {plan.features.map(f => (
                  <li key={f} style={S.featureItem(true)}>✅ {f}</li>
                ))}
                {plan.notIncluded.map(f => (
                  <li key={f} style={S.featureItem(false)}>❌ {f}</li>
                ))}
              </ul>
              <button 
                style={plan.popular ? S.btnPrimary : S.btnOutline} 
                onClick={() => handleSubscribe(plan)}
              >
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Ads */}
      <div style={S.featuredSection}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={S.sectionTitle}>إعلانات مميزة</h2>
          <p style={S.sectionSub}>خلي إعلانك يظهر فوق الكل</p>
          <div style={S.featuredGrid}>
            {FEATURED_ADS.map(ad => (
              <div key={ad.duration} style={S.featuredCard}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{ad.duration}</div>
                <div style={S.featuredPrice}>{ad.price} جنيه</div>
                <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 8 }}>{ad.description}</div>
                <button style={{ ...S.btnPrimary, marginTop: 16 }} onClick={() => navigate(`/payment?plan=featured&amount=${ad.price}&duration=${ad.duration}`)}>
                  اختر
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={S.faqSection}>
        <h2 style={S.sectionTitle}>أسئلة شائعة</h2>
        {FAQS.map((faq, i) => (
          <div key={i} style={S.faqItem}>
            <div style={S.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span>{faq.q}</span>
              <span>{openFaq === i ? "−" : "+"}</span>
            </div>
            {openFaq === i && <div style={S.faqA}>{faq.a}</div>}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={S.ctaSection}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>لسه عندك سؤال؟</h2>
        <p style={{ color: COLORS.textMuted, marginBottom: 20 }}>فريقنا جاهز يساعدك في أي وقت</p>
        <button style={S.btnPrimary} onClick={() => window.open("https://wa.me/201000000000", "_blank")}>
          💬 تواصل معنا على واتساب
        </button>
      </div>
    </div>
  );
}
