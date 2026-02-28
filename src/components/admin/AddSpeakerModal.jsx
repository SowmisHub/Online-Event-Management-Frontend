import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Search } from "lucide-react";

function AddSpeakerModal({ close, refresh }) {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    const res = await axios.get(
      `${API}/api/admin/users-for-speaker?search=${search}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleAdd = async (id) => {
    try {
      setLoadingId(id);

      await axios.put(
        `${API}/api/admin/make-speaker/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refresh();
      close();

    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-md rounded-2xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Speaker</h2>
          <button onClick={close}>✕</button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={16}/>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-3">

          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">

              <span className="font-medium">{user.name}</span>

              <button
                onClick={()=>handleAdd(user.id)}
                disabled={loadingId === user.id}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2"
              >
                {loadingId === user.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "+ Add"
                )}
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default AddSpeakerModal;