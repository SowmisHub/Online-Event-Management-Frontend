import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { supabase } from "../lib/supabase";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);

  // ✅ Added error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const validate = () => {
    let isValid = true;

    setNameError("");
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      setNameError("Full Name is required");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/signup`, {
        name,
        email,
        password,
        role,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { prompt: "select_account" },
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-white pt-24 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-2xl shadow-lg w-full max-w-[340px] p-6"
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">
            <span className="text-black">Event</span>
            <span className="text-blue-600">Hub</span>
          </h2>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mt-2 p-2 border rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && (
          <p className="text-red-500 text-sm mt-1">{nameError}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mt-2 p-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full mt-2 p-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => setRole("attendee")}
            className={`flex-1 py-2 rounded border ${
              role === "attendee"
                ? "bg-purple-600 text-white"
                : ""
            }`}
          >
            Attendee
          </button>

          <button
            type="button"
            onClick={() => setRole("speaker")}
            className={`flex-1 py-2 rounded border ${
              role === "speaker"
                ? "bg-purple-600 text-white"
                : ""
            }`}
          >
            Speaker
          </button>
        </div>

        <button
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded mt-4 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">
            or continue with
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full border py-2 rounded"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;