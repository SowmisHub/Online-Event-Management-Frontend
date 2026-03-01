import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import Overview from "../components/dashboard/Overview";
import BrowseEvents from "../components/dashboard/BrowserEvents";
import MyEvents from "../components/dashboard/MyEvents";
import MySessions from "../components/dashboard/MySessions";
import Announcements from "../components/dashboard/Announcements";
import Polls from "../components/dashboard/Polls";
import UserFeedback from "../components/dashboard/UserFeedback";
import EventChat from "@/components/dashboard/EventChat";
import UserQnA from "@/components/dashboard/UserQnA";


function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const [active, setActive] = useState(
    tabFromUrl === "browse" ? "Browse Events" : "Overview"
  );

  const [data, setData] = useState({
    profile: {}, // ✅ IMPORTANT
    events: [],
    myEvents: [],
    announcements: [],
    sessions: [],
    polls: []
  });

  const [pageLoading, setPageLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setPageLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/api/dashboard/user`,
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
        console.log("Dashboard error", err);
      }
    } finally {
      setPageLoading(false);
    }
  };

  const refreshDashboardSilent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API}/api/dashboard/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(res.data);

    } catch (err) {
      console.log("Silent refresh error", err);
    }
  };

  // ✅ THIS MAKES NAME UPDATE INSTANTLY
  const handleProfileUpdate = (newName) => {
    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: newName
      }
    }));
  };

  const renderContent = () => {
    switch (active) {
      case "Overview":
        return <Overview data={data} setActive={setActive} />;

      case "Browse Events":
        return (
          <BrowseEvents
            events={data.events}
            refresh={refreshDashboardSilent}
          />
        );

      case "My Events":
        return (
          <MyEvents
            myEvents={data.myEvents}
            refresh={fetchDashboard}
          />
        );

      case "My Sessions":
        return (
          <MySessions
            sessions={data.sessions}
            myEvents={data.myEvents}
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
          <Polls
            polls={data.polls}
            refresh={refreshDashboardSilent}
          />
        );

      case "Feedback":
        return (
          <UserFeedback
            myEvents={data.myEvents}
            refresh={refreshDashboardSilent}
          />
        );

      case "Chat":
        return <EventChat events={data.myEvents} role="attendee" />;

      case "Q&A":
        return <UserQnA />;

      

      default:
        return <div className="text-gray-500">Coming Soon...</div>;
    }
  };

  return (
    <DashboardLayout
      role="attendee"
      active={active}
      setActive={setActive}
      userName={data.profile?.name || "User"} // ✅ FIXED
    >
      <div className="relative">
        {pageLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </DashboardLayout>
  );
}

export default UserDashboard;