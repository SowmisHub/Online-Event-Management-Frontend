import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminOverview from "../components/admin/AdminOverview";
import AdminEvents from "../components/admin/AdminEvents";
import AdminUsers from "../components/admin/AdminUsers";
import AdminSpeakers from "../components/admin/AdminSpeakers"; 
import { useNavigate } from "react-router-dom";
import AdminSessions from "../components/admin/AdminSessions";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminPolls from "../components/admin/AdminPolls";
import AdminFeedback from "../components/admin/AdminFeedback";
import EventChat from "@/components/dashboard/EventChat";
import AdminSpeakerQnA from "@/components/admin/AdminSpeakerQnA";
import AdminAnalytics from "@/components/admin/AdminAnalytics";


function AdminDashboard() {
  const [active, setActive] = useState("Overview");
  const [data, setData] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalAnnouncements: 0,
    totalPolls: 0,
    events: [],
    announcements: []
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAdminDashboard(true);
  }, []);

  // ================= ADMIN DASHBOARD ROUTE (/api/dashboard/admin) =================

  const fetchAdminDashboard = async (showLoader = false) => {
    try {

      if (showLoader) setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${API}/api/dashboard/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(res.data);

    } catch (err) {

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } else {
        console.log("Admin dashboard error", err);
      }

    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const renderContent = () => {
    switch (active) {
      case "Overview":
        return (
          <AdminOverview
            data={data}
            setActive={setActive}
          />
        );

      case "Events":
        return (
          <AdminEvents
            refreshDashboard={() => fetchAdminDashboard(false)}
          />
        );

      case "Users":
        return <AdminUsers />;

      case "Speakers":   
        return <AdminSpeakers />;

      case "Sessions":
        return <AdminSessions />;
      case "Announcements":
          return <AdminAnnouncements />;
      case "Polls":
          return <AdminPolls />;
      case "Feedback":
          return <AdminFeedback />;
      case "Chat":
        return <EventChat events={data.events} role="admin" />;
      case "Q&A":
        return <AdminSpeakerQnA />;
      case "Analytics":
        return <AdminAnalytics />;
      

      default:
        return <div className="text-gray-500">Coming Soon...</div>;
    }
  };

  return (
    <DashboardLayout
      role="admin"
      active={active}
      setActive={setActive}
    >
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        renderContent()
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;