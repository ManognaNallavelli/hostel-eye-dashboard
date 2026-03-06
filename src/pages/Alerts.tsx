import { Bell, Shield, Users, Clock, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const alerts = [
  { id: 1, type: "Unauthorized Entry", desc: "Unrecognized person detected at Gate B", time: "2 min ago", severity: "critical", icon: Shield },
  { id: 2, type: "Crowd Limit Exceeded", desc: "Common Room has 48 people (limit: 40)", time: "15 min ago", severity: "critical", icon: Users },
  { id: 3, type: "Prolonged Absence", desc: "Arjun Das has been outside for 7 hours", time: "30 min ago", severity: "warning", icon: Clock },
  { id: 4, type: "Prolonged Absence", desc: "Priya Sharma has been outside for 5 hours", time: "45 min ago", severity: "warning", icon: Clock },
  { id: 5, type: "RFID Mismatch", desc: "Card ID does not match student at Gate A", time: "1 hr ago", severity: "critical", icon: AlertTriangle },
  { id: 6, type: "Late Return", desc: "3 students returned after curfew (10 PM)", time: "2 hrs ago", severity: "info", icon: Bell },
  { id: 7, type: "Camera Offline", desc: "Parking Area camera is unresponsive", time: "3 hrs ago", severity: "warning", icon: AlertTriangle },
];

const severityConfig: Record<string, { bg: string; dot: string }> = {
  critical: { bg: "border-l-destructive", dot: "bg-destructive" },
  warning: { bg: "border-l-warning", dot: "bg-warning" },
  info: { bg: "border-l-primary", dot: "bg-primary" },
};

export default function Alerts() {
  return (
    <DashboardLayout>
      <div className="space-y-3">
        {alerts.map((a) => {
          const cfg = severityConfig[a.severity];
          return (
            <div key={a.id} className={`glass-card rounded-xl border-l-4 ${cfg.bg} p-5 flex items-start gap-4`}>
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.dot}/10`}>
                <a.icon className={`h-5 w-5 ${cfg.dot.replace("bg-", "text-")}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{a.type}</h3>
                  <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
