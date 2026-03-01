import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Bookmark,
  Megaphone,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Star,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

function DashboardLayout({ children, role, active, setActive }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuConfig = {
    attendee: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Browse Events", icon: Calendar },
      { name: "My Events", icon: Bookmark },
      { name: "My Sessions", icon: Calendar },
      { name: "Announcements", icon: Megaphone },
      { name: "Polls", icon: BarChart3 },
      { name: "Chat", icon: MessageSquare },
      { name: "Q&A", icon: HelpCircle },
      { name: "Feedback", icon: Star },
      
      
    ],
    admin: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Events", icon: Calendar },
      { name: "Users", icon: Bookmark },
      { name: "Speakers", icon: Star },
      { name: "Sessions", icon: Calendar },
      { name: "Announcements", icon: Megaphone },
      { name: "Polls", icon: BarChart3 },
      { name: "Chat", icon: MessageSquare },
      { name: "Q&A", icon: HelpCircle },
      { name: "Analytics", icon: BarChart3 },
      { name: "Feedback", icon: Star },
      
      
      
    ],
    speaker: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Schedule", icon: Calendar },
      { name: "Announcements", icon: Megaphone },
      { name: "Polls", icon: BarChart3 },
      { name: "Chat", icon: MessageSquare },
      { name: "Q&A", icon: HelpCircle },
      
      
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-x-hidden">

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:static z-50 top-0 left-0 min-h-screen bg-white shadow-xl
          transition-all duration-300 flex flex-col
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <h1 className="text-xl font-bold text-purple-600">
              EventHub
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2 px-2">
          {menuConfig[role]?.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition ${
                  active === item.name
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {!collapsed && item.name}
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-8 pt-4">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl 
               bg-red-50 text-red-600 transition-all duration-300 
               hover:bg-red-500 hover:text-white hover:shadow-lg"
          >
            <LogOut size={18} className="transition-transform duration-300 group-hover:rotate-12"/>
            {!collapsed && (
              <span className="font-medium">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full overflow-x-hidden">

        {/* ✅ FIXED MOBILE HEADER */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <h2 className="font-semibold">Dashboard</h2>
          <div />
        </div>

        {/* ✅ ADD TOP PADDING ONLY FOR MOBILE */}
        <div className="pt-16 lg:pt-0 px-4 py-6 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;