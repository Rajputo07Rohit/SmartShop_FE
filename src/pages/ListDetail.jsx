import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, PlusCircle, Trash2 } from "lucide-react";
import BackButton from "../components/BackButton";

export default function ListDetail() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  // Load items
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

  // Add item
  const addItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Item name cannot be empty");
      return;
    }

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
      toast.success("Item added");
    } catch (e) {
      toast.error("Failed to add item");
    }
  };

  // DELETE item
  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/lists/${id}/items/${itemId}`);
      setItems(items.filter((it) => it._id !== itemId));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // Find Vendors (only if items exist)
  const goFindVendors = async () => {
    if (items.length === 0) {
      toast.error("Please add at least one item before searching.");
      return;
    }

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

      {/* Add Item */}
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

      {/* Items List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h3 className="font-semibold mb-3">Items</h3>

        <ul className="space-y-2">
          {items.map((it) => (
            <motion.li
              key={it._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between border-b border-white/10 pb-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{it.name}</span>
                <span className="text-xs text-gray-400">x{it.quantity}</span>

                {it.brandPreference && (
                  <span className="text-xs badge">{it.brandPreference}</span>
                )}
              </div>

              <button
                onClick={() => deleteItem(it._id)}
                className="text-red-400 hover:text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            </motion.li>
          ))}

          {!items.length && <p className="text-gray-400">No items yet.</p>}
        </ul>
      </motion.div>

      {/* Find Shops Button */}
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
