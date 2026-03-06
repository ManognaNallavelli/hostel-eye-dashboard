import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

const logs = [
  { id: "STU001", name: "Amit Rathore", entry: "08:15 AM", exit: "—", status: "Inside" },
  { id: "STU002", name: "Priya Sharma", entry: "07:30 AM", exit: "09:45 AM", status: "Outside" },
  { id: "STU003", name: "Rahul Kumar", entry: "06:00 AM", exit: "10:30 AM", status: "Outside" },
  { id: "STU004", name: "Sneha Mehta", entry: "08:00 AM", exit: "—", status: "Inside" },
  { id: "STU005", name: "Kavita Patil", entry: "09:00 AM", exit: "—", status: "Inside" },
  { id: "STU006", name: "Vikram Singh", entry: "07:00 AM", exit: "11:00 AM", status: "Outside" },
  { id: "STU007", name: "Neha Gupta", entry: "08:45 AM", exit: "—", status: "Inside" },
  { id: "STU008", name: "Arjun Das", entry: "06:30 AM", exit: "08:00 AM", status: "Outside" },
];

export default function AccessLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Inside" | "Outside">("all");

  const filtered = logs.filter(
    (l) =>
      (filter === "all" || l.status === filter) &&
      (l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="glass-card rounded-xl p-5">
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID…"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "Inside", "Outside"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 pr-4">Student ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Entry Time</th>
                <th className="pb-3 pr-4">Exit Time</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{l.id}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{l.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{l.entry}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{l.exit}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        l.status === "Inside" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
