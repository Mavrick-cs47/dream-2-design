import Layout from "@/components/layout/Layout";

export default function Insights() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Insights</h1>
          <p className="text-white/70 mt-2">Charts for dream frequency, common symbols, and emotion trends will appear here.</p>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 h-56 flex items-center justify-center text-white/60">Chart Placeholder</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 h-56 flex items-center justify-center text-white/60">Chart Placeholder</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
