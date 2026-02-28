import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Speakers from "./pages/Speakers";
import Sponsors from "./pages/Sponsors";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/SignUP";
import AdminDashboard from "./pages/AdminDashboard";
import SpeakerDashboard from "./pages/SpeakerDashboard";
import UserDashboard from "./pages/UserDashboard";
import EventDetails from "./pages/EventDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname.includes("dashboard");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["attendee"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/speaker-dashboard"
          element={
            <ProtectedRoute allowedRoles={["speaker"]}>
              <SpeakerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;