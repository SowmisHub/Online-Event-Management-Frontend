import axios from "@/lib/axios";
import { useState } from "react";

function MyEvents({ myEvents, refresh }) {
  const [detailsEvent, setDetailsEvent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleDelete = async (eventId) => {
      try {
        setDeletingId(eventId);

        await axios.delete(
          `${API}/api/register/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        refresh();

      } catch (err) {
        console.log(err);
      } finally {
        setDeletingId(null);
      }
    };

  return (
    <div className="space-y-6 relative z-0">

      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold mt-12">
          My Events
        </h1>
        <p className="text-gray-500 mt-1">
          Events you're registered for
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">

        {myEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-md transition"
          >

            {/* Left */}
            <div className="flex items-center gap-4">

              <img
                src={event.image_url}
                alt={event.title}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <div>
                <h3 className="font-semibold">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(event.date).toDateString()}
                </p>

                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Registered
                  </span>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 relative z-10">

              <button
                onClick={() => setDetailsEvent(event)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                View
              </button>

              <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition duration-200 transform hover:scale-110 active:scale-95 disabled:opacity-50"
                >
                  {deletingId === event.id ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></span>
                  ) : (
                    "🗑"
                  )}
                </button>

            </div>
          </div>
        ))}

      </div>

      {/* DETAILS MODAL */}
      {detailsEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">

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

export default MyEvents;