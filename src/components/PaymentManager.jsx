import { useState } from "react";
import { PaymentService } from "../services/services";

const EMPTY = { bookingId: "", amount: "", modeOfTransaction: "UPI" };

export default function PaymentManager() {
  const [tab, setTab] = useState("record");
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [searchStatus, setSearchStatus] = useState("SUCCESS");
  const [searchMode, setSearchMode] = useState("UPI");
  const [searchBookingId, setSearchBookingId] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [updateStatus, setUpdateStatus] = useState("SUCCESS");

  const setSuccess = (m) => setMsg({ type: "success", text: m });
  const setError = (m) => setMsg({ type: "error", text: m });
  const clearState = () => { setMsg(null); setPayments([]); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRecord = async () => {
    setLoading(true); setMsg(null);
    try {
      const payload = {
        booking: { id: Number(form.bookingId) },
        amount: Number(form.amount),
        modeOfTransaction: form.modeOfTransaction,
      };
      await PaymentService.recordPayment(payload);
      setSuccess("Payment recorded successfully!");
      setForm(EMPTY);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to record payment.");
    }
    setLoading(false);
  };

  const doFetch = async (fn) => {
    setLoading(true); setMsg(null);
    try {
      const res = await fn();
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setPayments(data);
    } catch { setError("No payments found."); }
    setLoading(false);
  };

  const handleUpdateStatus = async () => {
    setLoading(true); setMsg(null);
    try {
      await PaymentService.updatePaymentStatus(updateId, updateStatus);
      setSuccess(`Payment #${updateId} status updated to ${updateStatus}!`);
    } catch { setError("Update failed."); }
    setLoading(false);
  };

  const statusBadge = (status) => {
    const map = { SUCCESS: "badge-green", FAILED: "badge-red", PENDING: "badge-gold", REFUNDED: "badge-purple" };
    return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
  };

  const modeBadge = (mode) => {
    const map = { UPI: "badge-blue", CARD: "badge-purple", NET_BANKING: "badge-cyan", CASH: "badge-gold" };
    return <span className={`badge ${map[mode] || "badge-gray"}`}>{mode}</span>;
  };

  const PaymentTable = ({ data }) => (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr><th>ID</th><th>Booking</th><th>Amount</th><th>Mode</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id}>
              <td style={{ color: "var(--accent)", fontFamily: "monospace" }}>#{p.id}</td>
              <td>#{p.booking?.id || "—"}</td>
              <td style={{ color: "var(--gold)", fontFamily: "monospace", fontWeight: 600 }}>₹{p.amount}</td>
              <td>{modeBadge(p.modeOfTransaction)}</td>
              <td style={{ color: "var(--text3)", fontSize: 12 }}>{p.paymentDate || "—"}</td>
              <td>{statusBadge(p.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const tabs = [
    { id: "record", label: "Record Payment" },
    { id: "all", label: "All Payments" },
    { id: "search", label: "Search" },
    { id: "update", label: "Update Status" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💳 Payment Management</h1>
        <p className="page-subtitle">Record and track payment transactions</p>
      </div>

      <div className="section-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`section-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => { setTab(t.id); clearState(); }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* RECORD */}
      {tab === "record" && (
        <div className="card">
          <div className="card-title">Record New Payment</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Booking ID</label>
              <input name="bookingId" placeholder="e.g. 1" value={form.bookingId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input name="amount" type="number" placeholder="e.g. 5000" value={form.amount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mode of Transaction</label>
              <select name="modeOfTransaction" value={form.modeOfTransaction} onChange={handleChange}>
                <option>UPI</option>
                <option>CARD</option>
                <option>NET_BANKING</option>
                <option>CASH</option>
              </select>
            </div>
          </div>
          <p style={{ color: "var(--text3)", fontSize: 12, marginTop: 12 }}>
            💡 Payment date and status are auto-generated by your Spring Boot backend.
          </p>
          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={handleRecord} disabled={loading}>
              {loading ? "Processing..." : "💳 Record Payment"}
            </button>
            <button className="btn btn-ghost" onClick={() => setForm(EMPTY)}>Clear</button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}

      {/* ALL */}
      {tab === "all" && (
        <div className="card">
          <div className="card-title">All Payments</div>
          <button className="btn btn-primary" onClick={() => doFetch(PaymentService.getAllPayments)} disabled={loading} style={{ marginBottom: 16 }}>
            {loading ? "Loading..." : "🔄 Fetch All Payments"}
          </button>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {payments.length > 0 && <PaymentTable data={payments} />}
        </div>
      )}

      {/* SEARCH */}
      {tab === "search" && (
        <div>
          <div className="card">
            <div className="card-title">Search by Payment ID</div>
            <div className="search-row">
              <div className="form-group"><label>Payment ID</label>
                <input placeholder="Enter payment ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => doFetch(() => PaymentService.getPaymentById(searchId))}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Status</div>
            <div className="search-row">
              <div className="form-group"><label>Status</label>
                <select value={searchStatus} onChange={e => setSearchStatus(e.target.value)}>
                  <option>SUCCESS</option><option>FAILED</option><option>PENDING</option><option>REFUNDED</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={() => doFetch(() => PaymentService.getPaymentByStatus(searchStatus))}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Mode of Transaction</div>
            <div className="search-row">
              <div className="form-group"><label>Mode</label>
                <select value={searchMode} onChange={e => setSearchMode(e.target.value)}>
                  <option>UPI</option><option>CARD</option><option>NET_BANKING</option><option>CASH</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={() => doFetch(() => PaymentService.getPaymentByModeOfTransaction(searchMode))}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Search by Booking ID</div>
            <div className="search-row">
              <div className="form-group"><label>Booking ID</label>
                <input placeholder="Enter booking ID" value={searchBookingId} onChange={e => setSearchBookingId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => doFetch(() => PaymentService.getPaymentByBooking(searchBookingId))}>Search</button>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Payments with Amount Greater Than</div>
            <div className="search-row">
              <div className="form-group"><label>Minimum Amount (₹)</label>
                <input type="number" placeholder="e.g. 3000" value={searchAmount} onChange={e => setSearchAmount(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => doFetch(() => PaymentService.getPaymentsByAmountGreaterThan(searchAmount))}>Search</button>
            </div>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
          {payments.length > 0 && <div className="card"><PaymentTable data={payments} /></div>}
        </div>
      )}

      {/* UPDATE STATUS */}
      {tab === "update" && (
        <div className="card">
          <div className="card-title">Update Payment Status</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Payment ID</label>
              <input placeholder="Enter payment ID" value={updateId} onChange={e => setUpdateId(e.target.value)} />
            </div>
            <div className="form-group">
              <label>New Status</label>
              <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}>
                <option>SUCCESS</option><option>FAILED</option><option>PENDING</option><option>REFUNDED</option>
              </select>
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={loading}>
              {loading ? "Updating..." : "✏️ Update Payment Status"}
            </button>
          </div>
          {msg && <div className={`alert alert-${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
        </div>
      )}
    </div>
  );
}
