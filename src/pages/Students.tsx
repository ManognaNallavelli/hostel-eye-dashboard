import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

interface Student {
  id: string;
  name: string;
  rfid: string;
  room: string;
}

const initialStudents: Student[] = [
  { id: "STU001", name: "Amit Rathore", rfid: "RFID-1001", room: "A-101" },
  { id: "STU002", name: "Priya Sharma", rfid: "RFID-1002", room: "B-205" },
  { id: "STU003", name: "Rahul Kumar", rfid: "RFID-1003", room: "A-302" },
  { id: "STU004", name: "Sneha Mehta", rfid: "RFID-1004", room: "C-108" },
  { id: "STU005", name: "Kavita Patil", rfid: "RFID-1005", room: "B-110" },
  { id: "STU006", name: "Vikram Singh", rfid: "RFID-1006", room: "A-204" },
  { id: "STU007", name: "Neha Gupta", rfid: "RFID-1007", room: "C-301" },
  { id: "STU008", name: "Arjun Das", rfid: "RFID-1008", room: "B-102" },
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [editing, setEditing] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Student>({ id: "", name: "", rfid: "", room: "" });

  const openAdd = () => {
    setForm({ id: `STU${String(students.length + 1).padStart(3, "0")}`, name: "", rfid: "", room: "" });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    setForm({ ...s });
    setEditing(s);
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.rfid || !form.room) return;
    if (editing) {
      setStudents((prev) => prev.map((s) => (s.id === editing.id ? form : s)));
    } else {
      setStudents((prev) => [...prev, form]);
    }
    setShowForm(false);
  };

  const remove = (id: string) => setStudents((prev) => prev.filter((s) => s.id !== id));

  return (
    <DashboardLayout>
      <div className="glass-card rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Student Directory</h2>
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" /> Add Student
          </Button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="mb-4 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{editing ? "Edit Student" : "Add Student"}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Input placeholder="Student ID" value={form.id} disabled={!!editing} onChange={(e) => setForm({ ...form, id: e.target.value })} />
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="RFID Tag" value={form.rfid} onChange={(e) => setForm({ ...form, rfid: e.target.value })} />
              <Input placeholder="Room No." value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={save}>Save</Button>
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
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.rfid}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.room}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(s.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
