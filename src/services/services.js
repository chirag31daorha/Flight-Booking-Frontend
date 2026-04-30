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
  getFlightsBySourceAndDestination: (source, destination) => API.get(`/flight/${source}/${destination}`),
  getFlightsByAirline: (airline) => API.get(`/flight/${airline}`),
  updateFlight: (data) => API.put(`/flight/updateFlight`, data),
  deleteFlight: (id) => API.delete(`/flight/deleteFlight/${id}`),
};

export const BookingService = {
  createBooking: (data) => API.post('/booking/create', data),
  getAllBookings: () => API.get('/booking/getAll'),
  getBookingById: (id) => API.get(`/booking/getById/${id}`),
  getBookingByFlight: (flightId) => API.get(`/booking/getByFlight/${flightId}`),
  getBookingByDate: (date) => API.get(`/booking/getByDate/${date}`),
  getBookingByStatus: (status) => API.get(`/booking/getByStatus/${status}`),
  updateBooking: (data) => API.put(`/booking/updateBooking`, data),
  deleteBooking: (id) => API.delete(`/booking/deleteBooking/${id}`),
  getAllPassengersInBooking: (bookingId) => API.get(`/booking/getAllPassengers/${bookingId}`),
  getPaymentDetails: (bookingId) => API.get(`/booking/getPayment/${bookingId}`),
};

export const PassengerService = {
  addPassenger: (data) => API.post('/passenger/add', data),
  getAllPassengers: () => API.get('/passenger/getAll'),
  getPassengerById: (id) => API.get(`/passenger/getById/${id}`),
  getPassengerByContactNo: (contactNumber) => API.get(`/passenger/getByNumber/contactNumber/${contactNumber}`),
  updatePassengerInfo: (data) => API.put(`/passenger/update`, data),
  getPassengersByFlight: (flightId) => API.get(`/passenger/${flightId}`),
};

export const PaymentService = {
  recordPayment: (data) => API.post('/payment/record', data),
  getAllPayments: () => API.get('/payment/getAll'),
  getPaymentById: (paymentId) => API.get(`/payment/getById/${paymentId}`),
  getPaymentByStatus: (status) => API.get(`/payment/status/${status}`),
  getPaymentByModeOfTransaction: (transaction) => API.get(`/payment/${transaction}`),
  getPaymentByBooking: (bookingId) => API.get(`/payment/getByBooking/${bookingId}`),
  updatePaymentStatus: (paymentId, status) => API.put(`/payment/${paymentId}/${status}`),
  getPaymentsByAmountGreaterThan: (amount) => API.get(`/payment/amount/${amount}`),
};
