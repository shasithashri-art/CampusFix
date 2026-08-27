import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-widest text-[#B08D57] uppercase mb-2">
            Resident Portal
          </p>
          <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl font-semibold text-[#16233B]">
            CampusFix
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D5] rounded-sm shadow-sm p-8">
          {error && (
            <p className="text-[#B3543E] text-sm mb-4 text-center border border-[#B3543E]/20 bg-[#B3543E]/5 rounded-sm py-2">
              {error}
            </p>
          )}

          <label className="block text-xs font-medium text-[#64748B] uppercase tracking-wide mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#E5E0D5] rounded-sm px-3 py-2.5 mb-5 text-[#16233B] focus:outline-none focus:border-[#B08D57] transition"
            required
          />

          <label className="block text-xs font-medium text-[#64748B] uppercase tracking-wide mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#E5E0D5] rounded-sm px-3 py-2.5 mb-6 text-[#16233B] focus:outline-none focus:border-[#B08D57] transition"
            required
          />

          <button type="submit" className="w-full bg-[#16233B] text-[#F7F4EE] font-medium py-2.5 rounded-sm hover:bg-[#1F3050] transition">
            Log In
          </button>

          <p className="text-sm text-[#64748B] mt-5 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#B08D57] hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;