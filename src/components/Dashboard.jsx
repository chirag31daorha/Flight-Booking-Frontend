import { useState, useEffect } from "react";
import { FlightService, BookingService, PassengerService, PaymentService } from "../services/services";
import BookingWizard from "./BookingWizard";

export default function Dashboard({ setActiveTab, user }) {
  const [stats, setStats] = useState({ flights: "—", bookings: "—", passengers: "—", payments: "—" });
  const [showBookingWizard, setShowBookingWizard] = useState(false);

  useEffect(() => {
    // Try to load counts from each service
    FlightService.getAllFlights()
      .then(r => setStats(s => ({ ...s, flights: r.data.data?.length ?? "—" })))
      .catch(() => {});
    BookingService.getAllBookings()
      .then(r => setStats(s => ({ ...s, bookings: r.data.data?.length ?? "—" })))
      .catch(() => {});
    PassengerService.getAllPassengers()
      .then(r => setStats(s => ({ ...s, passengers: r.data.data?.length ?? "—" })))
      .catch(() => {});
    PaymentService.getAllPayments()
      .then(r => setStats(s => ({ ...s, payments: r.data.data?.length ?? "—" })))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* BookingWizard Modal - USER ONLY */}
      {showBookingWizard && user?.role !== "ADMIN" && (
        <div className="modal-overlay" onClick={() => setShowBookingWizard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <BookingWizard onClose={() => setShowBookingWizard(false)} />
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">
          {user?.role === "ADMIN" ? "📊 Admin Dashboard" : "🏠 Welcome to SkyBook"}
        </h1>
        <p className="page-subtitle">
          {user?.role === "ADMIN"
            ? "Flight Booking System — Spring Boot + React"
            : `Hello ${user?.sub || "Traveler"}! Ready to book your flight?`}
        </p>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">✈</div>
          <div className="stat-label">Total Flights</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>{stats.flights}</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value" style={{ color: "var(--accent2)" }}>{stats.bookings}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon">👤</div>
          <div className="stat-label">Passengers</div>
          <div className="stat-value" style={{ color: "var(--gold)" }}>{stats.passengers}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💳</div>
          <div className="stat-label">Payments</div>
          <div className="stat-value" style={{ color: "var(--green)" }}>{stats.payments}</div>
        </div>
      </div>

      {/* USER DASHBOARD */}
      {user?.role !== "ADMIN" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div className="card">
            <div className="card-title">Start Your Journey</div>
            <div className="quick-actions">
              <button 
                className="qa-btn" 
                onClick={() => setShowBookingWizard(true)}
                style={{ 
                  background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                  color: "white"
                }}
              >
                <div className="qa-btn-icon" style={{ fontSize: 32 }}>✈</div>
                <div className="qa-btn-label">Book a Flight</div>
              </button>
              <button className="qa-btn" onClick={() => setActiveTab("bookings")}>
                <div className="qa-btn-icon">📋</div>
                <div className="qa-btn-label">My Bookings</div>
              </button>
              <button className="qa-btn" onClick={() => setActiveTab("passengers")}>
                <div className="qa-btn-icon">👤</div>
                <div className="qa-btn-label">Passengers</div>
              </button>
              <button className="qa-btn" onClick={() => setActiveTab("payments")}>
                <div className="qa-btn-icon">💳</div>
                <div className="qa-btn-label">Payments</div>
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">How to Book</div>
            <div style={{ padding: "12px 0" }}>
              <ol style={{ paddingLeft: 20, margin: 0, lineHeight: 2 }}>
                <li style={{ fontSize: 13, color: "var(--text-secondary)" }}>Click "Book a Flight"</li>
                <li style={{ fontSize: 13, color: "var(--text-secondary)" }}>Select a flight</li>
                <li style={{ fontSize: 13, color: "var(--text-secondary)" }}>Enter passenger details</li>
                <li style={{ fontSize: 13, color: "var(--text-secondary)" }}>Complete payment</li>
                <li style={{ fontSize: 13, color: "var(--text-secondary)" }}>Confirm booking</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {user?.role === "ADMIN" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div className="card">
            <div className="card-title">Management Actions</div>
            <div className="quick-actions">
              {[
                { icon: "✈", label: "Manage Flights", tab: "flights" },
                { icon: "📋", label: "Manage Bookings", tab: "bookings" },
                { icon: "👤", label: "Manage Passengers", tab: "passengers" },
                { icon: "💳", label: "Manage Payments", tab: "payments" },
              ].map(a => (
                <button key={a.tab} className="qa-btn" onClick={() => setActiveTab(a.tab)}>
                  <div className="qa-btn-icon">{a.icon}</div>
                  <div className="qa-btn-label">{a.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">System Info</div>
            <table>
              <tbody>
                {[
                  ["Backend", "Spring Boot"],
                  ["Database", "PostgreSQL/MySQL"],
                  ["Security", "JWT + Spring Security"],
                  ["Frontend", "React + Vite + Axios"],
                  ["Deployment", "Render + Vercel"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ color: "var(--text3)", fontSize: 13 }}>{k}</td>
                    <td style={{ color: "var(--accent)", fontFamily: "monospace", fontSize: 13 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
