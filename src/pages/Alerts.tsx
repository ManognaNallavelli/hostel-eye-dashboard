import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Shield, Users, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const iconMap: Record<string, typeof Shield> = {
  "Unauthorized Entry": Shield,
  "Crowd Limit Exceeded": Users,
  "Prolonged Absence": Clock,
  "Late Return": Bell,
  "RFID Mismatch": AlertTriangle,
  "Emergency Tracking": AlertTriangle,
};

const severityConfig: Record<string, { bg: string; dot: string }> = {
  critical: { bg: "border-l-destructive", dot: "bg-destructive" },
  warning: { bg: "border-l-warning", dot: "bg-warning" },
  info: { bg: "border-l-primary", dot: "bg-primary" },
};

export default function Alerts() {
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery({
    queryKey: ["all-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alerts").update({ status: "resolved" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-alerts"] });
      toast.success("Alert resolved");
    },
  });

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
      <div className="space-y-3">
        {alerts.map((a) => {
          const cfg = severityConfig[a.severity] ?? severityConfig.info;
          const Icon = iconMap[a.type] ?? Bell;
          return (
            <div key={a.id} className={`glass-card rounded-xl border-l-4 ${cfg.bg} p-5 flex items-start gap-4`}>
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.dot}/10`}>
                <Icon className={`h-5 w-5 ${cfg.dot.replace("bg-", "text-")}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{a.type}</h3>
                  <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                  {a.status === "resolved" && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">resolved</span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.message}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(a.created_at)}</span>
                {a.status === "active" && (
                  <Button size="sm" variant="outline" onClick={() => resolveMutation.mutate(a.id)} disabled={resolveMutation.isPending}>
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
