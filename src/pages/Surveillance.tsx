import { Camera, Users, Circle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const cameras = [
  { id: 1, name: "Main Gate A", location: "Entrance", people: 4, status: "online" },
  { id: 2, name: "Main Gate B", location: "Side Entrance", people: 1, status: "online" },
  { id: 3, name: "Corridor – Floor 1", location: "Block A", people: 12, status: "online" },
  { id: 4, name: "Corridor – Floor 2", location: "Block A", people: 6, status: "online" },
  { id: 5, name: "Common Room", location: "Ground Floor", people: 23, status: "online" },
  { id: 6, name: "Parking Area", location: "Basement", people: 0, status: "offline" },
  { id: 7, name: "Mess Hall", location: "Ground Floor", people: 45, status: "online" },
  { id: 8, name: "Library Wing", location: "Floor 3", people: 8, status: "online" },
];

export default function Surveillance() {
  return (
    <DashboardLayout>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="glass-card rounded-xl overflow-hidden">
            {/* Feed placeholder */}
            <div className="relative aspect-video bg-foreground/5 flex items-center justify-center">
              <Camera className="h-10 w-10 text-muted-foreground/30" />
              {/* People badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow">
                <Users className="h-3 w-3" />
                {cam.people}
              </div>
              {/* Status */}
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium shadow">
                <Circle
                  className={`h-2 w-2 fill-current ${cam.status === "online" ? "text-success" : "text-destructive"}`}
                />
                <span className={cam.status === "online" ? "text-success" : "text-destructive"}>
                  {cam.status}
                </span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-foreground">{cam.name}</p>
              <p className="text-xs text-muted-foreground">{cam.location}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
