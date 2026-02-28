import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${API}/api/admin/analytics`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(res.data);
  };

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ["#8B5CF6", "#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#6366F1"];

  return (
    <div className="space-y-8 pb-20">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mt-12">
          Analytics Overview
        </h1>
        <p className="text-gray-500 text-sm mt-3">
          Platform performance & growth insights
        </p>
      </div>

      {/* SMALL STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Events" value={data.totalEvents} />
        <StatCard title="Registrations" value={data.totalRegistrations} />
        <StatCard title="Feedback" value={data.totalFeedback} />
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* DONUT CATEGORY */}
        <Card title="Event Categories">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.categoryData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* DONUT RATINGS */}
        <Card title="Feedback Ratings">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.ratingData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.ratingData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* TOP EVENTS BAR */}
        <Card title="Top Events">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topEvents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* MONTHLY TREND LINE */}
        <Card title="Monthly Growth">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <p className="text-xs text-gray-500 uppercase">{title}</p>
      <h2 className="text-xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default AdminAnalytics;