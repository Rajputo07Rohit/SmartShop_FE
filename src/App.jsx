import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { ShoppingCart, Book, LogOut } from "lucide-react";

import ThemeToggle from "./components/ThemeToggle.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ListDetail from "./pages/ListDetail.jsx";
import VendorResults from "./pages/VendorResults.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import MockPayment from "./pages/MockPayment.jsx";

import Protected from "./components/Protected.jsx";
import Public from "./components/Public.jsx"; // ✅ ADDED

export default function App() {
  const location = useLocation();

  // hide header on login/register screens
  const hiddenPaths = ["/login", "/register"];
  const shouldHideHeader = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      {!shouldHideHeader && (
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-4 z-50"
        >
          <div className="card flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-glow">
                <ShoppingCart size={18} />
              </span>
              <span className="drop-shadow-brand">ShopSmart</span>
            </Link>

            {/* Nav Right */}
            <nav className="flex items-center gap-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="btn-ghost hidden sm:inline-flex"
              >
                <Book size={16} className="mr-2" />
                Docs
              </a>
              <ThemeToggle />
              <button className="btn-ghost" onClick={logout}>
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </nav>
          </div>
        </motion.header>
      )}

      <Toaster position="top-center" />

      {/* Main Router */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-6"
      >
        <Routes>
          {/* Smart redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* PUBLIC ROUTES (only accessible when NOT logged in) */}
          <Route
            path="/login"
            element={
              <Public>
                <Login />
              </Public>
            }
          />
          <Route
            path="/register"
            element={
              <Public>
                <Register />
              </Public>
            }
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/list/:id"
            element={
              <Protected>
                <ListDetail />
              </Protected>
            }
          />
          <Route
            path="/vendors/:listId"
            element={
              <Protected>
                <VendorResults />
              </Protected>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <Protected>
                <OrderSummary />
              </Protected>
            }
          />
          <Route
            path="/pay/:orderId"
            element={
              <Protected>
                <MockPayment />
              </Protected>
            }
          />
        </Routes>
      </motion.main>
    </div>
  );
}
