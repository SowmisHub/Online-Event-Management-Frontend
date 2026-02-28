import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);

        if (!res.ok) {
          console.error("API Error:", res.status);
          setEvents([]);
          return;
        }

        const data = await res.json();

        // Ensure backend always gives array
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Unexpected API response:", data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const categories = [
    "All",
    "Technology",
    "Business",
    "Design",
    "Marketing",
    "Science",
  ];

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <div className="pt-28 px-10">
      <h1 className="text-4xl font-bold text-center mb-6">
        Discover <span className="text-blue-600">Events</span>
      </h1>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === category
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-purple-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={event.image_url}
                alt={event.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <Link
                  to={`/event/${event.id}`}
                  className="block mt-4 bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 text-lg">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;