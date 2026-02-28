import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`
        );

        if (!res.ok) {
          console.error("API Error:", res.status);
          setEvent(null);
          return;
        }

        const data = await res.json();

        if (data && typeof data === "object") {
          setEvent(data);
        } else {
          console.error("Unexpected API response:", data);
          setEvent(null);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <p className="pt-28 text-center">Loading...</p>;
  }

  if (!event) {
    return (
      <p className="pt-28 text-center text-red-500">
        Event not found.
      </p>
    );
  }

  const handleRegisterClick = () => {
    // ✅ store selected event for highlight
    localStorage.setItem("fromLandingRegister", "true");
    localStorage.setItem("highlightEventId", id);
    navigate("/login");
  };

  return (
    <div className="pt-28 px-10 max-w-4xl mx-auto">
      <img
        src={event.image_url}
        alt={event.title}
        className="rounded-xl w-full h-72 object-cover"
      />

      <h1 className="text-3xl font-bold mt-6">{event.title}</h1>
      <p className="text-gray-600 mt-4">{event.description}</p>

      <p className="mt-4 text-gray-500">
        {event.date} • {event.price === 0 ? "Free" : `$${event.price}`}
      </p>

      <button
        onClick={handleRegisterClick}
        className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Register Now
      </button>
    </div>
  );
}

export default EventDetails;