import {
  CalendarDays,
  Users,
  CheckCircle2,
  Megaphone,
  Calendar
} from "lucide-react";

function SpeakerOverview({ speakerName, data, loading }) {

  const now = new Date();

  const assigned = data.sessions?.length || 0;

  const upcomingSessions =
    data.sessions?.filter(
      s => new Date(s.start_time) > now
    ) || [];

  const completed =
    data.sessions?.filter(
      s => new Date(s.end_time) < now
    ).length || 0;

  const announcementsList =
    data.announcements || [];

  return (
    <div className="space-y-8">

      {/* HEADER — EXACT ADMIN STYLE */}
      <div>
        <h1 className="text-4xl font-bold mt-12">
          Welcome back, {speakerName}
        </h1>
        <p className="text-gray-600 mt-3">
          Speaker Dashboard
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* ===== STATS — EXACT ADMIN CARD STYLE ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatCard
              icon={<CalendarDays size={20} />}
              color="purple"
              value={assigned}
              label="Assigned Sessions"
            />

            <StatCard
              icon={<Users size={20} />}
              color="blue"
              value={upcomingSessions.length}
              label="Upcoming Sessions"
            />

            <StatCard
              icon={<CheckCircle2 size={20} />}
              color="green"
              value={completed}
              label="Completed Sessions"
            />

            <StatCard
              icon={<Megaphone size={20} />}
              color="orange"
              value={announcementsList.length}
              label="Announcements"
            />

          </div>


          {/* ===== GRID SECTION SAME AS ADMIN ===== */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* ===== UPCOMING SESSIONS — EXACT ADMIN LOOK ===== */}
            <div className="bg-white rounded-2xl shadow">

              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-2 font-semibold">
                  <Calendar size={18} className="text-purple-600" />
                  Upcoming Sessions
                </div>
              </div>

              <div className="divide-y">

                {upcomingSessions.length === 0 ? (
                  <div className="p-6 text-gray-500">
                    No upcoming sessions
                  </div>
                ) : (
                  upcomingSessions.map(session => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                          <CalendarDays size={18} />
                        </div>

                        <div>
                          <p className="font-semibold">
                            {session.title}
                          </p>

                          {/* ✅ UPDATED DATE + TIME FORMAT */}
                          <p className="text-sm text-gray-500">
                            {new Date(session.start_time).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "2-digit",
                              year: "numeric"
                            })}
                            {" • "}
                            {new Date(session.start_time).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>

                        </div>
                      </div>

                      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                        {session.type || "Session"}
                      </span>
                    </div>
                  ))
                )}

              </div>
            </div>


            {/* ===== RECENT ANNOUNCEMENTS — EXACT ADMIN STYLE ===== */}
            <div className="bg-white rounded-2xl shadow">

              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-2 font-semibold">
                  <Megaphone size={18} className="text-purple-600" />
                  Recent Announcements
                </div>
              </div>

              <div className="divide-y">

                {announcementsList.length === 0 ? (
                  <div className="p-6 text-gray-500">
                    No announcements
                  </div>
                ) : (
                  announcementsList.slice(0, 4).map(a => (
                    <div
                      key={a.id}
                      className="p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">
                          {a.title}
                        </p>

                        <span
                          className={`text-xs px-3 py-1 rounded-full
                            ${a.type === "Urgent"
                              ? "bg-red-100 text-red-600"
                              : a.type === "Important"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600"
                            }
                          `}
                        >
                          {a.type || "Normal"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {a.content?.slice(0, 90)}...
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}

              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}


/* ===== STAT CARD EXACT ADMIN STYLE ===== */
function StatCard({ icon, color, value, label }) {

  const colors = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>

      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

export default SpeakerOverview;