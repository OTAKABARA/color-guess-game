import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";
import { SettingsProvider } from "./context/SettingsContext";
import App from "./App";

// Set up the app with all necessary providers
const root = createRoot(document.getElementById("root")!);

root.render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SettingsProvider>
        <Toaster />
        <App />
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
