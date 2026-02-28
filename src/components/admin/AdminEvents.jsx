import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateEventModal from "./CreateEventModal";

function AdminEvents({ refreshDashboard }) {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get(`${API}/api/events`);
    setEvents(res.data);
    setInitialLoading(false);
  };

  const deleteEvent = async (id) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API}/api/admin/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(prev => prev.filter(event => event.id !== id));
      refreshDashboard && refreshDashboard();

    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (event) => {
    setEditingId(event.id);
    setEditData(event);
    setOpen(true);

    setTimeout(() => {
      setEditingId(null);
    }, 300);
  };

  const filtered = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8 mt-10">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Event Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create, edit, and manage all events
          </p>
        </div>

        {/* SEARCH + BUTTON */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">

          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>

          <Button
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            onClick={()=>{
              setEditData(null);
              setOpen(true);
            }}
          >
            Create Event
          </Button>

        </div>

        {/* CARD LIST CONTAINER */}
        <div className="space-y-5">

          {initialLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 size={26} className="animate-spin text-purple-600"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No events found.
            </div>
          ) : (
            filtered.map(event=>(
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 p-5 sm:p-6"
              >

                {/* DESKTOP LAYOUT */}
                <div className="hidden md:grid grid-cols-5 items-center gap-4">

                  <div className="font-semibold text-gray-800 truncate">
                    {event.title}
                  </div>

                  <div className="text-gray-600">
                    {event.category}
                  </div>

                  <div className="text-gray-600">
                    {new Date(event.date).toDateString()}
                  </div>

                  <div className="text-gray-600">
                    {event.price}
                  </div>

                  <div className="flex justify-end gap-5">

                    <button onClick={()=>handleEditClick(event)}>
                      {editingId === event.id ? (
                        <Loader2 size={18} className="animate-spin text-blue-600"/>
                      ) : (
                        <Pencil size={18} className="text-blue-600 hover:scale-110 transition"/>
                      )}
                    </button>

                    <button onClick={()=>deleteEvent(event.id)}>
                      {deletingId === event.id ? (
                        <Loader2 size={18} className="animate-spin text-red-500"/>
                      ) : (
                        <Trash2 size={18} className="text-red-500 hover:scale-110 transition"/>
                      )}
                    </button>

                  </div>
                </div>

                {/* MOBILE CARD LAYOUT */}
                <div className="md:hidden space-y-3">

                  <div className="font-semibold text-lg text-gray-800">
                    {event.title}
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {event.category}
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(event.date).toDateString()}
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> {event.price}
                  </div>

                  <div className="flex gap-5 pt-2">

                    <button onClick={()=>handleEditClick(event)}>
                      {editingId === event.id ? (
                        <Loader2 size={18} className="animate-spin text-blue-600"/>
                      ) : (
                        <Pencil size={18} className="text-blue-600"/>
                      )}
                    </button>

                    <button onClick={()=>deleteEvent(event.id)}>
                      {deletingId === event.id ? (
                        <Loader2 size={18} className="animate-spin text-red-500"/>
                      ) : (
                        <Trash2 size={18} className="text-red-500"/>
                      )}
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

      <CreateEventModal
        open={open}
        setOpen={setOpen}
        refresh={(eventData) => {

          if (!eventData) return;

          if (editData) {
            setEvents(prev =>
              prev.map(ev =>
                ev.id === editData.id ? { ...ev, ...eventData } : ev
              )
            );
          } else {
            const newEvent = {
              ...eventData,
              id: crypto.randomUUID(),
              date: eventData.date
            };
            setEvents(prev => [newEvent, ...prev]);
          }

          refreshDashboard && refreshDashboard();
        }}
        editData={editData}
      />
    </>
  );
}

export default AdminEvents;