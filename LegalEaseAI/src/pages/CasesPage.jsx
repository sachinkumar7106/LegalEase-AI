import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Icon, ICONS } from "../components/Icons";

export default function CasesPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const cases = [
    { id: "2024-001", name: "Henderson v. Meridian Corp.", type: "Corporate Litigation", attorney: "A. Sharma", status: "active", priority: "high", date: "Oct 28, 2024" },
    { id: "2024-002", name: "Patel Estate Trust Review", type: "Estate Planning", attorney: "R. Kapoor", status: "review", priority: "med", date: "Nov 5, 2024" },
    { id: "2024-003", name: "NDA — Orion Ventures", type: "Contract", attorney: "A. Sharma", status: "pending", priority: "med", date: "Oct 14, 2024" },
    { id: "2024-004", name: "Kumar IP Filing #2024-11", type: "Intellectual Property", attorney: "M. Ali", status: "active", priority: "low", date: "Nov 2, 2024" },
    { id: "2024-005", name: "Retail Lease — Block 44", type: "Real Estate", attorney: "R. Kapoor", status: "closed", priority: "low", date: "Sep 30, 2024" },
    { id: "2024-006", name: "Singh Employment Dispute", type: "Labor Law", attorney: "M. Ali", status: "active", priority: "high", date: "Oct 19, 2024" },
    { id: "2024-007", name: "Mehra Divorce Settlement", type: "Family Law", attorney: "A. Sharma", status: "review", priority: "med", date: "Oct 22, 2024" },
  ];

  const filtered = cases.filter(c =>
    (tab === "all" || c.status === tab) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 pb-16">
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
          <Button variant="default" className="gap-2 shrink-0">
            <Icon d={ICONS.plus} size={14} /> New Case
          </Button>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
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
              <tr key={c.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                <td className="px-6 py-4 text-muted-foreground">{c.id}</td>
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
      </div>
      <div className="mt-4 text-xs font-medium text-muted-foreground tracking-wide">
        Showing {filtered.length} of {cases.length} entries
      </div>
    </div>
  );
}
