import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth.js";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Icon, ICONS } from "../components/Icons";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CasesPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCase, setNewCase] = useState({ name: "", type: "Contract", attorney: "Unassigned", priority: "med", status: "active", caseId: "" });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch cases");
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error(error);
      toast.error("Error loading cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCases();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const id = "CASE-" + Math.floor(1000 + Math.random() * 9000);
    try {
      const response = await fetch(`${API_BASE_URL}/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...newCase, caseId: id, date: new Date().toLocaleDateString() }),
      });

      if (!response.ok) throw new Error("Creation failed");
      
      toast.success("Case created successfully");
      setShowForm(false);
      fetchCases();
    } catch (error) {
      toast.error("Failed to create case");
    }
  };

  const filtered = cases.filter(c =>
    (tab === "all" || c.status === tab) &&
    (c.name?.toLowerCase().includes(search.toLowerCase()) || c.caseId?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 pb-16">
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-serif font-semibold mb-6">Register New Case</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Case Name</label>
                <input required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary" value={newCase.name} onChange={e => setNewCase({...newCase, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Type</label>
                  <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary" value={newCase.type} onChange={e => setNewCase({...newCase, type: e.target.value})}>
                    <option>Contract</option>
                    <option>Litigation</option>
                    <option>Estate Planning</option>
                    <option>Intellectual Property</option>
                    <option>Real Estate</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Priority</label>
                  <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary" value={newCase.priority} onChange={e => setNewCase({...newCase, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="med">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create Case</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex border-b border-border w-full md:w-auto">
          {["all", "active", "review", "pending", "closed"].map(t => (
            <button 
              key={t} 
              className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] capitalize ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Icon d={ICONS.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full bg-card border border-border rounded-md py-2 pl-9 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
              placeholder="Search cases..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="default" className="gap-2 shrink-0" onClick={() => setShowForm(true)}>
            <Icon d={ICONS.plus} size={14} /> New Case
          </Button>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm">Loading cases from database...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-card/50 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                <th className="px-6 py-4">Case ID</th>
                <th className="px-6 py-4">Case Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Attorney</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {filtered.map(c => (
                <tr key={c._id || c.caseId} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 text-muted-foreground">{c.caseId}</td>
                  <td className="px-6 py-4 font-medium text-foreground group-hover:text-primary transition-colors">{c.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.type}</td>
                  <td className="px-6 py-4 text-foreground">{c.attorney}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${c.priority === 'high' ? 'bg-destructive' : c.priority === 'med' ? 'bg-primary' : 'bg-emerald-500'}`} />
                    <span className="capitalize">{c.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.status}>{c.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{c.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">
                    No cases found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 text-xs font-medium text-muted-foreground tracking-wide">
        Showing {filtered.length} of {cases.length} entries
      </div>
    </div>
  );
}
