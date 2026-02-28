import { useState } from "react";
import axios from "@/lib/axios";

function Polls({ polls = [], refresh }) {

  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const handleVote = async (pollId, optionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(pollId);

      await axios.post(
        `${API}/api/polls/vote`,
        { pollId, optionId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelected({ ...selected, [pollId]: optionId });

      if (refresh) {
        await refresh(); // refresh dashboard data
      }

    } catch (err) {
      console.log("Vote error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold mt-12">
          Live Polls
        </h1>
        <p className="text-gray-500 mt-1">
          Vote and see results in real-time
        </p>
      </div>

      {/* POLL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {polls.map(poll => (

          <div
            key={poll.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >

            {/* Top Row */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-400">
                {poll.event_title}
              </p>

              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Live
              </span>
            </div>

            {/* Question */}
            <h3 className="text-lg font-semibold mb-4">
              {poll.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">

              {poll.options.map(option => {

                const isSelected =
                  selected[poll.id] === option.id;

                const percentage =
                  poll.totalVotes > 0
                    ? Math.round(
                        (option.votes / poll.totalVotes) * 100
                      )
                    : 0;

                return (
                  <div
                    key={option.id}
                    onClick={() =>
                      !loading && handleVote(poll.id, option.id)
                    }
                    className={`relative border rounded-xl px-4 py-3 cursor-pointer transition
                      ${isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-400"
                      }
                      ${loading === poll.id ? "opacity-60 pointer-events-none" : ""}
                    `}
                  >

                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {option.option_text}
                      </span>

                      {poll.totalVotes > 0 && (
                        <span className="text-sm text-gray-500">
                          {percentage}%
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {poll.totalVotes > 0 && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-purple-500 rounded-b-xl transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-400 mt-4">
              {poll.totalVotes} vote
              {poll.totalVotes !== 1 && "s"}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Polls;