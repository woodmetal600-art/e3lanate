import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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
  container: { fontFamily: "'Cairo', 'Segoe UI', sans-serif", direction: "rtl", minHeight: "100vh", background: COLORS.bg, color: COLORS.text, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 40, width: "100%", maxWidth: 480 },
  title: { fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginBottom: 32 },
  planBox: { background: COLORS.primaryLight, borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "center" },
  planName: { fontSize: 18, fontWeight: 700, color: COLORS.primary },
  planPrice: { fontSize: 32, fontWeight: 800, color: COLORS.primary, marginTop: 8 },
  formGroup: { marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 },
  input: { width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  select: { width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", fontFamily: "inherit", background: COLORS.white, boxSizing: "border-box" },
  btnPrimary: { background: COLORS.primary, color: "#fff", border: "none", padding: "14px 24px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit", marginTop: 8 },
  btnSuccess: { background: COLORS.success, color: "#fff", border: "none", padding: "14px 24px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit", marginTop: 8 },
  secureBadge: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, fontSize: 12, color: COLORS.textMuted },
  steps: { display: "flex", justifyContent: "center", gap: 16, marginBottom: 32 },
  step: (active) => ({ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, background: active ? COLORS.primary : COLORS.border, color: active ? "#fff" : COLORS.textMuted }),
};

// Payment methods available in Egypt
const PAYMENT_METHODS = [
  { id: "fawry", name: "فوري Fawry", icon: "🏪", description: "ادفع في أي فرع فوري" },
  { id: "vodafone", name: "فودافون كاش", icon: "📱", description: "تحويل من محفظة فودافون" },
  { id: "card", name: "بطاقة ائتمان", icon: "💳", description: "فيزا / ماستركارد" },
  { id: "instapay", name: "إنستا باي", icon: "⚡", description: "تحويل فوري" },
];

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "featured";
  const amount = searchParams.get("amount") || "50";
  const duration = searchParams.get("duration") || "";

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!paymentMethod) { setError("اختر طريقة الدفع"); return; }
    if (!phone || phone.length < 11) { setError("أدخل رقم موبايل صحيح"); return; }

    setError("");
    setLoading(true);

    // TODO: Integrate with actual payment gateway (Paymob, Fawry, etc.)
    // For now, simulate payment
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setStep(3);
    }, 2000);
  };

  if (success) {
    return (
      <div style={S.container}>
        <div style={S.card}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h1 style={{ ...S.title, color: COLORS.success }}>تم الدفع بنجاح!</h1>
            <p style={S.subtitle}>تم تفعيل {plan === "featured" ? "الإعلان المميز" : `باقة ${plan}`} بنجاح</p>
            <div style={{ ...S.planBox, background: "#F0FDF4" }}>
              <div style={{ fontSize: 14, color: COLORS.textMuted }}>المبلغ المدفوع</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.success }}>{amount} جنيه</div>
            </div>
            <button style={S.btnPrimary} onClick={() => window.location.href = "/dashboard"}>
              روح للوحة التحكم
            </button>
            <div style={{ marginTop: 12 }}>
              <button style={{ ...S.btnPrimary, background: COLORS.bg, color: COLORS.text }} onClick={() => window.location.href = "/"}>
                ← رجوع للرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.container}>
      <div style={S.card}>
        <div style={S.steps}>
          <div style={S.step(step >= 1)}>١</div>
          <div style={S.step(step >= 2)}>٢</div>
          <div style={S.step(step >= 3)}>٣</div>
        </div>

        <h1 style={S.title}>إتمام الدفع</h1>
        <p style={S.subtitle}>اختر طريقة الدفع المناسبة ليك</p>

        <div style={S.planBox}>
          <div style={S.planName}>{plan === "featured" ? `إعلان مميز — ${duration}` : `باقة ${plan}`}</div>
          <div style={S.planPrice}>{amount} جنيه</div>
        </div>

        {step === 1 && (
          <>
            <div style={S.formGroup}>
              <label style={S.label}>اختر طريقة الدفع</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PAYMENT_METHODS.map(method => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      border: `2px solid ${paymentMethod === method.id ? COLORS.primary : COLORS.border}`,
                      borderRadius: 10,
                      padding: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: paymentMethod === method.id ? COLORS.primaryLight : COLORS.white,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{method.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{method.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>{method.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button style={S.btnPrimary} onClick={() => setStep(2)} disabled={!paymentMethod}>
              التالي
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={S.formGroup}>
              <label style={S.label}>رقم الموبايل</label>
              <input
                style={S.input}
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                maxLength={11}
              />
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                هنبعتلك كود التأكيد على الرقم ده
              </div>
            </div>

            {paymentMethod === "fawry" && (
              <div style={{ background: COLORS.primaryLight, borderRadius: 10, padding: 16, marginBottom: 20, fontSize: 14 }}>
                <strong>خطوات الدفع بـ فوري:</strong>
                <ol style={{ marginTop: 8, paddingRight: 20 }}>
                  <li>روح لأقرب فرع فوري</li>
                  <li>قل للموظف "دفع إلكتروني"</li>
                  <li>ادخل الرقم: <strong>123456</strong></li>
                  <li>ادفع المبلغ: <strong>{amount} جنيه</strong></li>
                </ol>
              </div>
            )}

            {error && (
              <div style={{ background: "#FEF2F2", color: COLORS.danger, padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ ...S.btnPrimary, flex: 1, background: COLORS.bg, color: COLORS.text }} onClick={() => setStep(1)}>
                ← رجوع
              </button>
              <button style={{ ...S.btnSuccess, flex: 2 }} onClick={handlePayment} disabled={loading}>
                {loading ? "جاري المعالجة..." : `ادفع ${amount} جنيه`}
              </button>
            </div>
          </>
        )}

        <div style={S.secureBadge}>
          🔒 الدفع آمن ومشفر — بياناتك محمية
        </div>
      </div>
    </div>
  );
}
