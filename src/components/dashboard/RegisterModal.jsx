import { useState } from "react";

function RegisterModal({ event, onClose, onSubmit, loading, onPay }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      setError("All fields are required");
      return;
    }

    if (form.phone.length < 10) {
      setError("Enter valid phone number");
      return;
    }

    if (event.price > 0) {
      if (onPay) {
        onPay(form);
      }
    } else {
      onSubmit(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-1">
          Register for Event
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Complete registration for {event.title}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 border">
          <p className="text-sm">
            <span className="font-semibold">Event:</span> {event.title}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(event.date).toDateString()}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Price:</span>{" "}
            {event.price === 0 ? "Free" : `$${event.price}`}
          </p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading === event.id}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading === event.id
            ? "Confirming..."
            : event.price > 0
            ? `Pay & Register ($${event.price})`
            : "Confirm Registration"}
        </button>

      </div>
    </div>
  );
}

export default RegisterModal;