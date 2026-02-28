import axios from "@/lib/axios";
import { useState, useEffect } from "react";
import RegisterModal from "./RegisterModal";
import PaymentModal from "./PaymentModal";

function BrowseEvents({ events, refresh }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [paymentEvent, setPaymentEvent] = useState(null);
  const [pendingForm, setPendingForm] = useState(null);
  const [detailsEvent, setDetailsEvent] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // ✅ ADDED: highlight state
  const [highlightId, setHighlightId] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // ✅ ADDED: check highlight event when component loads
  useEffect(() => {
    const storedId = localStorage.getItem("highlightEventId");
    if (storedId) {
      setHighlightId(storedId);
      localStorage.removeItem("highlightEventId");

      setTimeout(() => {
        setHighlightId(null);
      }, 2000); // highlight for 2 seconds
    }
  }, []);

  const generateTicketCode = () => {
    return "EVT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  /* ================= NORMAL REGISTER ================= */

  const handleRegister = async (formData, eventObj) => {
    try {
      setLoadingId(eventObj.id);

      await axios.post(
        `${API}/api/register/${eventObj.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refresh();
      setSelectedEvent(null);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= PAY FLOW ================= */

  const handlePayFlow = (formData) => {
    setPendingForm(formData);
    setPaymentEvent(selectedEvent);
  };

  /* ================= PAYMENT SUCCESS ================= */

  const handlePaymentSuccess = async () => {
    try {
      setLoadingId(paymentEvent.id);

      setPaymentEvent(null);

      await axios.post(
        `${API}/api/tickets`,
        {
          eventId: paymentEvent.id,
          ticketCode: generateTicketCode(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        `${API}/api/register/${paymentEvent.id}`,
        pendingForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedEvent(null);
      setLoadingId(null);

      await refresh();

    } catch (err) {
      console.log(err.response?.data || err.message);
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold mt-12">
        Browse Events
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map((event) => (
          <div
            key={event.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 ${
              String(highlightId) === String(event.id)
                ? "border-4 border-purple-600 scale-105"
                : ""
            }`}
          >
            <img
              src={event.image_url}
              alt={event.title}
              className="h-44 w-full object-cover"
            />

            <div className="p-4 space-y-3">

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {event.title}
                </h2>

                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {event.description}
              </p>

              <div className="flex items-center justify-between pt-2">

                <button
                  onClick={() => setDetailsEvent(event)}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Details
                </button>

                {event.registered ? (
                  <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm">
                    Registered
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>

      {selectedEvent && (
        <RegisterModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSubmit={(form) => handleRegister(form, selectedEvent)}
          onPay={handlePayFlow}
          loading={loadingId}
        />
      )}

      {paymentEvent && (
        <PaymentModal
          event={paymentEvent}
          onClose={() => setPaymentEvent(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {detailsEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[520px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold">
                {detailsEvent.title}
              </h2>
              <button
                onClick={() => setDetailsEvent(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <img
                src={detailsEvent.image_url}
                alt={detailsEvent.title}
                className="w-full h-52 object-cover rounded-lg"
              />

              <p className="text-gray-700 text-sm leading-relaxed">
                {detailsEvent.description}
              </p>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(detailsEvent.date).toDateString()}
                </p>

                <p>
                  <strong>Price:</strong>{" "}
                  {detailsEvent.price === 0
                    ? "Free"
                    : `$${detailsEvent.price}`}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {detailsEvent.category}
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default BrowseEvents;