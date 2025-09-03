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

  const Providers = ({ children }: { children: React.ReactNode }) => {
    return clerkKey ? (
      <ClerkProvider publishableKey={clerkKey}>{children}</ClerkProvider>
    ) : (
      <>{children}</>
    );
  };

  return (
    <Providers>
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
              {clerkKey ? (
                <>
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                </>
              ) : null}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Providers>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
