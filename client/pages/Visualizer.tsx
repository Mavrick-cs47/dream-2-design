import Layout from "@/components/layout/Layout";

export default function Visualizer() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Dream Visualizer</h1>
          <p className="text-white/70 mt-2">Your AI-generated dream images and 3D/VR preview will appear here.</p>
          <div className="mt-6 aspect-video rounded-xl border border-white/10 bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20 flex items-center justify-center text-white/70">
            Visualization Placeholder
          </div>
        </div>
      </div>
    </Layout>
  );
}
