import { Users, UserCheck, UserX, AlertTriangle, ArrowUpRight, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const stats = [
  { label: "Total Students", value: "342", icon: Users, change: "+12 this week", color: "text-primary" },
  { label: "Inside Hostel", value: "287", icon: UserCheck, change: "84% present", color: "text-success" },
  { label: "Outside Hostel", value: "55", icon: UserX, change: "16% away", color: "text-warning" },
  { label: "Alerts Today", value: "7", icon: AlertTriangle, change: "3 critical", color: "text-destructive" },
];

const recentAlerts = [
  { id: 1, type: "Unauthorized Entry", location: "Gate B", time: "2 min ago", severity: "critical" },
  { id: 2, type: "Prolonged Absence", student: "Rahul K.", time: "15 min ago", severity: "warning" },
  { id: 3, type: "Crowd Limit Exceeded", location: "Common Room", time: "32 min ago", severity: "critical" },
  { id: 4, type: "Late Return", student: "Priya S.", time: "1 hr ago", severity: "info" },
  { id: 5, type: "RFID Mismatch", location: "Gate A", time: "2 hrs ago", severity: "warning" },
];

const activityFeed = [
  { id: 1, text: "Amit R. entered through Gate A", time: "1 min ago" },
  { id: 2, text: "Camera 3 detected 12 people in corridor", time: "3 min ago" },
  { id: 3, text: "Sneha M. exited through Gate B", time: "5 min ago" },
  { id: 4, text: "Night patrol started – Zone 2", time: "10 min ago" },
  { id: 5, text: "System health check passed", time: "15 min ago" },
  { id: 6, text: "Kavita P. entered through Gate A", time: "18 min ago" },
];

const severityClasses: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-primary/10 text-primary",
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Stats */}
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
        {/* Recent Alerts */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-foreground">Recent Alerts</h2>
          <div className="space-y-3">
            {recentAlerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${severityClasses[a.severity]}`}>
                    {a.severity}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.student ?? a.location}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Activity Feed</h2>
          <div className="space-y-4">
            {activityFeed.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {a.time}
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
