import React, { useState } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="grid place-items-center min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card w-full max-w-md p-8"
      >
        <div className="text-center mb-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-glow">
            <LogIn />
          </span>
        </div>
        <h1 className="text-2xl font-semibold mb-1 text-center">Sign in</h1>
        <p className="text-sm text-gray-400 text-center mb-4">Welcome back — let’s shop smarter.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="btn-primary w-full">Login</button>
        </form>
        <p className="text-sm text-gray-400 mt-4 text-center">No account? <Link to="/register" className="underline underline-offset-4">Create one</Link></p>
      </motion.div>
    </div>
  );
}
