import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import { Search, Plus, Trash2 } from "lucide-react";
import AddSpeakerModal from "./AddSpeakerModal";
import AssignSessionModal from "./AssignSessionModal";

function AdminSpeakers() {

  const [speakers, setSpeakers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [sessionsMap, setSessionsMap] = useState({}); // ✅ FIXED

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const fetchSpeakers = async () => {
    setLoading(true);
    const res = await axios.get(
      `${API}/api/admin/speakers?search=${search}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSpeakers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSpeakers();
  }, [search]);

  const loadSessions = async (id) => {

    if (expanded === id) {
      setExpanded(null);
      return;
    }

    const res = await axios.get(
      `${API}/api/admin/speaker-sessions/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSessionsMap(prev => ({
      ...prev,
      [id]: res.data
    }));

    setExpanded(id);
  };

  const deleteSession = async (speakerId, sessionId) => {

    const confirm = await Swal.fire({
      title: "Delete Session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete"
    });

    if (confirm.isConfirmed) {

      await axios.delete(
        `${API}/api/admin/delete-session/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadSessions(speakerId);
      fetchSpeakers();
    }
  };

  const removeSpeaker = async (id) => {

    const confirm = await Swal.fire({
      title: "Remove Speaker Role?",
      text: "User will become normal attendee.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Remove"
    });

    if (confirm.isConfirmed) {
      await axios.put(
        `${API}/api/admin/remove-speaker/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSpeakers();
    }
  };

  const getSessionText = (count) => {
    if (!count || count === 0) return "0 sessions";
    if (count === 1) return "1 session";
    return `${count} sessions`;
  };

  return (
    <div className="p-6">
        <h1 className="text-3xl font-bold mb-1 mt-6">Speaker Management</h1>
        <p className="text-gray-500 mb-6">
            Manage speaker and their sessions
        </p>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
          <input
            type="text"
            placeholder="Search speakers..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <button
          onClick={()=>setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16}/>
          Add Speaker
        </button>

      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">

          {speakers.map(sp => (
            <div key={sp.id} className="bg-white border rounded-xl p-5 shadow-sm">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    🎤
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">{sp.name}</h3>

                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Speaker
                      </span>
                      <span>{getSessionText(sp.session_count)}</span>
                    </div>

                    {sp.session_count > 0 && (
                      <div className="mt-2">
                        {expanded === sp.id ? (
                          <button
                            onClick={() => setExpanded(null)}
                            className="text-purple-600 text-sm"
                          >
                            Hide sessions
                          </button>
                        ) : (
                          <button
                            onClick={() => loadSessions(sp.id)}
                            className="text-purple-600 text-sm"
                          >
                            View {sp.session_count} assigned {sp.session_count === 1 ? "session" : "sessions"}
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0 items-center">

                  <button
                    onClick={()=>setShowSessionModal(sp)}
                    className="bg-gray-100 px-4 py-2 rounded-lg"
                  >
                    + Assign Session
                  </button>

                  <button
                    onClick={()=>removeSpeaker(sp.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18}/>
                  </button>

                </div>
              </div>

              {expanded === sp.id && (
                <div className="mt-4 space-y-3">

                  {(sessionsMap[sp.id] || []).map(sess => (
                    <div
                      key={sess.id}
                      className="border rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{sess.title}</div>
                        <div className="text-sm text-gray-500">
                          {sess.events?.title} • {new Date(sess.start_time).toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={()=>deleteSession(sp.id, sess.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18}/>
                      </button>

                    </div>
                  ))}

                </div>
              )}

            </div>
          ))}

        </div>
      )}

      {showAddModal && (
        <AddSpeakerModal
          close={()=>setShowAddModal(false)}
          refresh={fetchSpeakers}
        />
      )}

      {showSessionModal && (
        <AssignSessionModal
          speaker={showSessionModal}
          close={()=>{
            setShowSessionModal(null);
            fetchSpeakers();
          }}
        />
      )}

    </div>
  );
}

export default AdminSpeakers;