import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserX, AlertTriangle, ArrowUpRight, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: alertsData } = useQuery({
    queryKey: ["alerts-today"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase.from("alerts").select("*").gte("created_at", today.toISOString()).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: recentAlerts } = useQuery({
    queryKey: ["recent-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: activityFeed } = useQuery({
    queryKey: ["activity-feed"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activity_feed").select("*").order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data;
    },
  });

  const totalStudents = students?.length ?? 0;
  const insideCount = students?.filter((s) => s.status === "inside").length ?? 0;
  const outsideCount = students?.filter((s) => s.status === "outside").length ?? 0;
  const alertsToday = alertsData?.length ?? 0;
  const criticalToday = alertsData?.filter((a) => a.severity === "critical").length ?? 0;

  const stats = [
    { label: "Total Students", value: String(totalStudents), icon: Users, change: `${totalStudents} registered`, color: "text-primary" },
    { label: "Inside Hostel", value: String(insideCount), change: `${totalStudents ? Math.round((insideCount / totalStudents) * 100) : 0}% present`, icon: UserCheck, color: "text-success" },
    { label: "Outside Hostel", value: String(outsideCount), change: `${totalStudents ? Math.round((outsideCount / totalStudents) * 100) : 0}% away`, icon: UserX, color: "text-warning" },
    { label: "Alerts Today", value: String(alertsToday), change: `${criticalToday} critical`, icon: AlertTriangle, color: "text-destructive" },
  ];

  const severityClasses: Record<string, string> = {
    critical: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
    info: "bg-primary/10 text-primary",
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  };

  return (
    <DashboardLayout>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card stat-card-glow rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">{s.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3" />
              {s.change}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-foreground">Recent Alerts</h2>
          <div className="space-y-3">
            {recentAlerts?.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${severityClasses[a.severity] ?? ""}`}>{a.severity}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.type}</p>
                    <p className="text-xs text-muted-foreground">{a.student_id ?? a.location ?? ""}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{timeAgo(a.created_at)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Activity Feed</h2>
          <div className="space-y-4">
            {activityFeed?.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm text-foreground">{a.message}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {timeAgo(a.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
