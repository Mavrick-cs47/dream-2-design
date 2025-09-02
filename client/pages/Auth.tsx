import Layout from "@/components/layout/Layout";

export default function Auth() {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold text-center">Welcome to D2D</h1>
          <p className="text-white/70 mt-2 text-center">Login or sign up to access your dream journal.</p>
          <div className="mt-6 space-y-3">
            <button className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white/90 hover:text-white hover:bg-white/10">Continue with Google</button>
            <button className="w-full px-4 py-3 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 text-white hover:bg-brand-cyan/40">Create Account</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
