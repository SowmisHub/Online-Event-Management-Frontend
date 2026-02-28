import { useMemo, useState } from "react";

function MySessions({ sessions = [], myEvents = [] }) {
  const [selectedEvent, setSelectedEvent] = useState("all");

  const filteredSessions = useMemo(() => {
    if (selectedEvent === "all") return sessions;
    return sessions.filter(s => s.event_id === selectedEvent);
  }, [sessions, selectedEvent]);

  const getButtonState = (start, end) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);
    const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60000);

    if (now < fiveMinutesBefore) {
      return {
        label: "Not Started",
        disabled: true,
        style: "bg-gray-200 text-gray-500 cursor-not-allowed"
      };
    }

    if (now >= fiveMinutesBefore && now <= endTime) {
      return {
        label: "Join Now",
        disabled: false,
        style: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
      };
    }

    return {
      label: "Ended",
      disabled: true,
      style: "bg-red-100 text-red-500 cursor-not-allowed"
    };
  };

  const handleJoin = (url) => {
    if (!url) {
      alert("Meeting link not available yet.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-bold mt-12">My Sessions</h1>
        <p className="text-gray-500 mt-1">
          Sessions from events you registered
        </p>
      </div>

      <div>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Events</option>
          {myEvents.map(event => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">

        {filteredSessions.length === 0 && (
          <p className="text-gray-500">No sessions available.</p>
        )}

        {filteredSessions.map(session => {

          const buttonState = getButtonState(
            session.start_time,
            session.end_time
          );

          return (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition"
            >

              {/* LEFT SECTION */}
              <div className="flex items-start gap-4">

                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  {session.event_title?.charAt(0)}
                </div>

                <div className="space-y-1">

                  <h3 className="font-semibold text-lg">
                    {session.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(session.start_time).toDateString()}
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Event:</span> {session.event_title}
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Speaker:</span>{" "}
                    {session.speaker_name ? session.speaker_name : "TBA"}
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span>{" "}
                    {new Date(session.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })} –{" "}
                    {new Date(session.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>

                </div>
              </div>

              {/* BUTTON */}
              <button
                disabled={buttonState.disabled}
                onClick={() => handleJoin(session.meeting_url)}
                className={`mt-4 md:mt-0 px-4 py-2 text-sm rounded-lg font-medium transition ${buttonState.style}`}
              >
                {buttonState.label}
              </button>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default MySessions;