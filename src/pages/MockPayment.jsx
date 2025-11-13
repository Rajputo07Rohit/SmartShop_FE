import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import BackButton from "../components/BackButton";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";

export default function MockPayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const pay = async (status) => {
    try {
      await api.post("/payments/mock", { orderId, status });

      if (status === "success") {
        toast.success("Payment successful");
        return navigate("/dashboard");
      }

      toast.error("Payment failed");
      navigate(`/order/${orderId}`);
    } catch {
      toast.error("Payment error");
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <BackButton className="self-start mb-4" />

      {/* Animated card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card max-w-md w-full p-8 space-y-6 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center shadow-glow">
            <CreditCard size={26} className="text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-semibold">Mock Payment</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          This is a simulated payment screen. Choose one of the outcomes below
          to continue.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <button
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => pay("success")}
          >
            <CheckCircle size={18} />
            Simulate Success
          </button>

          <button
            className="btn bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => pay("failed")}
          >
            <XCircle size={18} />
            Simulate Failure
          </button>
        </div>
      </motion.div>
    </div>
  );
}
