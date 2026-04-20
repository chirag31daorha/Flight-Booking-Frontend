import { useState } from "react";
import { BookingService } from "../services/services";

export default function BookingManager() {
  const [tab, setTab] = useState("create");
  const [bookings, setBookings] = useState([]);
  const [detail, setDetail] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form for create booking
  const [form, setForm] = useState({ flightId: "", passengerIds: "" });

  // Search inputs
  const [searchId, setSearchId] = useState("");
  const [searchFlightId, setSearchFlightId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("CONFIRMED");
  const [updateId, setUpdateId] = useState("");
  const [updateStatus, setUpdateStatus] = useState("CONFIRMED");
  const [deleteId, setDeleteId] = useState("");

  const setSuccess = (m) => setMsg({ type: "success", text: m });
  const setError = (m) => setMsg({ type: "error", text: m });
  const clearState = () => { setMsg(null); setBookings([]); setDetail(null); };

  const handleCreate = async () => {
    setLoading(true); setMsg(null);
    try {
      // Adjust payload shape to match your Spring Boot endpoint
      const payload = {
        flight: { id: Number(form.flightId) },
        passengers: form.passengerIds.split(",").map(id => ({ id: Number(id.trim()) })),
      };
      await BookingService.createBooking(payload);
      setSuccess("Booking created successfully!");
      setForm({ flightId: "", passengerIds: "" });
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create booking.");
    }
    setLoading(false);
  };

  const handleGetAll = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await BookingService.getAllBookings();
      setBookings(res.data.data);
    } catch { setError("Failed to fetch bookings."); }
    setLoading(false);
  };

  const handleGetById = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await BookingService.getBookingById(searchId);
      setBookings([res.data.data]);
    } catch { setError("Booking not found."); }
    setLoading(false);
  };

  const handleGetByFlight = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await BookingService.getBookingByFlight(searchFlightId);
      setBookings(res.data.data);
    } catch { setError("No bookings found."); }
    setLoading(false);
  };

  const handleGetByDate = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await BookingService.getBookingByDate(searchDate);
      setBookings(res.data.data);
    } catch { setError("No bookings found."); }
    setLoading(false);
  };

  const handleGetByStatus = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await BookingService.getBookingByStatus(searchStatus);
      setBookings(res.data.data);
    } catch { setError("No bookings found."); }
    setLoading(false);
  };

  const handleGetPassengers = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await BookingService.getAllPassengersInBooking(searchId);
      setDetail({ type: "passengers", data: res.data.data });
    } catch { setError("Failed to fetch passengers."); }
    setLoading(false);
  };

  const handleGetPayment = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await BookingService.getPaymentDetailsOfBooking(searchId);
      setDetail({ type: "payment", data: res.data.data });
    } catch { setError("No payment found."); }
    setLoading(false);
  };

  const handleUpdateStatus = async () => {
    setLoading(true); setMsg(null);
    try {
      await BookingService.updateBookingStatus(updateId, updateStatus);
      setSuccess(`Booking #${updateId} status updated to ${updateStatus}!`);
    } catch { setError("Update failed."); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true); setMsg(null);
    try {
      await BookingService.deleteBooking(deleteId);
      setSuccess(`Booking #${deleteId} deleted!`);
    } catch { setError("Delete failed."); }
    setLoading(false);
  };

  const statusBadge = (status) => {
    const map = { CONFIRMED: "badge-green", PENDING: "badge-gold", CANCELLED: "badge-red", COMPLETED: "badge-blue" };
    return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
  };

  const tabs = [
    { id: "create", label: "Create Booking" },
    { id: "all", label: "All Bookings" },
    { id: "search", label: "Search" },
    { id: "details", label: "Passengers & Payment" },
    { id: "update", label: "Update Status" },
    { id: "delete", label: "Delete" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 Booking Management</h1>
        <p className="page-subtitle">Create and manage flight bookings</p>
      </div>

      <div className="section-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`section-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => { setTab(t.id); clearState(); }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CREATE */}
      {tab === "create" && (
        <div className="card">
          <div className="card-title">Create New Booking</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Flight ID</label>
              <input placeholder="e.g. 1" value={form.flightId} onChange={e => setForm({ ...form, flightId: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Passenger IDs (comma separated)</label>
              <input placeholder="e.g. 1, 2, 3" value={form.passengerIds} onChange={e => setForm({ ...form, passengerIds: e.target.value })} />
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "📋 Create Booking"}
            </button>
          </div>
          <p style={{ color: "var(--text3)", fontSize: 12, marginTop: 12 }}>
            💡 The booking date and status are auto-generated by your Spring Boot backend.
          </p>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}

      {/* ALL */}
      {tab === "all" && (
        <div className="card">
          <div className="card-title">All Bookings</div>
          <button className="btn btn-primary" onClick={handleGetAll} disabled={loading} style={{ marginBottom: 16 }}>
            {loading ? "Loading..." : "🔄 Fetch All Bookings"}
          </button>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {bookings.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Flight</th><th>Booking Date</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: "var(--accent)", fontFamily: "monospace" }}>#{b.id}</td>
                      <td>{b.flight?.airline || `Flight #${b.flight?.id}`}</td>
                      <td>{b.bookingDate || "—"}</td>
                      <td>{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SEARCH */}
      {tab === "search" && (
        <div>
          <div className="card">
            <div className="card-title">Search by ID</div>
            <div className="search-row">
              <div className="form-group"><label>Booking ID</label>
                <input placeholder="Enter booking ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetById}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Flight</div>
            <div className="search-row">
              <div className="form-group"><label>Flight ID</label>
                <input placeholder="Enter flight ID" value={searchFlightId} onChange={e => setSearchFlightId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetByFlight}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Date</div>
            <div className="search-row">
              <div className="form-group"><label>Date</label>
                <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetByDate}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Status</div>
            <div className="search-row">
              <div className="form-group"><label>Status</label>
                <select value={searchStatus} onChange={e => setSearchStatus(e.target.value)}>
                  <option>CONFIRMED</option><option>PENDING</option><option>CANCELLED</option><option>COMPLETED</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleGetByStatus}>Search</button>
            </div>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {bookings.length > 0 && (
            <div className="card">
              <div className="card-title">Results</div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>ID</th><th>Flight</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td style={{ color: "var(--accent)", fontFamily: "monospace" }}>#{b.id}</td>
                        <td>{b.flight?.airline || `Flight #${b.flight?.id}`}</td>
                        <td>{b.bookingDate || "—"}</td>
                        <td>{statusBadge(b.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAILS */}
      {tab === "details" && (
        <div>
          <div className="card">
            <div className="card-title">Booking ID</div>
            <div className="search-row">
              <div className="form-group"><label>Booking ID</label>
                <input placeholder="Enter booking ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetPassengers}>Get Passengers</button>
              <button className="btn btn-ghost" onClick={handleGetPayment}>Get Payment</button>
            </div>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {detail?.type === "passengers" && (
            <div className="card">
              <div className="card-title">Passengers in Booking</div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Seat</th></tr></thead>
                  <tbody>
                    {detail.data.map(p => (
                      <tr key={p.id}>
                        <td style={{ color: "var(--accent)" }}>#{p.id}</td>
                        <td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.contactNo}</td><td>{p.seatNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {detail?.type === "payment" && (
            <div className="card">
              <div className="card-title">Payment Details</div>
              <table>
                <tbody>
                  {Object.entries(detail.data).map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ color: "var(--text3)", fontSize: 13, textTransform: "capitalize" }}>{k}</td>
                      <td style={{ color: "var(--text)", fontFamily: k === "amount" ? "monospace" : "inherit" }}>
                        {k === "amount" ? `₹${v}` : String(v)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* UPDATE STATUS */}
      {tab === "update" && (
        <div className="card">
          <div className="card-title">Update Booking Status</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Booking ID</label>
              <input placeholder="Enter booking ID" value={updateId} onChange={e => setUpdateId(e.target.value)} />
            </div>
            <div className="form-group">
              <label>New Status</label>
              <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}>
                <option>CONFIRMED</option><option>PENDING</option><option>CANCELLED</option><option>COMPLETED</option>
              </select>
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={loading}>
              {loading ? "Updating..." : "✏️ Update Status"}
            </button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}

      {/* DELETE */}
      {tab === "delete" && (
        <div className="card">
          <div className="card-title">Delete Booking</div>
          <div className="search-row">
            <div className="form-group">
              <label>Booking ID</label>
              <input placeholder="Enter booking ID" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
            </div>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "🗑 Delete Booking"}
            </button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}
    </div>
  );
}
