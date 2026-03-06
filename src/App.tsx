import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Surveillance from "./pages/Surveillance";
import AccessLogs from "./pages/AccessLogs";
import AbsenceMonitor from "./pages/AbsenceMonitor";
import Alerts from "./pages/Alerts";
import Emergency from "./pages/Emergency";
import Students from "./pages/Students";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/surveillance" element={<Surveillance />} />
          <Route path="/access-logs" element={<AccessLogs />} />
          <Route path="/absence" element={<AbsenceMonitor />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/students" element={<Students />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
