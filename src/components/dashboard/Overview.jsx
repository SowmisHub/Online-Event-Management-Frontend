import { CalendarDays, Star, Megaphone, BarChart3 } from "lucide-react";

function Overview({ data, setActive }) {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold mt-12">
          Welcome back, {data.profile?.name || "User"}
        </h1>
        <p className="text-gray-500 mt-3">
          Attendee Dashboard
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-purple-500 text-white p-4 rounded-xl">
            <CalendarDays size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {data.events.length}
            </p>
            <p className="text-gray-500">
              Available Events
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-xl">
            <Star size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {data.myEvents.length}
            </p>
            <p className="text-gray-500">
              My Registrations
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-green-500 text-white p-4 rounded-xl">
            <Megaphone size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {data.announcements.length}
            </p>
            <p className="text-gray-500">
              Announcements
            </p>
          </div>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-sm">

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold">
              <BarChart3 size={18} className="text-purple-600" />
              Upcoming Events
            </div>

            <button
              onClick={() => setActive("Browse Events")}
              className="text-sm text-purple-600 hover:underline"
            >
              View all
            </button>
          </div>

          {data.events.slice(0, 4).map(event => (
            <div
              key={event.id}
              className="flex justify-between items-center px-6 py-4 border-b border-gray-100 last:border-none"
            >
              <div className="flex items-center gap-4">

                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl">
                  <CalendarDays size={16} />
                </div>

                <div>
                  <p className="font-medium">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toDateString()}
                  </p>
                </div>
              </div>

              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {event.category}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl shadow-sm">

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold">
              <Megaphone size={18} className="text-purple-600" />
              Recent Announcements
            </div>

            <button
              onClick={() => setActive("Announcements")}
              className="text-sm text-purple-600 hover:underline"
            >
              View all
            </button>
          </div>

          {data.announcements.slice(0, 4).map(a => {

            const type = a.type?.toLowerCase();
            let badgeStyle = "";
            let badgeText = "";

            if (type === "important") {
              badgeStyle = "bg-orange-100 text-orange-600";
              badgeText = "Important";
            } else if (type === "urgent") {
              badgeStyle = "bg-red-100 text-red-600";
              badgeText = "Urgent";
            } else {
              badgeStyle = "bg-blue-100 text-blue-600";
              badgeText = "Normal";
            }

            return (
              <div
                key={a.id}
                className="px-6 py-4 border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">
                    {a.title}
                  </p>

                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${badgeStyle}`}>
                    {badgeText}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {a.content?.slice(0, 90)}...
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(a.created_at).toLocaleDateString()} •{" "}
                  {new Date(a.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Overview;