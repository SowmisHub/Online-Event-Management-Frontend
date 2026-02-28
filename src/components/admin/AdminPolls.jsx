import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus } from "lucide-react";

function AdminPolls({ isAdmin = true, apiRoute }) {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const route =
    apiRoute ||
    (isAdmin ? "api/admin/polls" : "api/speaker/polls");

  const [polls, setPolls] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editPoll, setEditPoll] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const [form, setForm] = useState({
    event_id: "",
    question: "",
    options: ["", ""]
  });

  /* ================= FETCH DATA ================= */

  const fetchPolls = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/${route}?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const eventRes = await axios.get(`${API}/api/events`);

      setPolls(res.data || []);
      setEvents(eventRes.data || []);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [search]);

  /* ================= CREATE / UPDATE ================= */

  const handleSubmit = async () => {
    const validOptions = form.options.filter(o => o.trim() !== "");

    if (!form.event_id || !form.question || validOptions.length < 2) {
      toast.error("Please fill required fields (minimum 2 options)");
      return;
    }

    try {
      setBtnLoading(true);

      if (editPoll) {
        await axios.put(
          `${API}/api/admin/polls/${editPoll.id}`,
          { ...form, options: validOptions },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Poll updated successfully");
      } else {
        await axios.post(
          `${API}/api/admin/polls`,
          { ...form, options: validOptions },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Poll created successfully");
      }

      setModalOpen(false);
      setEditPoll(null);
      setForm({ event_id: "", question: "", options: ["", ""] });
      fetchPolls();

    } catch (err) {
      toast.error("Action failed");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this poll?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it"
    });

    if (!result.isConfirmed) return;

    await axios.delete(`${API}/api/admin/polls/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Poll deleted successfully");
    fetchPolls();
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mt-10 mb-3">
            Poll Management
          </h1>
          <p className="text-gray-500 mt-1 mb-4">
            {isAdmin
              ? "Manage, create and update event polls easily"
              : "View live poll results from events"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

          <input
            type="text"
            placeholder="Search polls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          {/* CREATE BUTTON ONLY FOR ADMIN */}
          {isAdmin && (
            <button
              onClick={() => {
                setEditPoll(null);
                setForm({ event_id: "", question: "", options: ["", ""] });
                setModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
            >
              <Plus size={18} />
              Create Poll
            </button>
          )}

        </div>
      </div>

      {/* LOADER */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {polls.length === 0 && (
            <p className="text-gray-500">No polls available.</p>
          )}

          {polls.map(poll => {

            const totalVotes = poll.poll_options.reduce(
              (acc, opt) => acc + (opt.poll_votes?.length || 0),
              0
            );

            return (
              <div
                key={poll.id}
                className="relative bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >

                {/* EDIT / DELETE ONLY FOR ADMIN */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-3">
                    <button
                      onClick={() => {
                        setEditPoll(poll);
                        setForm({
                          event_id: poll.event_id,
                          question: poll.question,
                          options: poll.poll_options.map(o => o.option_text)
                        });
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-400 mb-2">
                  {poll.events?.title}
                </p>

                <h3 className="text-lg font-semibold mb-4">
                  {poll.question}
                </h3>

                <div className="space-y-3">
                  {poll.poll_options.map(opt => {

                    const voteCount = opt.poll_votes?.length || 0;
                    const percentage =
                      totalVotes > 0
                        ? Math.round((voteCount / totalVotes) * 100)
                        : 0;

                    return (
                      <div
                        key={opt.id}
                        className="relative border rounded-xl px-4 py-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {opt.option_text}
                          </span>

                          {totalVotes > 0 && (
                            <span className="text-sm text-gray-500">
                              {percentage}%
                            </span>
                          )}
                        </div>

                        {totalVotes > 0 && (
                          <div
                            className="absolute bottom-0 left-0 h-1 bg-purple-500 rounded-b-xl transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-sm text-gray-400 mt-4">
                  {totalVotes} vote{totalVotes !== 1 && "s"}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL ONLY FOR ADMIN */}
      {isAdmin && modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-semibold">
              {editPoll ? "Edit Poll" : "Create Poll"}
            </h2>

            <select
              value={form.event_id}
              onChange={(e) =>
                setForm({ ...form, event_id: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-xl"
            >
              <option value="">Select Event *</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Question *"
              value={form.question}
              onChange={(e) =>
                setForm({ ...form, question: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-xl"
            />

            {form.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...form.options];
                  updated[index] = e.target.value;
                  setForm({ ...form, options: updated });
                }}
                className="w-full border px-4 py-2 rounded-xl"
              />
            ))}

            {form.options.length < 5 && (
              <button
                onClick={() =>
                  setForm({ ...form, options: [...form.options, ""] })
                }
                className="text-purple-600 text-sm"
              >
                + Add Option
              </button>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={btnLoading}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl flex items-center gap-2"
              >
                {btnLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : editPoll ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPolls;