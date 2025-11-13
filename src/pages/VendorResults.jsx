import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { BadgePercent, MapPin, PackageCheck } from "lucide-react";
import BackButton from "../components/BackButton";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function VendorResults() {
  const { listId } = useParams();
  const q = useQuery();
  const lat = q.get("lat");
  const lng = q.get("lng");
  const [vendors, setVendors] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  // ✅ Load user's added items
  useEffect(() => {
    const loadItems = async () => {
      try {
        const { data } = await api.get(`/lists/${listId}/items`);
        setMyItems(data);
      } catch {
        toast.error("Failed to load your items");
      }
    };
    loadItems();
  }, [listId]);

  // ✅ Load vendors
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(
          `/vendors/search?lat=${lat}&lng=${lng}&listId=${listId}`
        );
        setVendors(data);
        if (data[0]) setSelected(data[0]);
      } catch {
        toast.error("Failed to find vendors");
      }
    };
    load();
  }, [lat, lng, listId]);

  const placeOrder = async () => {
    if (!selected) return;
    const vendorIds = [selected.vendor.id];
    const items = selected.available.map((a) => ({
      name: a.name,
      quantity: a.quantity,
      price: a.price,
      vendorId: a.vendorId,
    }));
    const totalCost = selected.totalCost;
    try {
      const { data } = await api.post("/orders", {
        vendorIds,
        items,
        totalCost,
      });
      toast.success("Order created");
      navigate(`/order/${data._id}`);
    } catch {
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="space-y-6">
      <BackButton />

      {/* ✅ Title */}
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <BadgePercent size={18} /> Best shops near you
      </h2>

      {/* ✅ Improved Your Items Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Your Items</h3>
          <span className="text-xs text-gray-400">
            {myItems.length} item{myItems.length === 1 ? "" : "s"}
          </span>
        </div>

        {myItems.length ? (
          <ul className="text-sm divide-y divide-white/10">
            {myItems.map((it) => (
              <li
                key={it._id}
                className="py-2 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <PackageCheck size={16} className="opacity-70" />
                  {it.name}
                  {it.brandPreference && (
                    <span className="badge">{it.brandPreference}</span>
                  )}
                </span>
                <span className="text-gray-400">x{it.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No items added yet.</p>
        )}
      </motion.div>

      {/* ✅ Existing vendor cards */}
      <div className="grid gap-4">
        {vendors.map((v, i) => (
          <motion.button
            key={v.vendor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(v)}
            className={`card p-4 text-left hover:shadow-glow transition ${
              selected?.vendor?.id === v.vendor.id
                ? "ring-2 ring-brand-600"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{v.vendor.shopName}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={14} /> {v.vendor.distanceKm} km away
                </p>
              </div>
              <div className="flex gap-2">
                {v.tags.map((t) => (
                  <span key={t} className="badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 text-sm grid grid-cols-3 gap-3">
              <span>
                Coverage: <b>{v.coveragePct}%</b>
              </span>
              <span>
                Total: <b>₹{v.totalCost}</b>
              </span>
              <span>
                Items: <b>{v.available.length}</b>
              </span>
            </div>

            {!!v.missing.length && (
              <p className="text-xs text-red-400 mt-2">
                Missing: {v.missing.map((m) => m.name).join(", ")}
              </p>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={placeOrder} className="btn-primary">
          Continue to Order
        </button>
      </div>
    </div>
  );
}
