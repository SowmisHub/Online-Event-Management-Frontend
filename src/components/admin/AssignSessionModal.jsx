import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";

function AssignSessionModal({ speaker, close, editData = null }) {
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    event_id: "",
    speaker_id: "",
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
    axios.get(`${API}/api/events`)
      .then(res => setEvents(res.data || []))
      .catch(err => console.log(err));
  }, []);

  /* ================= FETCH SPEAKERS ================= */
  useEffect(() => {
    axios.get(`${API}/api/admin/speakers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSpeakers(res.data || []))
      .catch(err => {
        console.log("Speakers fetch error:", err);
        setSpeakers([]);
      });
  }, []);

  /* ================= AUTO SELECT IF FROM SPEAKER PAGE ================= */
  useEffect(() => {
    if (speaker?.id) {
      setForm(prev => ({
        ...prev,
        speaker_id: speaker.id
      }));
    }
  }, [speaker]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const combineDateTime = (date, time) =>
    new Date(`${date}T${time}:00`).toISOString();

  const handleSubmit = async () => {
    if (
      !form.event_id ||
      !form.speaker_id ||
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

    try {
      setLoading(true);

      const payload = {
        event_id: form.event_id,
        speaker_id: form.speaker_id,
        title: form.title,
        description: form.description,
        type: form.type,
        location: form.location,
        meeting_url: form.meeting_url,
        start_time: combineDateTime(form.start_date, form.start_time),
        end_time: combineDateTime(form.end_date, form.end_time)
      };

      await axios.post(
        `${API}/api/admin/assign-session`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Session Assigned",
        timer: 1200,
        showConfirmButton: false
      });

      close();
    } catch (err) {
      console.log(err);
      Swal.fire("Error saving session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      {/* REMOVE overflow-y-auto FROM THIS DIV */}
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Assign Session</h2>
          <button onClick={close}>✕</button>
        </div>

        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">

          {/* EVENT */}
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

          {/* SPEAKER DROPDOWN */}
          <select
            name="speaker_id"
            value={form.speaker_id}
            onChange={handleChange}
            disabled={!!speaker}
            className="w-full border p-2 rounded-lg disabled:bg-gray-100"
          >
            <option value="">Select Speaker *</option>
            {speakers.map(sp => (
              <option key={sp.id} value={sp.id}>
                {sp.name}
              </option>
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
            placeholder="Meeting URL"
            value={form.meeting_url}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />

          <div className="grid grid-cols-2 gap-3">
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="border p-2 rounded-lg"/>
            <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="border p-2 rounded-lg"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="border p-2 rounded-lg"/>
            <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="border p-2 rounded-lg"/>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={close} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Assign Session"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AssignSessionModal;