import { useEffect, useState, useMemo } from "react";
import axios from "@/lib/axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

function AdminFeedback() {

  const API = import.meta.env.VITE_API_URL;
  const session = JSON.parse(localStorage.getItem("supabaseSession"));
  const token = session?.access_token;

  const [feedback, setFeedback] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [selectedEvent]);

  const fetchEvents = async () => {
    const res = await axios.get(`${API}/api/events`);
    setEvents(res.data || []);
  };

  const fetchFeedback = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/admin/feedback?eventId=${selectedEvent}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedback(res.data || []);

    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {

    if (!feedback.length) {
      return {
        overall: 0,
        content: 0,
        speaker: 0,
        total: 0
      };
    }

    const total = feedback.length;

    const overall =
      feedback.reduce((a,b)=>a + (b.overall_rating || 0),0)/total;

    const content =
      feedback.reduce((a,b)=>a + (b.content_rating || 0),0)/total;

    const speaker =
      feedback.reduce((a,b)=>a + (b.speaker_rating || 0),0)/total;

    return {
      overall: overall.toFixed(1),
      content: content.toFixed(1),
      speaker: speaker.toFixed(1),
      total
    };

  }, [feedback]);

  const chartData = [1,2,3,4,5].map(num => ({
    rating: `${num}★`,
    count: feedback.filter(f => f.overall_rating === num).length
  }));

  return (
    <div className="space-y-8 p-4 md:p-8">

      <div>
        <h1 className="text-3xl font-bold">
          Feedback Review
        </h1>
        <p className="text-gray-500 mt-1">
          Ratings and comments from attendees
        </p>
      </div>

      <select
        value={selectedEvent}
        onChange={(e)=>setSelectedEvent(e.target.value)}
        className="border p-3 rounded-xl w-full md:w-64"
      >
        <option value="all">All Events</option>
        {events.map(ev=>(
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Overall Rating" value={stats.overall}/>
            <StatCard label="Content Rating" value={stats.content}/>
            <StatCard label="Speaker Rating" value={stats.speaker}/>
            <StatCard label="Total Responses" value={stats.total}/>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">
              Rating Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Bar dataKey="count" radius={[8,8,0,0]}>
                  {chartData.map((entry,index)=>(
                    <Cell
                      key={index}
                      fill="url(#gradient)"
                    />
                  ))}
                </Bar>

                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🔥 ENHANCED FEEDBACK CARDS */}
          {feedback.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold mb-6">
                Attendee Feedback
              </h2>

              <div className="space-y-6">
                {feedback.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition"
                  >

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {item.events?.title || "Event"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          By {item.profiles?.name || "User"}
                        </p>
                      </div>

                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Ratings */}
                    <div className="flex gap-6 text-sm text-gray-600 mb-3">
                      <span>⭐ Overall: {item.overall_rating}</span>
                      <span>📘 Content: {item.content_rating}</span>
                      <span>🎤 Speaker: {item.speaker_rating}</span>
                    </div>

                    {/* Comment */}
                    {item.comment && (
                      <p className="text-gray-700 leading-relaxed">
                        "{item.comment}"
                      </p>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}

export default AdminFeedback;