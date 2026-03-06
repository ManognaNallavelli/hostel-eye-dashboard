import { useQuery } from "@tanstack/react-query";
import { Camera, Users, Circle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

export default function Surveillance() {
  const { data: cameras = [] } = useQuery({
    queryKey: ["cameras"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cameras").select("*").order("camera_id");
      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="glass-card rounded-xl overflow-hidden">
            <div className="relative aspect-video bg-foreground/5 flex items-center justify-center">
              <Camera className="h-10 w-10 text-muted-foreground/30" />
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow">
                <Users className="h-3 w-3" />
                {cam.people_detected}
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium shadow">
                <Circle className={`h-2 w-2 fill-current ${cam.status === "online" ? "text-success" : "text-destructive"}`} />
                <span className={cam.status === "online" ? "text-success" : "text-destructive"}>{cam.status}</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-foreground">{cam.camera_id}</p>
              <p className="text-xs text-muted-foreground">{cam.location}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
