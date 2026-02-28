import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  X,
  Trash2,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";

function AdminSpeakerQnA() {
  const [qaList, setQaList] = useState([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQA();
  }, []);

  const fetchQA = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/qa`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQaList(res.data);
    } catch (err) {
      toast.error("Failed to load Q&A");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) return;

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/qa`,
        { question, answer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Q&A added successfully");

      setQuestion("");
      setAnswer("");
      setOpenModal(false);
      fetchQA();

    } catch (err) {
      toast.error("Failed to add Q&A");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/qa/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQaList((prev) => prev.filter((item) => item.id !== id));

      toast.success("Deleted successfully");

    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = qaList.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mt-12">Q & A</h2>
          <p className="text-gray-700 text-sm mt-3">
            Manage frequently asked questions
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm mt-14"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
        />
      </div>

      {/* Accordion */}
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden w-full"
              >
                <div className="flex items-center justify-between p-5">

                  <button
                    onClick={() =>
                      setOpenId(isOpen ? null : item.id)
                    }
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-medium text-gray-800 break-words pr-4">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    className="ml-3 text-red-500 hover:text-red-700 transition disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>

                </div>

                <div
                  className={`transition-all duration-300 ${
                    isOpen ? "max-h-96 p-5 pt-0" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p className="text-gray-600 text-sm leading-relaxed break-words">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 relative">

            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold">Add Q & A</h3>

            <textarea
              placeholder="Enter question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />

            <textarea
              placeholder="Enter answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />

            <button
              onClick={handleAdd}
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              {saving ? "Saving..." : "Save"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSpeakerQnA;