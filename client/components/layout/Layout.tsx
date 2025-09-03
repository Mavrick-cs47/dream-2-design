import { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import CosmicBackground from "./CosmicBackground";
import FAB from "@/components/common/FAB";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <CosmicBackground />
      <Navbar />
      <main className="container py-10">{children}</main>
      <footer className="mt-12 border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="container py-6 text-center text-xs text-white/60">
          Created by Chirag Sharma — All rights reserved 2025
        </div>
      </footer>
      <FAB />
    </div>
  );
}
