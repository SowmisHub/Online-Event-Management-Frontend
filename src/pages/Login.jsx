import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { supabase } from "../lib/supabase";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const [emailError,setEmailError] = useState("");
  const [passwordError,setPasswordError] = useState("");

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  /* GOOGLE REDIRECT HANDLER */

  useEffect(()=>{

    const handleGoogleLogin = async()=>{

      if(!window.location.hash.includes("access_token")) return;

      const { data } = await supabase.auth.getSession();
      if(!data.session) return;

      const token = data.session.access_token;

      try{

        const res = await axios.post(`${API}/api/auth/google`,{
          token
        });

        const { role } = res.data;

        localStorage.setItem("token",token);
        localStorage.setItem("role",role);

        toast.success("Login successful");

        if(role==="admin") navigate("/admin-dashboard");
        else if(role==="speaker") navigate("/speaker-dashboard");
        else navigate("/user-dashboard");

      }
      catch(err){
        console.log(err);
      }

    };

    handleGoogleLogin();

  },[]);

  /* VALIDATION */

  const validate = ()=>{

    let valid=true;

    setEmailError("");
    setPasswordError("");

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email){
      setEmailError("Email is required");
      valid=false;
    }
    else if(!emailRegex.test(email)){
      setEmailError("Enter valid email");
      valid=false;
    }

    if(!password){
      setPasswordError("Password required");
      valid=false;
    }
    else if(password.length<6){
      setPasswordError("Min 6 characters");
      valid=false;
    }

    return valid;

  };

  /* EMAIL LOGIN */

  const handleLogin = async(e)=>{

    e.preventDefault();

    if(!validate()) return;

    setLoading(true);

    try{

      const res = await axios.post(`${API}/api/auth/login`,{
        email,
        password
      });

      const { token,role,approved } = res.data;

      if(role==="speaker" && !approved){
        toast.warning("Waiting for admin approval");
        setLoading(false);
        return;
      }

      localStorage.setItem("token",token);
      localStorage.setItem("role",role);

      toast.success("Login successful");

      if(role==="admin") navigate("/admin-dashboard");
      else if(role==="speaker") navigate("/speaker-dashboard");
      else navigate("/user-dashboard");

    }
    catch(err){
      toast.error(err.response?.data?.message || "Login failed");
    }

    setLoading(false);

  };

  /* GOOGLE BUTTON */

  const handleGoogleButton = async()=>{

    await supabase.auth.signInWithOAuth({
      provider:"google",
      options:{
        queryParams:{prompt:"select_account"},
        redirectTo:window.location.origin + "/login"
      }
    });

  };

  return(

    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center mt-20 px-4">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-[400px]"
      >

        <h2 className="text-3xl font-bold text-center mb-6">
          EventHub
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-1"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {emailError && (
          <p className="text-red-500 text-sm mb-3">{emailError}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-1"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        {passwordError && (
          <p className="text-red-500 text-sm mb-2">{passwordError}</p>
        )}

        <div className="text-right mb-4">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg mb-4"
        >
          {loading ? "Signing In..." : "Sign In"}
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
          onClick={handleGoogleButton}
          className="w-full border py-3 rounded-lg"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign up
          </Link>
        </p>

      </form>

    </div>

  );

}

export default Login;