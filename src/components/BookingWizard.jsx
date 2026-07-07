import { useState, useEffect } from "react";
import { FlightService, BookingService } from "../services/services";

const PASSENGER_TEMPLATE = {
  name: "",
  age: "",
  gender: "MALE",
  contactNumber: "",
  seatNumber: ""
};

const PAYMENT_TEMPLATE = {
  amount: "",
  paymentMethod: "UPI",
  paymentStatus: "PAID"
};

export default function BookingWizard({ onClose }) {
  const [step, setStep] = useState(1); // 1: Flight, 2: Passengers, 3: Payment, 4: Review
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Flight selection
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightsLoading, setFlightsLoading] = useState(false);

  // Step 2: Passengers
  const [numPassengers, setNumPassengers] = useState("1");
  const [passengers, setPassengers] = useState([{ ...PASSENGER_TEMPLATE }]);

  // Step 3: Payment
  const [payment, setPayment] = useState({ ...PAYMENT_TEMPLATE });

  // Review: booking date
  const [bookingDate] = useState(new Date().toISOString().split("T")[0]);

  const setSuccess = (m) => setMsg({ type: "success", text: m });
  const setError = (m) => setMsg({ type: "error", text: m });

  // Load flights on component mount
  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setFlightsLoading(true);
    try {
      const res = await FlightService.getAllFlights();
      setFlights(res.data.data || []);
    } catch (e) {
      setError("Failed to load flights. Please try again.");
    }
    setFlightsLoading(false);
  };

  // Step 1: Select Flight
  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    setMsg(null);
  };

  const handleStep1Next = () => {
    if (!selectedFlight) {
      setError("Please select a flight");
      return;
    }
    setMsg(null);
    setStep(2);
  };

  // Step 2: Manage Passengers
  const handleNumPassengersChange = (e) => {
    const num = parseInt(e.target.value) || 1;
    setNumPassengers(num);

    // Adjust passengers array
    if (num > passengers.length) {
      // Add new empty passengers
      const newPassengers = [...passengers];
      for (let i = passengers.length; i < num; i++) {
        newPassengers.push({ ...PASSENGER_TEMPLATE });
      }
      setPassengers(newPassengers);
    } else if (num < passengers.length) {
      // Remove extra passengers
      setPassengers(passengers.slice(0, num));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleStep2Next = () => {
    // Validate all passengers filled
    const allFilled = passengers.every(
      (p) => p.name && p.age && p.contactNumber && p.seatNumber
    );
    if (!allFilled) {
      setError("Please fill all passenger details");
      return;
    }
    setMsg(null);
    setStep(3);
  };

  // Step 3: Payment Details
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleStep3Next = () => {
    if (!payment.amount) {
      setError("Please enter payment amount");
      return;
    }
    setMsg(null);
    setStep(4);
  };

  // Step 4: Review & Submit
  const handleSubmit = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const bookingPayload = {
        bookingDate: bookingDate,
        status: "CONFIRMED",
        flight: { id: selectedFlight.id },
        passengers: passengers.map(p => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender,
          contactNumber: p.contactNumber,
          seatNumber: parseInt(p.seatNumber)
        })),
        payment: {
          amount: parseInt(payment.amount),
          paymentMethod: payment.paymentMethod,
          paymentStatus: payment.paymentStatus
        }
      };

      const res = await BookingService.createBooking(bookingPayload);
      setSuccess(`Booking confirmed! Booking ID: #${res.data.data.id}`);
      
      // Close wizard after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create booking");
    }
    setLoading(false);
  };

  return (
    <div className="booking-wizard">
      <div className="wizard-header">
        <h2>✈ Book a Flight</h2>
        <button className="wizard-close" onClick={onClose}>✕</button>
      </div>

      <div className="wizard-steps">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`wizard-step ${step === s ? "active" : ""} ${s < step ? "completed" : ""}`}>
            <div className="step-num">{s < step ? "✓" : s}</div>
            <div className="step-label">
              {s === 1 && "Flight"}
              {s === 2 && "Passengers"}
              {s === 3 && "Payment"}
              {s === 4 && "Review"}
            </div>
          </div>
        ))}
      </div>

      <div className="wizard-content">
        {/* STEP 1: SELECT FLIGHT */}
        {step === 1 && (
          <div>
            <h3>Select Your Flight</h3>
            {flightsLoading ? (
              <div style={{ textAlign: "center", padding: 20 }}>Loading flights...</div>
            ) : flights.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20, color: "var(--text-secondary)" }}>
                No flights available
              </div>
            ) : (
              <div className="flights-list">
                {flights.map((flight) => (
                  <div
                    key={flight.id}
                    className={`flight-card ${selectedFlight?.id === flight.id ? "selected" : ""}`}
                    onClick={() => handleFlightSelect(flight)}
                  >
                    <div className="flight-airline">
                      <strong>{flight.airline}</strong>
                      <span className="flight-id">#{flight.id}</span>
                    </div>
                    <div className="flight-route">
                      {flight.source} → {flight.destination}
                    </div>
                    <div className="flight-time">
                      {new Date(flight.departureDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })} - {new Date(flight.arrivalDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="flight-info">
                      <span>Seats: {flight.totalSeats}</span>
                      <span className="price">₹{flight.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          </div>
        )}

        {/* STEP 2: PASSENGER DETAILS */}
        {step === 2 && (
          <div>
            <h3>Passenger Details</h3>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>How many passengers?</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={numPassengers}
                  onChange={handleNumPassengersChange}
                  style={{ maxWidth: 80 }}
                />
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  ({passengers.length} passenger{passengers.length !== 1 ? "s" : ""})
                </span>
              </div>
            </div>

            <div className="passengers-forms">
              {passengers.map((passenger, idx) => (
                <div key={idx} className="passenger-form-card">
                  <h4>Passenger {idx + 1}</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        placeholder="e.g. Rahul Sharma"
                        value={passenger.name}
                        onChange={(e) =>
                          handlePassengerChange(idx, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        placeholder="e.g. 28"
                        value={passenger.age}
                        onChange={(e) =>
                          handlePassengerChange(idx, "age", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        value={passenger.gender}
                        onChange={(e) =>
                          handlePassengerChange(idx, "gender", e.target.value)
                        }
                      >
                        <option>MALE</option>
                        <option>FEMALE</option>
                        <option>OTHER</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input
                        placeholder="e.g. 9876543210"
                        value={passenger.contactNumber}
                        onChange={(e) =>
                          handlePassengerChange(idx, "contactNumber", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Seat Number</label>
                      <input
                        placeholder="e.g. 12A"
                        value={passenger.seatNumber}
                        onChange={(e) =>
                          handlePassengerChange(idx, "seatNumber", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 3 && (
          <div>
            <h3>Payment Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="e.g. 5000"
                  value={payment.amount}
                  onChange={handlePaymentChange}
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={payment.paymentMethod}
                  onChange={handlePaymentChange}
                >
                  <option>UPI</option>
                  <option>CARD</option>
                  <option>NET_BANKING</option>
                  <option>CASH</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select
                  name="paymentStatus"
                  value={payment.paymentStatus}
                  onChange={handlePaymentChange}
                >
                  <option>PAID</option>
                  <option>PENDING</option>
                  <option>FAILED</option>
                </select>
              </div>
            </div>
            {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div>
            <h3>Review Your Booking</h3>
            
            <div className="review-section">
              <h4>✈ Flight Details</h4>
              <div className="review-item">
                <span>Airline:</span>
                <strong>{selectedFlight?.airline}</strong>
              </div>
              <div className="review-item">
                <span>Route:</span>
                <strong>{selectedFlight?.source} → {selectedFlight?.destination}</strong>
              </div>
              <div className="review-item">
                <span>Price per seat:</span>
                <strong>₹{selectedFlight?.price}</strong>
              </div>
            </div>

            <div className="review-section">
              <h4>👤 Passengers ({passengers.length})</h4>
              {passengers.map((p, idx) => (
                <div key={idx} className="review-item">
                  <span>{idx + 1}. {p.name} ({p.gender}, Age {p.age}) - Seat {p.seatNumber}</span>
                </div>
              ))}
            </div>

            <div className="review-section">
              <h4>💳 Payment</h4>
              <div className="review-item">
                <span>Total Amount:</span>
                <strong style={{ color: "var(--gold)" }}>₹{payment.amount}</strong>
              </div>
              <div className="review-item">
                <span>Method:</span>
                <strong>{payment.paymentMethod}</strong>
              </div>
              <div className="review-item">
                <span>Status:</span>
                <strong>{payment.paymentStatus}</strong>
              </div>
            </div>

            <div className="review-section">
              <h4>📅 Booking Date</h4>
              <div className="review-item">
                <span>Date:</span>
                <strong>{new Date(bookingDate).toLocaleDateString()}</strong>
              </div>
            </div>

            {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          </div>
        )}
      </div>

      <div className="wizard-actions">
        {step > 1 && (
          <button
            className="btn btn-ghost"
            onClick={() => setStep(step - 1)}
            disabled={loading}
          >
            ← Back
          </button>
        )}

        {step < 4 && (
          <button
            className="btn btn-primary"
            onClick={() => {
              if (step === 1) handleStep1Next();
              else if (step === 2) handleStep2Next();
              else if (step === 3) handleStep3Next();
            }}
            disabled={loading}
          >
            Next →
          </button>
        )}

        {step === 4 && (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "✓ Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
