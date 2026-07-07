import { useState } from "react";
import FlightManager from "./components/FlightManager";
import BookingManager from "./components/BookingManager";
import PassengerManager from "./components/PassengerManager";
import PaymentManager from "./components/PaymentManager";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import "./App.css";

function parseToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt_token"));

  const token = localStorage.getItem("jwt_token");
  const user = token ? parseToken(token) : null;
  // user.sub = email, user.role = "ADMIN" or "USER"

  // Build NAV_ITEMS dynamically based on role
  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    ...(user?.role === "ADMIN" ? [{ id: "flights", label: "Flights", icon: "✈" }] : []),
    { id: "bookings", label: "Bookings", icon: "📋" },
    { id: "passengers", label: "Passengers", icon: "👤" },
    { id: "payments", label: "Payments", icon: "💳" },
  ];

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setIsLoggedIn(false);
    setActiveTab("dashboard");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard setActiveTab={setActiveTab} user={user} />;
      case "flights": 
        return user?.role === "ADMIN" ? <FlightManager user={user} /> : <Dashboard setActiveTab={setActiveTab} user={user} />;
      case "bookings": return <BookingManager user={user} />;
      case "passengers": return <PassengerManager user={user} />;
      case "payments": return <PaymentManager user={user} />;
      default: return <Dashboard setActiveTab={setActiveTab} user={user} />;
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">✈</span>
          <div>
            <div className="brand-name">SkyBook</div>
            <div className="brand-sub">Flight Management</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.sub?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <div className="user-email">{user?.sub || "User"}</div>
            <div className={`user-role ${user?.role === "ADMIN" ? "role-admin" : "role-user"}`}>
              {user?.role || "USER"}
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
        </div>

        <div className="sidebar-footer">
          <div className="status-dot"></div>
          <span>API Connected</span>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
