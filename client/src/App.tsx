import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { PWAStatusIndicator } from "@/components/pwa-status-indicator";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showPWABanner, setShowPWABanner] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {showPWABanner && (
          <PWAInstallBanner onClose={() => setShowPWABanner(false)} />
        )}
        <PWAStatusIndicator />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
