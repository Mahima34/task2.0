import { useState } from "react";

interface LoginForm {
  email: string;
  password: string;
}
interface LoginProps {
  onLoginSuccess?: (token: string) => void;
}

const API_BASE = "https://admin-moderator-backend-staging.up.railway.app/api";

export default function Login({ onLoginSuccess }: LoginProps) {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e: Partial<LoginForm> = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [ev.target.name]: ev.target.value }));
    setErrors((p) => ({ ...p, [ev.target.name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      const token = data.token || data.access_token || data.data?.token;
      if (!token) throw new Error("No token received");
      localStorage.setItem("auth_token", token);
      onLoginSuccess?.(token);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* LEFT — Illustration */}
      <div style={s.left}>
        <svg width="280" height="185" viewBox="0 0 320 200" fill="none">
          <rect x="20" y="120" width="280" height="9" rx="4" fill="#cbd5e1" />
          <rect x="30" y="129" width="6" height="55" fill="#94a3b8" />
          <rect x="284" y="129" width="6" height="55" fill="#94a3b8" />
          <rect x="55" y="120" width="106" height="4" rx="2" fill="#94a3b8" />
          <rect x="60" y="70" width="96" height="52" rx="4" fill="#e2e8f0" />
          <rect x="64" y="74" width="88" height="44" rx="2" fill="#bfdbfe" />
          <rect
            x="66"
            y="76"
            width="84"
            height="40"
            rx="1"
            fill="#dbeafe"
            opacity="0.8"
          />
          <rect x="72" y="84" width="50" height="4" rx="2" fill="#93c5fd" />
          <rect x="72" y="92" width="36" height="3" rx="1.5" fill="#bfdbfe" />
          <rect x="72" y="99" width="44" height="3" rx="1.5" fill="#bfdbfe" />
          <ellipse cx="200" cy="116" rx="10" ry="4" fill="#93c5fd" />
          <path d="M190 116 Q192 101 200 97 Q208 101 210 116" fill="#dbeafe" />
          <rect x="198" y="97" width="4" height="16" fill="#93c5fd" />
          <ellipse cx="200" cy="113" rx="6" ry="2.5" fill="#93c5fd" />
          <rect x="232" y="55" width="6" height="65" rx="2" fill="#94a3b8" />
          <ellipse cx="235" cy="57" rx="22" ry="9" fill="#e2e8f0" />
          <ellipse
            cx="235"
            cy="57"
            rx="16"
            ry="6"
            fill="#fef9c3"
            opacity="0.7"
          />
          <rect x="246" y="104" width="40" height="8" rx="2" fill="#a5b4fc" />
          <rect x="248" y="97" width="36" height="8" rx="2" fill="#818cf8" />
          <rect x="251" y="90" width="32" height="8" rx="2" fill="#6366f1" />
          <rect x="38" y="107" width="8" height="14" rx="1" fill="#d97706" />
          <ellipse cx="42" cy="107" rx="12" ry="10" fill="#4ade80" />
          <ellipse cx="36" cy="111" rx="8" ry="7" fill="#22c55e" />
          <ellipse cx="48" cy="112" rx="8" ry="7" fill="#22c55e" />
        </svg>
        <p style={s.leftTitle}>
          Test Management
          <br />
          Platform
        </p>
        <p style={s.leftSub}>
          Create, manage, and publish tests with ease. Powered by Preproute.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {[true, false, false].map((active, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: active ? "#4f6ef7" : "#c7d2fe",
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — Form */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.brand}>
            <div style={s.logoMark}>P</div>
            <span style={s.brandName}>Preproute</span>
          </div>
          <h1 style={s.heading}>Welcome back</h1>
          <p style={s.sub}>Sign in to your moderator account</p>

          {apiError && <div style={s.errorBanner}>⚠ {apiError}</div>}

          <form onSubmit={handleSubmit} noValidate style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{ ...s.input, ...(errors.email ? s.inputErr : {}) }}
              />
              {errors.email && <p style={s.fieldErr}>{errors.email}</p>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    ...s.input,
                    ...(errors.password ? s.inputErr : {}),
                    paddingRight: 42,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={s.eyeBtn}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <p style={s.fieldErr}>{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnLoading : {}) }}
            >
              {loading ? <span style={s.spinner} /> : "Sign in"}
            </button>
          </form>
          <p style={s.footer}>
            Having trouble?{" "}
            <a href="mailto:preproute.tech@gmail.com" style={s.link}>
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  left: {
    flex: 1,
    background: "#f0f4ff",
    borderRight: "1px solid #e2e6f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 32px",
    gap: 20,
  },
  leftTitle: {
    color: "#1a1d2e",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: -0.5,
    textAlign: "center",
    lineHeight: 1.35,
  },
  leftSub: {
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 1.7,
    maxWidth: 220,
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 32px",
    background: "#ffffff",
  },
  card: { width: "100%", maxWidth: 360 },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#4f6ef7",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
  },
  brandName: { color: "#1a1d2e", fontSize: 18, fontWeight: 700 },
  heading: {
    color: "#1a1d2e",
    fontSize: 26,
    fontWeight: 700,
    margin: "0 0 6px",
    letterSpacing: -0.5,
  },
  sub: { color: "#6b7280", fontSize: 13, margin: "0 0 28px" },
  errorBanner: {
    background: "#fff1f1",
    border: "1px solid #fca5a5",
    borderRadius: 10,
    color: "#dc2626",
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 18,
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "#374151", fontSize: 13, fontWeight: 500 },
  input: {
    background: "#f9fafb",
    border: "1.5px solid #e5e7eb",
    borderRadius: 10,
    color: "#1a1d2e",
    fontSize: 14,
    padding: "11px 14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  inputErr: { borderColor: "#f87171", background: "#fff9f9" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    color: "#9ca3af",
  },
  fieldErr: { color: "#dc2626", fontSize: 11, margin: "2px 0 0" },
  btn: {
    background: "#4f6ef7",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    padding: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(79,110,247,0.35)",
  },
  btnLoading: {
    background: "#a5b4fc",
    boxShadow: "none",
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-block",
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    borderRadius: "50%",
  },
  footer: {
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
  link: { color: "#4f6ef7", textDecoration: "none", fontWeight: 500 },
};
