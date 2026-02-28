import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

function UserQnA() {
  const [qaList, setQaList] = useState([]);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.log("Q&A fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = qaList.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" mx-auto space-y-8 pb-16">

      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-4xl font-bold mt-12">Q & A</h2>
        <p className="text-gray-500 text-sm mt-3">
          Frequently asked questions
        </p>
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
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400">No questions found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md transition overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenId(isOpen ? null : item.id)
                  }
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-medium text-gray-800 break-words">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
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
    </div>
  );
}

export default UserQnA;