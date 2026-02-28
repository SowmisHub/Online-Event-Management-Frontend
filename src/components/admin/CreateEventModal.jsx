import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CreateEventModal({ open, setOpen, refresh, editData }) {

  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "Virtual",
    start_date: "",
    end_date: "",
    price: "",
    image_url: "",
    speaker_id: ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
        category: editData.category || "",
        location: editData.location || "Virtual",
        start_date: editData.date || "",
        end_date: editData.end_date || "",
        price: editData.price || "",
        image_url: editData.image_url || "",
        speaker_id: editData.speaker_id || ""
      });
    } else {
      setForm({
        title: "",
        description: "",
        category: "",
        location: "Virtual",
        start_date: "",
        end_date: "",
        price: "",
        image_url: "",
        speaker_id: ""
      });
    }
    setErrors({});
  }, [editData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.start_date) newErrors.start_date = "Start date required";
    if (!form.price) newErrors.price = "Price is required";
    return newErrors;
  };

  const handleSubmit = async () => {

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    const session = JSON.parse(localStorage.getItem("supabaseSession"));
    const token = session?.access_token;

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      date: form.start_date,
      end_date: form.end_date,
      price: form.price,
      image_url: form.image_url,
      speaker_id: form.speaker_id || null
    };

    try {

      let response;

      if (editData) {
        response = await axios.put(
          `${API}/api/admin/events/${editData.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${API}/api/admin/events`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      refresh({ ...payload, id: editData?.id });
      setOpen(false);

    } catch (err) {
      setErrors({ general: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          <div>
            <Input name="title" placeholder="Title" value={form.title} onChange={handleChange}/>
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="resize-none"/>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input name="category" placeholder="Category" value={form.category} onChange={handleChange}/>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <Input name="location" value={form.location} onChange={handleChange}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input type="date" name="start_date" value={form.start_date} onChange={handleChange}/>
              {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
            </div>
            <Input type="date" name="end_date" value={form.end_date} onChange={handleChange}/>
          </div>

          <div>
            <Input name="price" placeholder="Price" value={form.price} onChange={handleChange}/>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <Input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange}/>

          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin"/>
            ) : (
              editData ? "Update Event" : "Create Event"
            )}
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}

export default CreateEventModal;