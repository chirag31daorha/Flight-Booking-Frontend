import API from '../axios/axios';

// Add this
export const AuthService = {
  login: (data) => API.post('/user/login', data),
  register: (data) => API.post('/user/register', data),
};

// rest of your services stay exactly the same...

export const FlightService = {
  addFlight: (data) => API.post('/flight/addFlight', data),
  getAllFlights: () => API.get('/flight/getAllFlight'),
  getFlightById: (id) => API.get(`/flight/getById/${id}`),
  getFlightsBySourceAndDestination: (source, destination) =>
    API.get(`/flight/?source=${source}&destination=${destination}`),
  getFlightsByAirline: (airline) => API.get(`/flight/${airline}`),
  updateFlight: (id, data) => API.put(`/flight/updateFlight/${id}`, data),
  deleteFlight: (id) => API.delete(`/flight/deleteFlight/${id}`),
};

export const BookingService = {
  createBooking: (data) => API.post('/booking', data),
  getAllBookings: () => API.get('/booking/getAll'),
  getBookingById: (id) => API.get(`/booking/${id}`),
  getBookingByFlight: (flightId) => API.get(`/booking/flight/${flightId}`),
  getBookingByDate: (date) => API.get(`/booking/date/${date}`),
  getBookingByStatus: (status) => API.get(`/booking/status/${status}`),
  getAllPassengersInBooking: (id) => API.get(`/booking/${id}/passengers`),
  getPaymentDetailsOfBooking: (id) => API.get(`/booking/${id}/payment`),
  updateBookingStatus: (id, status) => API.put(`/booking/${id}/status?status=${status}`),
  deleteBooking: (id) => API.delete(`/booking/${id}`),
};

export const PassengerService = {
  addPassenger: (data) => API.post('/passenger', data),
  getAllPassengers: () => API.get('/passenger'),
  getPassengerById: (id) => API.get(`/passenger/${id}`),
  getPassengerByContactNo: (contact) => API.get(`/passenger/contact/${contact}`),
  updatePassengerInfo: (id, data) => API.put(`/passenger/${id}`, data),
  getPassengersByFlight: (flightId) => API.get(`/passenger/flight/${flightId}`),
};

export const PaymentService = {
  recordPayment: (data) => API.post('/payment', data),
  getAllPayments: () => API.get('/payment'),
  getPaymentById: (id) => API.get(`/payment/${id}`),
  getPaymentByStatus: (status) => API.get(`/payment/status/${status}`),
  getPaymentByModeOfTransaction: (mode) => API.get(`/payment/mode/${mode}`),
  getPaymentByBooking: (bookingId) => API.get(`/payment/booking/${bookingId}`),
  updatePaymentStatus: (id, status) => API.put(`/payment/${id}/status?status=${status}`),
  getPaymentsByAmountGreaterThan: (amount) => API.get(`/payment/amount?min=${amount}`),
};
