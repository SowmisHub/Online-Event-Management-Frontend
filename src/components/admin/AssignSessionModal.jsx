import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";

function AssignSessionModal({ speaker, close, editData = null }) {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    event_id: "",
    title: "",
    description: "",
    type: "session",
    location: "Virtual",
    meeting_url: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: ""
  });

  /* ================= FETCH EVENTS ================= */

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(`${API}/api/events`);
      setEvents(res.data || []);
    };
    fetchEvents();
  }, []);

  /* ================= PREFILL FOR EDIT ================= */

  useEffect(() => {
    if (editData && editData.id) {
      setForm({
        event_id: editData.event_id || "",
        title: editData.title || "",
        description: editData.description || "",
        type: editData.type || "session",
        location: editData.room_name || "Virtual",
        meeting_url: editData.meeting_url || "",
        start_date: editData.start_time
          ? editData.start_time.slice(0, 10)
          : "",
        start_time: editData.start_time
          ? editData.start_time.slice(11, 16)
          : "",
        end_date: editData.end_time
          ? editData.end_time.slice(0, 10)
          : "",
        end_time: editData.end_time
          ? editData.end_time.slice(11, 16)
          : ""
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const combineDateTime = (date, time) => {
    return new Date(`${date}T${time}:00`).toISOString();
  };

  const handleSubmit = async () => {
    try {

      if (
        !form.event_id ||
        !form.title ||
        !form.description ||
        !form.start_date ||
        !form.start_time ||
        !form.end_date ||
        !form.end_time
      ) {
        Swal.fire("Please fill all required fields");
        return;
      }

      setLoading(true);

      const startISO = combineDateTime(form.start_date, form.start_time);
      const endISO = combineDateTime(form.end_date, form.end_time);

      if (editData && editData.id) {

        await axios.put(
          `${API}/api/admin/update-session/${editData.id}`,
          {
            event_id: form.event_id,
            speaker_id: speaker?.id,
            title: form.title,
            description: form.description,
            type: form.type,
            location: form.location,
            meeting_url: form.meeting_url,
            start_time: startISO,
            end_time: endISO
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          icon: "success",
          title: "Session Updated",
          timer: 1200,
          showConfirmButton: false
        });

      } else {

        await axios.post(
          `${API}/api/admin/assign-session`,
          {
            event_id: form.event_id,
            speaker_id: speaker?.id,
            title: form.title,
            description: form.description,
            type: form.type,
            location: form.location,
            meeting_url: form.meeting_url,
            start_time: startISO,
            end_time: endISO
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          icon: "success",
          title: "Session Assigned",
          timer: 1200,
          showConfirmButton: false
        });
      }

      close();

    } catch (err) {
      console.log(err);
      Swal.fire("Error saving session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {editData && editData.id ? "Edit Session" : `Assign Session to ${speaker?.name || ""}`}
          </h2>
          <button onClick={close}>✕</button>
        </div>

        <div className="space-y-4">

          <select
            name="event_id"
            value={form.event_id}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select Event *</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>

          <input
            name="title"
            placeholder="Session Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description *"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg resize-none"
            rows={4}
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="session">Session</option>
            <option value="workshop">Workshop</option>
            <option value="panel">Panel</option>
            <option value="keynote">Keynote</option>
          </select>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          <input
            name="meeting_url"
            placeholder="Zoom / Google Meet URL (optional)"
            value={form.meeting_url}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          <div>
            <label className="font-medium text-sm">Start Time *</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="border p-2 rounded-lg"/>
              <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="border p-2 rounded-lg"/>
            </div>
          </div>

          <div>
            <label className="font-medium text-sm">End Time *</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="border p-2 rounded-lg"/>
              <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="border p-2 rounded-lg"/>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={close} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                editData && editData.id ? "Update Session" : "Assign Session"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AssignSessionModal;