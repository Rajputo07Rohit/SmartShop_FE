import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ListChecks } from "lucide-react";
import SkeletonLine from "../components/SkeletonLine.jsx";

export default function Dashboard() {
  const [lists, setLists] = useState(null);
  const [title, setTitle] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/lists");
      setLists(data);
    } catch (e) {
      toast.error("Failed to load lists");
      setLists([]);
    }
  };

  useEffect(() => { load(); }, []);

  const createList = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const { data } = await api.post("/lists", { title });
      toast.success("List created");
      setTitle("");
      setLists([data, ...(lists || [])]);
    } catch (e) {
      toast.error("Failed to create");
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <span className="inline-flex p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white"><ListChecks size={18}/></span>
          Create new list
        </h2>
        <form onSubmit={createList} className="flex flex-col sm:flex-row gap-3">
          <input className="input" placeholder="e.g. Weekly Groceries" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <button className="btn-primary flex items-center gap-2"><Plus size={16}/> Create</button>
        </form>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists === null && Array.from({length: 6}).map((_,i)=>(
          <div key={i} className="card p-5">
            <SkeletonLine className="h-5 w-2/3" />
            <SkeletonLine className="h-4 w-1/2 mt-3" />
          </div>
        ))}
        {Array.isArray(lists) && lists.map((l, idx) => (
          <motion.div key={l._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Link to={`/list/${l._id}`} className="card p-5 hover:shadow-glow transition block">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{l.title}</h3>
                <span className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">Tap to add items and find shops</p>
            </Link>
          </motion.div>
        ))}
        {Array.isArray(lists) && !lists.length && <p className="text-gray-400">No lists yet. Create your first!</p>}
      </div>
    </div>
  );
}
