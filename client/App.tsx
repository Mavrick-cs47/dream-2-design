import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Input from "./pages/Input";
import Journal from "./pages/Journal";
import Visualizer from "./pages/Visualizer";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
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

  const clerkKey = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

  return (
    <ClerkProvider publishableKey={clerkKey} navigate={(to) => window.history.pushState({}, "", to)}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/input" element={<Input />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/visualizer" element={<Visualizer />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
