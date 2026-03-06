import { Clock, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const absentStudents = [
  { id: "STU002", name: "Priya Sharma", exitTime: "09:45 AM", duration: "5h 15m", alert: "critical" },
  { id: "STU003", name: "Rahul Kumar", exitTime: "10:30 AM", duration: "4h 30m", alert: "warning" },
  { id: "STU006", name: "Vikram Singh", exitTime: "11:00 AM", duration: "4h 00m", alert: "warning" },
  { id: "STU008", name: "Arjun Das", exitTime: "08:00 AM", duration: "7h 00m", alert: "critical" },
  { id: "STU010", name: "Ravi Verma", exitTime: "12:00 PM", duration: "3h 00m", alert: "info" },
];

const alertClasses: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-primary/10 text-primary",
};

export default function AbsenceMonitor() {
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
              {absentStudents.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.exitTime}</td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1 text-foreground">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {s.duration}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${alertClasses[s.alert]}`}>
                      {s.alert}
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
