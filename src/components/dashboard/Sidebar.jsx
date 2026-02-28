import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function Sidebar({ active, setActive, user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="w-64 min-w-[16rem] bg-white shadow-lg flex flex-col justify-between min-h-screen">

      <div>
        <div className="p-6 border-b font-bold text-xl text-purple-600">
          EventHub
        </div>

        <div className="flex flex-col p-4 space-y-2">
          {[
            "Overview",
            "Browse Events",
            "My Events",
            "My Sessions",
            "Announcements",
            "Polls"
          ].map(item => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`text-left px-4 py-2 rounded-lg transition ${
                active === item
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="mb-2 text-sm text-gray-600 break-words">
          {user?.email}
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;