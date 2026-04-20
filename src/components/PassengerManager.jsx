import { useState } from "react";
import { PassengerService } from "../services/services";

const EMPTY = { name: "", age: "", gender: "MALE", contactNo: "", seatNumber: "" };

export default function PassengerManager() {
  const [tab, setTab] = useState("add");
  const [passengers, setPassengers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchFlightId, setSearchFlightId] = useState("");
  const [updateId, setUpdateId] = useState("");

  const setSuccess = (m) => setMsg({ type: "success", text: m });
  const setError = (m) => setMsg({ type: "error", text: m });
  const clearState = () => { setMsg(null); setPassengers([]); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    setLoading(true); setMsg(null);
    try {
      await PassengerService.addPassenger(form);
      setSuccess("Passenger added successfully!");
      setForm(EMPTY);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add passenger.");
    }
    setLoading(false);
  };

  const handleGetAll = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await PassengerService.getAllPassengers();
      setPassengers(res.data.data);
    } catch { setError("Failed to fetch."); }
    setLoading(false);
  };

  const handleGetById = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await PassengerService.getPassengerById(searchId);
      setPassengers([res.data.data]);
    } catch { setError("Not found."); }
    setLoading(false);
  };

  const handleGetByContact = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await PassengerService.getPassengerByContactNo(searchContact);
      setPassengers([res.data.data]);
    } catch { setError("Not found."); }
    setLoading(false);
  };

  const handleGetByFlight = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await PassengerService.getPassengersByFlight(searchFlightId);
      setPassengers(res.data.data);
    } catch { setError("No passengers found."); }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true); setMsg(null);
    try {
      await PassengerService.updatePassengerInfo(updateId, form);
      setSuccess(`Passenger #${updateId} updated!`);
    } catch { setError("Update failed."); }
    setLoading(false);
  };

  const tabs = [
    { id: "add", label: "Add Passenger" },
    { id: "all", label: "All Passengers" },
    { id: "search", label: "Search" },
    { id: "update", label: "Update" },
  ];

  const PassengerForm = () => (
    <div className="form-grid">
      <div className="form-group">
        <label>Full Name</label>
        <input name="name" placeholder="e.g. Rahul Sharma" value={form.name} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Age</label>
        <input name="age" type="number" placeholder="e.g. 28" value={form.age} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option>MALE</option><option>FEMALE</option><option>OTHER</option>
        </select>
      </div>
      <div className="form-group">
        <label>Contact No.</label>
        <input name="contactNo" placeholder="e.g. 9876543210" value={form.contactNo} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Seat Number</label>
        <input name="seatNumber" placeholder="e.g. 12A" value={form.seatNumber} onChange={handleChange} />
      </div>
    </div>
  );

  const PassengerTable = ({ data }) => (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Seat</th></tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id}>
              <td style={{ color: "var(--accent)", fontFamily: "monospace" }}>#{p.id}</td>
              <td>{p.name}</td><td>{p.age}</td>
              <td><span className={`badge ${p.gender === "MALE" ? "badge-blue" : p.gender === "FEMALE" ? "badge-purple" : "badge-gray"}`}>{p.gender}</span></td>
              <td>{p.contactNo}</td><td style={{ fontFamily: "monospace" }}>{p.seatNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👤 Passenger Management</h1>
        <p className="page-subtitle">Add and manage passengers</p>
      </div>

      <div className="section-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`section-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => { setTab(t.id); clearState(); }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "add" && (
        <div className="card">
          <div className="card-title">Add New Passenger</div>
          <PassengerForm />
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "👤 Add Passenger"}
            </button>
            <button className="btn btn-ghost" onClick={() => setForm(EMPTY)}>Clear</button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}

      {tab === "all" && (
        <div className="card">
          <div className="card-title">All Passengers</div>
          <button className="btn btn-primary" onClick={handleGetAll} disabled={loading} style={{ marginBottom: 16 }}>
            {loading ? "Loading..." : "🔄 Fetch All Passengers"}
          </button>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {passengers.length > 0 && <PassengerTable data={passengers} />}
        </div>
      )}

      {tab === "search" && (
        <div>
          <div className="card">
            <div className="card-title">Search by ID</div>
            <div className="search-row">
              <div className="form-group"><label>Passenger ID</label>
                <input placeholder="Enter ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetById}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Contact No.</div>
            <div className="search-row">
              <div className="form-group"><label>Contact Number</label>
                <input placeholder="e.g. 9876543210" value={searchContact} onChange={e => setSearchContact(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleGetByContact}>Search</button>
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
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {passengers.length > 0 && <div className="card"><PassengerTable data={passengers} /></div>}
        </div>
      )}

      {tab === "update" && (
        <div className="card">
          <div className="card-title">Update Passenger Info</div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Passenger ID to update</label>
            <input placeholder="Enter passenger ID" value={updateId} onChange={e => setUpdateId(e.target.value)} style={{ maxWidth: 200 }} />
          </div>
          <PassengerForm />
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "✏️ Update Passenger"}
            </button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}
    </div>
  );
}
