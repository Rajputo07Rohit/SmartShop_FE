import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, PlusCircle } from "lucide-react";
import BackButton from "../components/BackButton";

export default function ListDetail() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get(`/lists/${id}/items`);
      setItems(data);
    } catch (e) {
      toast.error("Failed to load items");
    }
  };
  useEffect(() => {
    load();
  }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const { data } = await api.post(`/lists/${id}/items`, {
        name,
        quantity,
        brandPreference: brand,
      });
      setItems([data, ...items]);
      setName("");
      setQuantity(1);
      setBrand("");
    } catch (e) {
      toast.error("Failed to add item");
    }
  };

  const goFindVendors = async () => {
    const pos = await new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: 0, lng: 0 });
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve({ lat: 0, lng: 0 }),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
    navigate(`/vendors/${id}?lat=${pos.lat}&lng=${pos.lng}`);
  };

  return (
    <div className="space-y-6">
      <BackButton />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold mb-3">Add item</h2>
        <form onSubmit={addItem} className="grid sm:grid-cols-4 gap-3">
          <input
            className="input"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Qty"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <input
            className="input"
            placeholder="Brand (optional)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <button className="btn-primary flex items-center gap-2">
            <PlusCircle size={16} /> Add
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h3 className="font-semibold mb-3">Items</h3>
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it._id}
              className="flex items-center justify-between border-b border-white/10 pb-2"
            >
              <span>
                {it.name}{" "}
                <span className="text-xs text-gray-400">x{it.quantity}</span>
              </span>
              {it.brandPreference && (
                <span className="text-xs badge">{it.brandPreference}</span>
              )}
            </li>
          ))}
          {!items.length && <p className="text-gray-400">No items yet.</p>}
        </ul>
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={goFindVendors}
          className="btn-primary flex items-center gap-2"
        >
          <Search size={16} /> Find Shops
        </button>
      </div>
    </div>
  );
}
