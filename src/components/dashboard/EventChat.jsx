import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

function EventChat({ events = [], role }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const channelRef = useRef(null);

  /* ================= GET LOGGED USER ================= */

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  /* ================= AUTO SELECT FIRST EVENT ================= */

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0].id);
    }
  }, [events]);

  /* ================= FETCH MESSAGES ================= */

  const fetchMessages = async () => {
    if (!selectedEvent) return;

    setLoading(true);

    const { data } = await supabase
      .from("chats")
      .select(`
        id,
        message,
        created_at,
        user_id,
        profiles ( name )
      `)
      .eq("event_id", selectedEvent)
      .order("created_at", { ascending: true });

    setMessages(data || []);
    setLoading(false);
  };

  /* ================= REALTIME ================= */

  useEffect(() => {
    if (!selectedEvent) return;

    fetchMessages();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`chat-${selectedEvent}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `event_id=eq.${selectedEvent}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("chats")
            .select(`id,message,created_at,user_id,profiles(name)`)
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chats",
          filter: `event_id=eq.${selectedEvent}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [selectedEvent]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedEvent || !userId) return;

    await supabase.from("chats").insert({
      event_id: selectedEvent,
      user_id: userId,
      message: newMessage,
    });

    setNewMessage("");
  };

  /* ================= DELETE MESSAGE ================= */

  const deleteMessage = async (id) => {
    if (role !== "admin") return;
    await supabase.from("chats").delete().eq("id", id);
  };

  /* ================= DATE FORMATTER ================= */

  const formatDateLabel = (dateString) => {
    const msgDate = new Date(dateString);
    const today = new Date();

    const isToday =
      msgDate.toDateString() === today.toDateString();

    if (isToday) return "Today";

    return msgDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md flex flex-col h-[82vh] md:h-[85vh]">

      {/* HEADER */}
      <div className="p-4 md:p-6 border-b">
        <h2 className="text-lg md:text-xl font-bold">Event Chat</h2>
        <p className="text-xs md:text-sm text-gray-500">
          Chat with fellow attendees in real-time
        </p>

        <select
          value={selectedEvent || ""}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="mt-4 w-full md:w-80 border rounded-lg px-4 py-2 text-sm"
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-10 space-y-4 bg-gray-50">

        {loading && (
          <div className="text-center text-gray-400 text-sm">
            Loading messages...
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm">
            No messages yet. Start chatting 🚀
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.user_id === userId;

          const showDate =
            index === 0 ||
            new Date(msg.created_at).toDateString() !==
              new Date(messages[index - 1].created_at).toDateString();

          return (
            <div key={msg.id}>
              
              {/* DATE SEPARATOR */}
              {showDate && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full shadow-sm">
                    {formatDateLabel(msg.created_at)}
                  </div>
                </div>
              )}

              <div
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="relative group max-w-[85%] md:max-w-xs">

                  <div
                    className={`text-xs mb-1 ${
                      isMe ? "text-right text-gray-500" : "text-left text-gray-500"
                    }`}
                  >
                    {msg.profiles?.name || "User"}
                  </div>

                  <div
                    className={`px-4 py-3 rounded-2xl text-sm ${
                      isMe
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>

                  {role === "admin" && (
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  )}

                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      {selectedEvent && (
        <div className="p-6 border-t flex gap-3 bg-white">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl text-sm"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default EventChat;