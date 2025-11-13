import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import BackButton from "../components/BackButton";

export default function OrderSummary() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch {
        toast.error("Failed to load order");
      }
    };
    load();
  }, [orderId]);

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <BackButton />
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="card p-6">
        <ul className="space-y-2">
          {order.items.map((it, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b border-white/10 pb-1"
            >
              <span>
                {it.name} x{it.quantity}
              </span>
              <span>₹{(it.price * it.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4 font-semibold">
          <span>Total</span>
          <span>₹{order.totalCost.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/pay/${order._id}`)}
          className="btn-primary"
        >
          Pay now
        </button>
      </div>
    </motion.div>
  );
}
