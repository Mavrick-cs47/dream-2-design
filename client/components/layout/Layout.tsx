import { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import CosmicBackground from "./CosmicBackground";
import FAB from "@/components/common/FAB";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <CosmicBackground />
      <Navbar />
      <main className="container py-10">
        {children}
      </main>
      <FAB />
    </div>
  );
}
