import { useEffect, useState, useMemo } from "react";
import axios from "@/lib/axios";
import { AlertTriangle, Info, Zap, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

function AdminAnnouncements() {

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "normal"
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/admin/announcements`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnnouncements(res.data || []);

    } catch (err) {
      console.log("Announcement fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    if (filter === "all") return announcements;
    return announcements.filter(
      a => a.type?.toLowerCase() === filter
    );
  }, [announcements, filter]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!form.title.trim() || !form.content.trim()) {
      setErrorMsg("⚠ Please fill all required fields.");
      return;
    }

    try {

      setSubmitting(true);

      if (editData) {
        await axios.put(
          `${API}/api/admin/announcements/${editData.id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await Swal.fire({
          icon: "success",
          title: "Announcement Updated",
          timer: 1200,
          showConfirmButton: false
        });

      } else {
        await axios.post(
          `${API}/api/admin/announcements`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await Swal.fire({
          icon: "success",
          title: "Announcement Created",
          timer: 1200,
          showConfirmButton: false
        });
      }

      setShowForm(false);
      setEditData(null);
      setForm({ title: "", content: "", type: "normal" });
      setErrorMsg("");
      fetchData();

    } catch {
      setErrorMsg("❌ Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    const confirm = await Swal.fire({
      title: "Delete this announcement?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete"
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(
      `${API}/api/admin/announcements/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await Swal.fire({
      icon: "success",
      title: "Deleted Successfully",
      timer: 1000,
      showConfirmButton: false
    });

    fetchData();
  };

  /* ================= STYLE ================= */

  const getTypeStyles = (type) => {
    switch (type?.toLowerCase()) {

      case "important":
        return {
          badge: "bg-orange-100 text-orange-600",
          iconBg: "bg-orange-100 text-orange-600",
          border: "border-orange-200",
          Icon: Zap
        };

      case "urgent":
        return {
          badge: "bg-red-100 text-red-600",
          iconBg: "bg-red-100 text-red-600",
          border: "border-red-200",
          Icon: AlertTriangle
        };

      default:
        return {
          badge: "bg-blue-100 text-blue-600",
          iconBg: "bg-blue-100 text-blue-600",
          border: "border-gray-200",
          Icon: Info
        };
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8">

      {/* ✅ HEADING ADDED (ONLY CHANGE) */}
      <div>
        <h1 className="text-3xl font-bold">
          Announcements
        </h1>
        <p className="text-gray-500 mt-1">
          Manage all the announcements
        </p>
      </div>

      {/* FILTER + BUTTON */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div className="flex flex-wrap gap-3">
          {["all", "important", "urgent", "normal"].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full capitalize text-sm font-medium transition ${
                filter === type
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setForm({ title: "", content: "", type: "normal" });
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          + Announcement
        </button>
      </div>

      {/* DATA LOADER */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((item) => {

            const styles = getTypeStyles(item.type);
            const Icon = styles.Icon;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition ${styles.border}`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                  <div className="flex items-start gap-4 flex-1">

                    <div className={`p-3 rounded-xl ${styles.iconBg}`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {item.title}
                        </h3>

                        <span className={`text-xs px-3 py-1 rounded-full font-medium uppercase ${styles.badge}`}>
                          {item.type || "normal"}
                        </span>
                      </div>

                      <p className="text-gray-600 mt-2">
                        {item.content}
                      </p>

                      <div className="text-sm text-gray-400 mt-3">
                        {new Date(item.created_at).toLocaleDateString()} •{" "}
                        {new Date(item.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 self-start">
                    <button
                      onClick={() => {
                        setEditData(item);
                        setForm({
                          title: item.title,
                          content: item.content,
                          type: item.type
                        });
                        setShowForm(true);
                      }}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORM MODAL (UNCHANGED) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4 shadow-xl">

            <h2 className="text-xl font-bold">
              {editData ? "Edit Announcement" : "Create Announcement"}
            </h2>

            {errorMsg && (
              <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}

            <input
              placeholder="Title *"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full border p-2 rounded-lg"
            />

            <textarea
              placeholder="Content *"
              value={form.content}
              onChange={e => setForm({...form, content: e.target.value})}
              className="w-full border p-2 rounded-lg"
              rows={4}
            />

            <select
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
              className="w-full border p-2 rounded-lg"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => {
                  setShowForm(false);
                  setErrorMsg("");
                }}
                className="px-4 py-2 border rounded-lg"
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {editData
                  ? (submitting ? "Updating..." : "Update")
                  : (submitting ? "Creating..." : "Create")}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminAnnouncements;