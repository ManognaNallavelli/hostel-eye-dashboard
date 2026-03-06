import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Student = Tables<"students">;

export default function Students() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_id: "", name: "", rfid_tag_id: "", room_number: "" });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").order("student_id");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("students").update({ name: form.name, rfid_tag_id: form.rfid_tag_id, room_number: form.room_number }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("students").insert({ student_id: form.student_id, name: form.name, rfid_tag_id: form.rfid_tag_id, room_number: form.room_number });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setShowForm(false);
      toast.success(editing ? "Student updated" : "Student added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openAdd = () => {
    setForm({ student_id: `STU${String(students.length + 1).padStart(3, "0")}`, name: "", rfid_tag_id: "", room_number: "" });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    setForm({ student_id: s.student_id, name: s.name, rfid_tag_id: s.rfid_tag_id, room_number: s.room_number });
    setEditing(s);
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.rfid_tag_id || !form.room_number) return;
    saveMutation.mutate();
  };

  return (
    <DashboardLayout>
      <div className="glass-card rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Student Directory</h2>
          <Button size="sm" onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add Student</Button>
        </div>

        {showForm && (
          <div className="mb-4 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{editing ? "Edit Student" : "Add Student"}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Input placeholder="Student ID" value={form.student_id} disabled={!!editing} onChange={(e) => setForm({ ...form, student_id: e.target.value })} />
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="RFID Tag" value={form.rfid_tag_id} onChange={(e) => setForm({ ...form, rfid_tag_id: e.target.value })} />
              <Input placeholder="Room No." value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} />
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={save} disabled={saveMutation.isPending}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 pr-4">Student ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">RFID Tag</th>
                <th className="pb-3 pr-4">Room</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{s.student_id}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.rfid_tag_id}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.room_number}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => deleteMutation.mutate(s.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
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
