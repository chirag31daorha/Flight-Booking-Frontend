import { useState, useEffect } from "react";
import { FlightService, BookingService, PassengerService, PaymentService } from "../services/services";

export default function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState({ flights: "—", bookings: "—", passengers: "—", payments: "—" });

  useEffect(() => {
    // Try to load counts from each service
    FlightService.getAllFlights().then(r => setStats(s => ({ ...s, flights: r.data.data?.length ?? "—" }))).catch(() => {});
    BookingService.getAllBookings().then(r => setStats(s => ({ ...s, bookings: r.data.data?.length ?? "—" }))).catch(() => {});
    PassengerService.getAllPassengers().then(r => setStats(s => ({ ...s, passengers: r.data.data?.length ?? "—" }))).catch(() => {});
    PaymentService.getAllPayments().then(r => setStats(s => ({ ...s, payments: r.data.data?.length ?? "—" }))).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Flight Booking System — Spring Boot + React</p>
      </div>

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div className="quick-actions">
            {[
              { icon: "✈", label: "Add Flight", tab: "flights" },
              { icon: "📋", label: "Create Booking", tab: "bookings" },
              { icon: "👤", label: "Add Passenger", tab: "passengers" },
              { icon: "💳", label: "Record Payment", tab: "payments" },
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
                ["Database", "PostgreSQL"],
                ["API Base URL", "localhost:8080/"],
                ["Frontend", "React + Axios"],
                ["Auth", "None (add JWT if needed)"],
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
    </div>
  );
}
