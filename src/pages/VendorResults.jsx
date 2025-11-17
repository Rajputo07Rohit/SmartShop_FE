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

  // Load user's items
  useEffect(() => {
    async function loadItems() {
      try {
        const { data } = await api.get(`/lists/${listId}/items`);
        setMyItems(data);
      } catch {
        toast.error("Failed to load your items");
      }
    }
    loadItems();
  }, [listId]);

  // Load vendors
  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(
          `/vendors/search?lat=${lat}&lng=${lng}&listId=${listId}`
        );
        setVendors(data);
        if (data[0]) setSelected(data[0]);
      } catch {
        toast.error("Failed to find vendors");
      }
    }
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

    try {
      const { data } = await api.post("/orders", {
        vendorIds,
        items,
        totalCost: selected.totalCost,
      });

      toast.success("Order created");
      navigate(`/order/${data._id}`);
    } catch {
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="flex flex-col h-[84vh]">
      {/* Top: Title + Items */}
      <div className="space-y-4 mb-2">
        <BackButton />

        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BadgePercent size={18} /> Best shops near you
        </h2>

        {/* YOUR ITEMS */}
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
                  </span>
                  <span className="text-gray-400">x{it.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No items added yet.</p>
          )}
        </motion.div>
      </div>

      {/* Middle: Scrollable Vendor List */}
      <div className="flex-1 overflow-y-auto pr-2">
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
      </div>

      {/* Bottom: Sticky Checkout Button */}
      <div className="sticky bottom-3 w-full flex justify-end z-50 pt-3 bg-transparent">
        <button
          onClick={placeOrder}
          className="btn-primary px-6 py-2 shadow-glow backdrop-blur-xl"
        >
          Continue to Order
        </button>
      </div>
    </div>
  );
}
