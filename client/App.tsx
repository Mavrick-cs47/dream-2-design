import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Input from "./pages/Input";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Capture token from URL once and store for API calls
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("d2d_token", token);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/input" element={<Input />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
  );
};

const container = document.getElementById("root")!;
const existing: any = (container as any).__reactRoot || null;
if (existing && typeof existing.render === "function") {
  existing.render(<App />);
} else {
  const root = createRoot(container);
  (container as any).__reactRoot = root;
  root.render(<App />);
}
