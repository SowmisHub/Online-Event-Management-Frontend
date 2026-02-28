import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Search } from "lucide-react";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-1 mt-6">User Management</h1>
      <p className="text-gray-500 mb-6">
        Manage users and their roles
      </p>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

  {loading ? (
    <div className="flex justify-center items-center py-16">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : (
        <div className="overflow-x-auto">

        <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Joined</th>
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

            {users.length === 0 && (
                <tr>
                <td colSpan="4" className="text-center py-12 text-gray-400">
                    No users found
                </td>
                </tr>
            )}

            {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">

                {/* USER */}
                <td className="px-6 py-4 font-medium text-gray-800">
                    {user.name}
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-gray-500">
                    {user.email}
                </td>

                {/* ROLE */}
                <td className="px-6 py-4">

                    <span className={`
                    px-3 py-1 text-xs rounded-full font-medium
                    ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
                        user.role === "speaker" ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"}
                    `}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>

                    {user.role === "speaker" && (
                    <span className={`ml-2 text-xs font-medium ${
                        user.approved ? "text-green-600" : "text-red-500"
                    }`}>
                        ({user.approved ? "Approved" : "Pending"})
                    </span>
                    )}

                </td>

                {/* JOINED */}
                <td className="px-6 py-4 text-gray-500">
                    {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                        })
                    : "—"}
                </td>

                </tr>
            ))}

            </tbody>

        </table>

        </div>
    )}
    </div>
            )}

        </div>

    </div>
  );
}

export default AdminUsers;