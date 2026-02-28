import { useState, useMemo } from "react";
import { AlertTriangle, Info, Zap } from "lucide-react";

function Announcements({ announcements = [] }) {

  const [filter, setFilter] = useState("all");

  const filteredAnnouncements = useMemo(() => {
    if (filter === "all") return announcements;
    return announcements.filter(
      a => a.type?.toLowerCase() === filter
    );
  }, [announcements, filter]);

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
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold mt-12">Announcements</h1>
        <p className="text-gray-500 mt-4 mb-12">
          Stay updated with the latest event news
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        {["all", "important", "urgent", "normal"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              filter === type
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-6">

        {filteredAnnouncements.map((item) => {

          const styles = getTypeStyles(item.type);
          const Icon = styles.Icon;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition ${styles.border}`}
            >

              <div className="flex items-start gap-4">

                <div className={`p-3 rounded-xl ${styles.iconBg}`}>
                  <Icon size={20} />
                </div>

                <div className="flex-1">

                  <div className="flex items-center gap-3">

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
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Announcements;