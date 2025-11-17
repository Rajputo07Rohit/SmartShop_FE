import React, { useState } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getGeo = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: 0, lng: 0 });
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 0, lng: 0 }),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // ✅ Name validation
    if (!name.trim()) return toast.error("Name is required");

    // ✅ Email validation
    if (!email.includes("@") || !email.endsWith(".com")) {
      return toast.error("Please enter a valid email address");
    }

    // ✅ Password validation
    if (password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    }

    try {
      const { lat, lng } = await getGeo();
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        location: { type: "Point", coordinates: [lng, lat] },
      });
      localStorage.setItem("token", data.token);
      toast.success(`Account created. Welcome, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Register failed");
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
            <UserPlus />
          </span>
        </div>
        <h1 className="text-2xl font-semibold mb-1 text-center">
          Create account
        </h1>
        <p className="text-sm text-gray-400 text-center mb-4">
          Join ShopSmart — quick and secure.
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password (min 8 characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-primary w-full">Register</button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
