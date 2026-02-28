import { useState } from "react";
import axios from "@/lib/axios";
import {
  CalendarDays,
  Link as LinkIcon,
  X
} from "lucide-react";

function SpeakerSchedule({ data, refresh }) {

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [eventFilter, setEventFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const sessions = data.sessions || [];

  const filteredSessions = sessions.filter(session => {

    if (eventFilter !== "all" && session.event_id !== eventFilter) {
      return false;
    }

    if (dateFilter) {
      const sessionDate = new Date(session.start_time)
        .toISOString()
        .split("T")[0];

      if (sessionDate !== dateFilter) return false;
    }

    return true;
  });

  const getStatus = (session) => {
    const now = new Date();
    const start = new Date(session.start_time);
    const end = new Date(session.end_time);

    if (now < start) return "not_started";
    if (now > end) return "ended";
    return "started";
  };

  const openModal = (session) => {
    setSelectedSession(session);
    setMeetingUrl(session.meeting_url || "");
  };

  const closeModal = () => {
    setSelectedSession(null);
    setMeetingUrl("");
  };

  const handleSaveUrl = async () => {

    if (!meetingUrl) return;

    try {
      setUpdatingId(selectedSession.id);

      await axios.put(
        `${API}/api/speaker/update-meeting/${selectedSession.id}`,
        { meeting_url: meetingUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refresh();
      closeModal();

    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Assigned Sessions
        </h1>
        <p className="text-gray-500 mt-1">
          Find all your scheduled sessions here
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="border p-3 rounded-xl w-full md:w-64"
        >
          <option value="all">All Events</option>
          {[...new Set(sessions.map(s => s.event_id))].map(id => (
            <option key={id} value={id}>
              {sessions.find(s => s.event_id === id)?.event_title}
            </option>
          ))}
        </select>

        {/* DATE FILTER WITH CLEAR BUTTON */}
        <div className="relative w-full md:w-64">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border p-3 rounded-xl w-full pr-10"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

      </div>

      {/* SESSION LIST */}
      <div className="space-y-6">

        {filteredSessions.length === 0 ? (
          <p className="text-gray-500">No sessions found</p>
        ) : (
          filteredSessions.map(session => {

            const status = getStatus(session);

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >

                {/* LEFT */}
                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {session.title}
                    </h3>

                    <p className="text-sm text-purple-600 font-medium">
                      {session.event_title}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(session.start_time).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {" - "}
                      {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                  {status === "started" ? (
                    <button
                      onClick={() => window.open(session.meeting_url, "_blank")}
                      disabled={!session.meeting_url}
                      className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-40 w-full sm:w-auto"
                    >
                      Join
                    </button>
                  ) : status === "ended" ? (
                    <button
                      disabled
                      className="px-5 py-2 rounded-xl bg-red-100 text-red-600 font-medium w-full sm:w-auto"
                    >
                      Ended
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-5 py-2 rounded-xl bg-gray-200 text-gray-600 font-medium w-full sm:w-auto"
                    >
                      Not Started
                    </button>
                  )}

                  <button
                    onClick={() => openModal(session)}
                    className="px-5 py-2 rounded-xl border hover:bg-gray-50 transition flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <LinkIcon size={16} />
                    {session.meeting_url ? "Edit URL" : "Add URL"}
                  </button>

                </div>

              </div>
            );
          })
        )}

      </div>

      {/* MODAL */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Update Meeting URL
            </h2>

            <input
              type="text"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="Enter meeting link"
              className="border w-full p-3 rounded-xl mb-4"
            />

            <button
              onClick={handleSaveUrl}
              disabled={updatingId === selectedSession.id}
              className="w-full py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-60"
            >
              {updatingId === selectedSession.id ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Save URL"
              )}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default SpeakerSchedule;