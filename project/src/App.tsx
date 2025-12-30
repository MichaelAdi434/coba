import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TicketSelectionPage } from './pages/TicketSelectionPage';
import { BookingFormPage } from './pages/BookingFormPage';
import { PaymentPage } from './pages/PaymentPage';
import { BookingProvider } from './contexts/BookingContext';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tickets" element={<TicketSelectionPage />} />
          <Route path="/booking" element={<BookingFormPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
