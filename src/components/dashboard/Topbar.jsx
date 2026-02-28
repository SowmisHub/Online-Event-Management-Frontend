import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function Topbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-4 mb-6 rounded-xl">
      <h1 className="text-xl font-semibold">
        Hello, {user?.email}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

export default Topbar;