import { MapPin, Radio } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const trackedStudents = [
  { id: "STU008", name: "Arjun Das", lat: 19.076, lng: 72.877, lastSeen: "2 min ago", status: "tracking" },
  { id: "STU002", name: "Priya Sharma", lat: 19.082, lng: 72.881, lastSeen: "5 min ago", status: "tracking" },
  { id: "STU003", name: "Rahul Kumar", lat: 19.07, lng: 72.87, lastSeen: "10 min ago", status: "lost" },
];

export default function Emergency() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map placeholder */}
        <div className="glass-card rounded-xl overflow-hidden lg:col-span-2">
          <div className="relative flex aspect-[16/9] items-center justify-center bg-secondary">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">Emergency Tracking Map</p>
              <p className="text-xs text-muted-foreground">Integrate with Maps API for live view</p>
            </div>
            {/* Simulated pins */}
            {trackedStudents.map((s, i) => (
              <div
                key={s.id}
                className="absolute"
                style={{ top: `${30 + i * 20}%`, left: `${25 + i * 22}%` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/30" />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracked list */}
        <div className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Radio className="h-5 w-5 text-destructive" />
            <h2 className="text-base font-semibold text-foreground">Live Tracking</h2>
          </div>
          <div className="space-y-3">
            {trackedStudents.map((s) => (
              <div key={s.id} className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.status === "tracking" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  ID: {s.id} • Last seen: {s.lastSeen}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.lat.toFixed(3)}°N, {s.lng.toFixed(3)}°E
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
