import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Configuration } from "./pages/Configuration";
import { SyncActivity } from "./pages/SyncActivity";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/syncactivity" element={<SyncActivity />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
