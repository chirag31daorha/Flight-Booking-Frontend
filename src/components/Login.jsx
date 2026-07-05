import { useState } from "react";
import { AuthService } from "../services/services";
import { Eye, EyeOff} from "lucide-react";

export default function Login({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({
  email: "",
  password: ""
});

const [registerForm, setRegisterForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "USER"
});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
  setLoginForm({
    ...loginForm,
    [e.target.name]: e.target.value,
  });
};

const handleRegisterChange = (e) => {
  setRegisterForm({
    ...registerForm,
    [e.target.name]: e.target.value,
  });
};


  const handleLogin = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await AuthService.login({ email: loginForm.email, password: loginForm.password });
      const token = res.data.data;
      localStorage.setItem("jwt_token", token);
      onLogin();
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.message || "Invalid credentials" });
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true); setMsg(null);
    try {
      await AuthService.register(registerForm);
      setMsg({ type: "success", text: "Account created! Please login." });
      setTab("login");
      setRegisterForm({ ...registerForm, name: "", password: "" });
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.message || "Registration failed" });
    }
    setLoading(false);
  };
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand-icon">✈</div>
        <h1 className="auth-brand">SkyBook</h1>
        <p className="auth-tagline">Flight booking and management system powered by Spring Boot + JWT</p>
        <div className="auth-features">
          <div className="auth-feature">✈ Manage Flights</div>
          <div className="auth-feature">📋 Create Bookings</div>
          <div className="auth-feature">👤 Track Passengers</div>
          <div className="auth-feature">💳 Handle Payments</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setMsg(null); }}>Login</button>
          <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setMsg(null); }}>Register</button>
        </div>

        {tab === "login" && (
          <div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-sub">Enter your credentials to continue</p>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={loginForm.email} onChange={handleLoginChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
  <label>Password</label>

  <div className="password-input">
    <input
      name="password"
      type={showLoginPassword ? "text" : "password"}
      placeholder="••••••••"
      value={loginForm.password}
      onChange={handleLoginChange}
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowLoginPassword(!showLoginPassword)}
    >
      {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
            <p className="auth-switch">No account? <span onClick={() => setTab("register")}>Register here</span></p>
          </div>
        )}

        {tab === "register" && (
          <div>
            <h2 className="auth-title">Create account</h2>
            <p className="auth-sub">Fill in your details to get started</p>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Full Name</label>
              <input name="name" placeholder="Ashu" value={registerForm.name} onChange={handleRegisterChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={registerForm.email} onChange={handleRegisterChange} />
            </div>
           <div className="form-group" style={{ marginBottom: 14 }}>
  <label>Password</label>

  <div className="password-input">
    <input
      name="password"
      type={showRegisterPassword ? "text" : "password"}
      placeholder="••••••••"
      value={registerForm.password}
      onChange={handleRegisterChange}
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
    >
      {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Role</label>
              <select name="role" value={registerForm.role} onChange={handleRegisterChange}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleRegister} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
            {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
            <p className="auth-switch">Already have an account? <span onClick={() => setTab("login")}>Login here</span></p>
          </div>
        )}
      </div>
    </div>
  );
}