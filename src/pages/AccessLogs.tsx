import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

export default function AccessLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "inside" | "outside">("all");

  const { data: logs = [] } = useQuery({
    queryKey: ["access-logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("access_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = logs.filter(
    (l) =>
      (filter === "all" || l.status === filter) &&
      (l.name.toLowerCase().includes(search.toLowerCase()) || l.student_id.toLowerCase().includes(search.toLowerCase()))
  );

  const formatTime = (t: string | null) => {
    if (!t) return "—";
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout>
      <div className="glass-card rounded-xl p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or ID…" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {(["all", "inside", "outside"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

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
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{l.student_id}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{l.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatTime(l.entry_time)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatTime(l.exit_time)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${l.status === "inside" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
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
