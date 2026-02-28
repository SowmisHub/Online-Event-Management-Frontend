import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import { Star } from "lucide-react";

function UserFeedback() {

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    event_id: "",
    overall: 5,
    content: 5,
    speaker: 5,
    comment: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoadingData(true);
      const res = await axios.get(`${API}/api/events`);
      setEvents(res.data || []);
    } catch (err) {
      console.log("Event fetch error", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {

    if (!form.event_id) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Please select an event",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${API}/api/feedback`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // ✅ Small beautiful success toast
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Feedback submitted successfully",
        showConfirmButton: false,
        timer: 1500
      });

      // Reset form
      setForm({
        event_id: "",
        overall: 5,
        content: 5,
        speaker: 5,
        comment: ""
      });

    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Error submitting feedback",
        showConfirmButton: false,
        timer: 1800
      });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-2">
      {[1,2,3,4,5].map(num => (
        <Star
          key={num}
          size={26}
          onClick={() => onChange(num)}
          className={`cursor-pointer transition ${
            num <= value
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 hover:text-yellow-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="flex justify-center py-10 px-4">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Feedback
          </h1>
          <p className="text-gray-500 mt-1">
            Rate your experience and help us improve
          </p>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Event Dropdown */}
            <select
              value={form.event_id}
              onChange={e => setForm({...form, event_id: e.target.value})}
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Select Event</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>

            {/* Ratings */}
            <div className="space-y-6">

              <div>
                <p className="font-medium mb-2 text-gray-700">Overall Experience</p>
                <StarRating
                  value={form.overall}
                  onChange={(v)=>setForm({...form, overall:v})}
                />
              </div>

              <div>
                <p className="font-medium mb-2 text-gray-700">Content Quality</p>
                <StarRating
                  value={form.content}
                  onChange={(v)=>setForm({...form, content:v})}
                />
              </div>

              <div>
                <p className="font-medium mb-2 text-gray-700">Speaker Performance</p>
                <StarRating
                  value={form.speaker}
                  onChange={(v)=>setForm({...form, speaker:v})}
                />
              </div>

            </div>

            {/* Comment */}
            <textarea
              value={form.comment}
              onChange={e => setForm({...form, comment:e.target.value})}
              placeholder="Share your thoughts..."
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              rows={4}
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl flex justify-center items-center gap-2 text-lg font-medium hover:opacity-90 transition"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default UserFeedback;