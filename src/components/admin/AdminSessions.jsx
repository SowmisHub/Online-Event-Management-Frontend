import { useEffect, useState, useMemo } from "react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import AssignSessionModal from "../admin/AssignSessionModal";
import { Pencil, Trash2, Video } from "lucide-react";

function AdminSessions() {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [editSession, setEditSession] = useState(null);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [sessionsRes, eventsRes] = await Promise.all([
        axios.get(`${API}/api/admin/all-sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/api/events`)
      ]);

      setSessions(sessionsRes.data || []);
      setEvents(eventsRes.data || []);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FILTER ================= */

  const filteredSessions = useMemo(() => {
    if (selectedEvent === "all") return sessions;
    return sessions.filter(s => s.event_id === selectedEvent);
  }, [sessions, selectedEvent]);

  /* ================= TIME LOGIC ================= */

  const getJoinState = (start, end) => {

    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);
    const fiveMinBefore = new Date(startTime.getTime() - 5 * 60000);

    if (now < fiveMinBefore) {
      return {
        label: "Not Started",
        disabled: true,
        style: "bg-gray-200 text-gray-500 cursor-not-allowed"
      };
    }

    if (now >= fiveMinBefore && now <= endTime) {
      return {
        label: "Join",
        disabled: false,
        style: "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
      };
    }

    return {
      label: "Ended",
      disabled: true,
      style: "bg-red-100 text-red-500 cursor-not-allowed"
    };
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    const confirm = await Swal.fire({
      title: "Delete this session?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete"
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(
      `${API}/api/admin/delete-session/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  /* ================= JOIN ================= */

  const handleJoin = (url) => {
    if (!url) {
      Swal.fire("Meeting link not available");
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">

      <h1 className="text-3xl font-bold mb-1 mt-6">Sessions Management</h1>
      <p className="text-gray-500 mb-10 mt-3">
        Create, Edit and Delete the Sessions
      </p>

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full sm:w-64 border px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Events</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>

        <button
          onClick={() => setEditSession({})}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          + Add Session
        </button>

      </div>

      {/* ================= LOADER ================= */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (

        <div className="space-y-6">

          {filteredSessions.length === 0 && (
            <p className="text-gray-500 text-center sm:text-left">
              No sessions available.
            </p>
          )}

          {filteredSessions.map(session => {

            const joinState = getJoinState(session.start_time, session.end_time);

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition border border-gray-100"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* LEFT SECTION */}
                  <div className="flex gap-4">

                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-purple-50 text-purple-600 border border-purple-100 flex-shrink-0">
                      <Video size={18} strokeWidth={2} />
                    </div>

                    <div className="space-y-1">

                      <h2 className="text-lg sm:text-xl font-bold text-purple-700 break-words">
                        {session.title}
                      </h2>

                      <p className="text-sm">
                        <span className="font-semibold text-blue-600">Event:</span>{" "}
                        {session.event_title}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold text-green-600">Speaker:</span>{" "}
                        {session.speaker_name || "No Speaker"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(session.start_time).toLocaleString()} –{" "}
                        {new Date(session.end_time).toLocaleString()}
                      </p>

                    </div>
                  </div>

                  {/* RIGHT BUTTONS */}
                  <div className="flex flex-wrap gap-3 justify-start lg:justify-end">

                    <button
                      disabled={joinState.disabled}
                      onClick={() => handleJoin(session.meeting_url)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${joinState.style}`}
                    >
                      {joinState.label}
                    </button>

                    <button
                      onClick={() => setEditSession(session)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={18}/>
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {editSession !== null && (
        <AssignSessionModal
          speaker={
            editSession?.speaker_id
              ? {
                  id: editSession.speaker_id,
                  name: editSession.speaker_name
                }
              : null
          }
          editData={editSession?.id ? editSession : null}
          close={() => {
            setEditSession(null);
            fetchData();
          }}
        />
      )}

    </div>
  );
}

export default AdminSessions;