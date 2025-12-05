
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import HospitalList from "@/pages/hospitals/HospitalList";
import DoctorList from "@/pages/doctors/DoctorList";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={PatientDashboard} />
      <Route path="/hospitals" component={HospitalList} />
      <Route path="/doctors" component={DoctorList} />
      <Route path="/records" component={PatientDashboard} /> {/* Reusing dashboard for now */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
