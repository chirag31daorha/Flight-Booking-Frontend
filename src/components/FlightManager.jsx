import { useState } from "react";
import { FlightService } from "../services/services";

const EMPTY_FORM = {
  airline: "", source: "", destination: "",
  departureDateTime: "", arrivalDateTime: "",
  totalSeats: "", price: "",
};

export default function FlightManager() {
  const [tab, setTab] = useState("add");
  const [form, setForm] = useState(EMPTY_FORM);
  const [flights, setFlights] = useState([]);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search states
  const [searchId, setSearchId] = useState("");
  const [searchSource, setSearchSource] = useState("");
  const [searchDest, setSearchDest] = useState("");
  const [searchAirline, setSearchAirline] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const setSuccess = (m) => setMsg({ type: "success", text: m });
  const setError = (m) => setMsg({ type: "error", text: m });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    setLoading(true); setMsg(null);
    try {
      await FlightService.addFlight(form);
      setSuccess("Flight added successfully!");
      setForm(EMPTY_FORM);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add flight.");
    }
    setLoading(false);
  };

  const handleGetAll = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await FlightService.getAllFlights();
      setFlights(res.data.data);
    } catch (e) {
      setError("Failed to fetch flights.");
    }
    setLoading(false);
  };

  const handleGetById = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await FlightService.getFlightById(searchId);
      setFlights([res.data.data]);
    } catch (e) {
      setError("Flight not found.");
    }
    setLoading(false);
  };

  const handleGetBySourceDest = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await FlightService.getFlightsBySourceAndDestination(searchSource, searchDest);
      setFlights(res.data.data);
    } catch (e) {
      setError("No flights found.");
    }
    setLoading(false);
  };

  const handleGetByAirline = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await FlightService.getFlightsByAirline(searchAirline);
      setFlights(res.data.data);
    } catch (e) {
      setError("No flights found.");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true); setMsg(null);
    try {
      await FlightService.updateFlight(updateId, form);
      setSuccess(`Flight ${updateId} updated!`);
    } catch (e) {
      setError("Update failed.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true); setMsg(null);
    try {
      await FlightService.deleteFlight(deleteId);
      setSuccess(`Flight ${deleteId} deleted!`);
      setFlights(flights.filter(f => f.id != deleteId));
    } catch (e) {
      setError("Delete failed.");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "add", label: "Add Flight" },
    { id: "all", label: "All Flights" },
    { id: "search", label: "Search" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
  ];

  const getStatusBadge = (seats) => {
    if (seats > 50) return <span className="badge badge-green">Available</span>;
    if (seats > 10) return <span className="badge badge-gold">Limited</span>;
    return <span className="badge badge-red">Full</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">✈ Flight Management</h1>
        <p className="page-subtitle">Add, view, search, update and delete flights</p>
      </div>

      <div className="section-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`section-tab ${tab === t.id ? "active" : ""}`} onClick={() => { setTab(t.id); setMsg(null); setFlights([]); }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ADD FLIGHT */}
      {tab === "add" && (
        <div className="card">
          <div className="card-title">Add New Flight</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Airline Name</label>
              <input name="airline" placeholder="e.g. IndiGo" value={form.airline} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" type="number" placeholder="e.g. 5000" value={form.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Source</label>
              <input name="source" placeholder="e.g. Bangalore" value={form.source} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input name="destination" placeholder="e.g. Mumbai" value={form.destination} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Departure Date & Time</label>
              <input name="departureDateTime" type="datetime-local" value={form.departureDateTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Arrival Date & Time</label>
              <input name="arrivalDateTime" type="datetime-local" value={form.arrivalDateTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Total Seats</label>
              <input name="totalSeats" type="number" placeholder="e.g. 180" value={form.totalSeats} onChange={handleChange} />
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "✈ Add Flight"}
            </button>
            <button className="btn btn-ghost" onClick={() => setForm(EMPTY_FORM)}>Clear</button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}

      {/* ALL FLIGHTS */}
      {tab === "all" && (
        <div className="card">
          <div className="card-title">All Flights</div>
          <button className="btn btn-primary" onClick={handleGetAll} disabled={loading} style={{ marginBottom: 16 }}>
            {loading ? "Loading..." : "🔄 Fetch All Flights"}
          </button>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {flights.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Airline</th><th>Source</th><th>Destination</th>
                    <th>Departure</th><th>Arrival</th><th>Seats</th><th>Price</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(f => (
                    <tr key={f.id}>
                      <td style={{ color: "var(--accent)", fontFamily: "monospace" }}>#{f.id}</td>
                      <td>{f.airline}</td>
                      <td>{f.source}</td>
                      <td>{f.destination}</td>
                      <td>{f.departureDateTime?.replace("T", " ") || "—"}</td>
                      <td>{f.arrivalDateTime?.replace("T", " ") || "—"}</td>
                      <td>{f.totalSeats}</td>
                      <td style={{ color: "var(--gold)" }}>₹{f.price}</td>
                      <td>{getStatusBadge(f.totalSeats)}</td>
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
              <div className="form-group">
                <label>Flight ID</label>
                <input placeholder="Enter flight ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetById}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Source & Destination</div>
            <div className="search-row">
              <div className="form-group">
                <label>Source</label>
                <input placeholder="e.g. Bangalore" value={searchSource} onChange={e => setSearchSource(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input placeholder="e.g. Delhi" value={searchDest} onChange={e => setSearchDest(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetBySourceDest}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Airline</div>
            <div className="search-row">
              <div className="form-group">
                <label>Airline Name</label>
                <input placeholder="e.g. IndiGo" value={searchAirline} onChange={e => setSearchAirline(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetByAirline}>Search</button>
            </div>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {flights.length > 0 && (
            <div className="card">
              <div className="card-title">Results</div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Airline</th><th>Source</th><th>Destination</th><th>Departure</th><th>Seats</th><th>Price</th></tr>
                  </thead>
                  <tbody>
                    {flights.map(f => (
                      <tr key={f.id}>
                        <td style={{ color: "var(--accent)", fontFamily: "monospace" }}>#{f.id}</td>
                        <td>{f.airline}</td><td>{f.source}</td><td>{f.destination}</td>
                        <td>{f.departureDateTime?.replace("T", " ") || "—"}</td>
                        <td>{f.totalSeats}</td>
                        <td style={{ color: "var(--gold)" }}>₹{f.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* UPDATE */}
      {tab === "update" && (
        <div className="card">
          <div className="card-title">Update Flight</div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Flight ID to update</label>
            <input placeholder="Enter flight ID" value={updateId} onChange={e => setUpdateId(e.target.value)} style={{ maxWidth: 200 }} />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Airline</label>
              <input name="airline" value={form.airline} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Source</label>
              <input name="source" value={form.source} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input name="destination" value={form.destination} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Departure Date & Time</label>
              <input name="departureDateTime" type="datetime-local" value={form.departureDateTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Arrival Date & Time</label>
              <input name="arrivalDateTime" type="datetime-local" value={form.arrivalDateTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Total Seats</label>
              <input name="totalSeats" type="number" value={form.totalSeats} onChange={handleChange} />
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "✏️ Update Flight"}
            </button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}

      {/* DELETE */}
      {tab === "delete" && (
        <div className="card">
          <div className="card-title">Delete Flight</div>
          <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16 }}>
            ⚠️ This will permanently delete the flight and all associated bookings.
          </p>
          <div className="search-row">
            <div className="form-group">
              <label>Flight ID</label>
              <input placeholder="Enter flight ID to delete" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
            </div>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "🗑 Delete Flight"}
            </button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}
    </div>
  );
}
