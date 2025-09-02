import Layout from "@/components/layout/Layout";

export default function Journal() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Dream Journal Dashboard</h1>
          <p className="text-white/70 mt-2">Your timeline of dreams, insights, and visualizations will appear here.</p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 h-40 flex items-center justify-center text-white/60">
                Dream Card Placeholder
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
