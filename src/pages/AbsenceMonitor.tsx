import { useQuery } from "@tanstack/react-query";
import { Clock, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

export default function AbsenceMonitor() {
  const { data: absentStudents = [] } = useQuery({
    queryKey: ["absent-students"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").eq("status", "outside").order("last_exit_time", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getDuration = (exitTime: string | null) => {
    if (!exitTime) return "Unknown";
    const diff = Date.now() - new Date(exitTime).getTime();
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hrs}h ${mins}m`;
  };

  const getAlert = (exitTime: string | null) => {
    if (!exitTime) return "info";
    const hrs = (Date.now() - new Date(exitTime).getTime()) / 3600000;
    if (hrs >= 6) return "critical";
    if (hrs >= 4) return "warning";
    return "info";
  };

  const alertClasses: Record<string, string> = {
    critical: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
    info: "bg-primary/10 text-primary",
  };

  return (
    <DashboardLayout>
      <div className="glass-card rounded-xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="text-base font-semibold text-foreground">Prolonged Absence Report</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 pr-4">Student ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Exit Time</th>
                <th className="pb-3 pr-4">Duration Away</th>
                <th className="pb-3">Alert Status</th>
              </tr>
            </thead>
            <tbody>
              {absentStudents.map((s) => {
                const alert = getAlert(s.last_exit_time);
                return (
                  <tr key={s.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{s.student_id}</td>
                    <td className="py-3 pr-4 font-medium text-foreground">{s.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{s.last_exit_time ? new Date(s.last_exit_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1 text-foreground">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {getDuration(s.last_exit_time)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${alertClasses[alert]}`}>{alert}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
