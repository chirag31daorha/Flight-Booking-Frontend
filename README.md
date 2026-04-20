# ✈️ Flight Booking System — Frontend

A React-based frontend for the Flight Booking System. This application allows users to manage flights, bookings, passengers, and payments — all secured with **JWT Authentication**.

---

## 🛠️ Tech Stack

- **React** (UI Library)
- **Vite** (Build Tool)
- **Axios** (API Calls)
- **JWT** (Token-based Authentication)

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── axios/               # Axios instance & interceptors
│   ├── components/          # All UI components
│   │   ├── Login.jsx        # Login page
│   │   ├── Dashboard.jsx    # Main dashboard after login
│   │   ├── FlightManager.jsx      # Manage flights
│   │   ├── BookingManager.jsx     # Manage bookings
│   │   ├── PassengerManager.jsx   # Manage passengers
│   │   └── PaymentManager.jsx     # Manage payments
│   └── services/            # API call functions
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔐 Authentication Flow

1. User visits the **Login** page
2. On successful login, **JWT token** is received from backend (`/user/login`)
3. Token is stored and attached to every API request header automatically via Axios:
   ```
   Authorization: Bearer <token>
   ```
4. After login, user is redirected to the **Dashboard**
5. On logout, token is cleared

---

## 🖥️ Components

| Component | Description |
|---|---|
| `Login.jsx` | Login form — authenticates user and stores JWT token |
| `Dashboard.jsx` | Main landing page after login — navigation to all modules |
| `FlightManager.jsx` | Add, view, update and delete flights |
| `BookingManager.jsx` | Create, view, update and delete bookings |
| `PassengerManager.jsx` | Add, view and update passengers |
| `PaymentManager.jsx` | Record and view payments |

---

## 🔗 Backend Connection

Make sure the backend is running before starting the frontend.

Backend Repo: [Flight-Booking-System](https://github.com/chirag31daorha/Flight-Booking-System)

The frontend connects to the backend at:
```
http://localhost:8080
```

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- npm
- Backend server running on `http://localhost:8080`

### Steps

1. Clone the repository
```bash
git clone https://github.com/chirag31daorha/flight-booking-frontend.git
```

2. Go into the project folder
```bash
cd flight-booking-frontend
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

5. Open in browser
```
http://localhost:5173
```

---

## 🎯 Key Learnings

- Building a React app with **Vite** for fast development
- Implementing **JWT-based login** in React
- Making secure API calls using **Axios**
- Attaching JWT token automatically via **Axios interceptors**
- Connecting React frontend with a **Spring Boot REST API**
- Managing multiple modules — Flights, Bookings, Passengers, Payments

---

## 👤 Author

**Chirag Daorha**
[LinkedIn](https://www.linkedin.com/in/chiragdaorha31/) | [GitHub](https://github.com/chirag31daorha)
