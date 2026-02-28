import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import SpeakerOverview from "../components/speaker/SpeakerOverview";
import SpeakerSchedule from "@/components/speaker/SpeakerSchedule";
import Announcements from "../components/dashboard/Announcements";
import AdminPolls from "@/components/admin/AdminPolls";
import EventChat from "@/components/dashboard/EventChat";
import AdminSpeakerQnA from "@/components/admin/AdminSpeakerQnA";

function SpeakerDashboard() {

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [active, setActive] = useState("Overview");

  const [data, setData] = useState({
    sessions: [],
    announcements: [],
    profile: {}
  });

  const [events, setEvents] = useState([]); // ✅ ADD THIS

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchEvents(); // ✅ FETCH EVENTS
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/dashboard/speaker`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(res.data);

    } catch (err) {
      console.log("Speaker dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH ALL EVENTS FOR CHAT FILTER
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/api/events`);
      setEvents(res.data || []);
    } catch (err) {
      console.log("Events fetch error", err);
    }
  };

  const renderContent = () => {
    switch (active) {
      case "Overview":
        return (
          <SpeakerOverview
            speakerName={data.profile?.name}
            data={data}
            loading={loading}
          />
        );

      case "Schedule":
        return (
          <SpeakerSchedule
            data={data}
            refresh={fetchData}
          />
        );

      case "Announcements":
        return (
          <Announcements
            announcements={data.announcements}
          />
        );

      case "Polls":
        return (
          <AdminPolls
            isAdmin={false}
            apiRoute="api/speaker/polls"
          />
        );

      case "Chat":
        return <EventChat events={events} role="speaker" />;

      case "Q&A":
        return <AdminSpeakerQnA />;
      

      default:
        return <div className="text-gray-500">Coming Soon...</div>;
    }
  };

  return (
    <DashboardLayout
      role="speaker"
      active={active}
      setActive={setActive}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default SpeakerDashboard;