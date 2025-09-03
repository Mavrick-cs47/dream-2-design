import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid opacity-20" />
        <div className="mx-auto max-w-5xl text-center py-8 md:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight neon-text"
          >
            Turn Your Dreams Into Reality
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 text-white/80 text-lg"
          >
            Dream-to-Design (D2D) lets you type your dreams and visualize them
            with AI in an immersive, futuristic space.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/input"
              className="px-6 py-3 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 text-white hover:bg-brand-cyan/40 shadow-glow"
            >
              Start with Text
            </Link>
          </motion.div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Capture",
                desc: "Type your dream details in seconds.",
                icon: "M3 12h18M12 3v18",
              },
              {
                title: "Visualize",
                desc: "AI turns your dream into stunning art.",
                icon: "M12 2l3 7h7l-5.5 4 2.5 7L12 16l-7 4 2.5-7L2 9h7z",
              },
              {
                title: "Understand",
                desc: "View insights, symbols, and emotions.",
                icon: "M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v2m0 16v2m10-10h-2M4 12H2m14.95 7.07l-1.41-1.41M6.46 6.46 5.05 5.05m13.49 1.41-1.41 1.41M6.46 17.54l-1.41 1.41",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="h-10 w-10 rounded-lg bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d={c.icon}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">{c.title}</h3>
                <p className="text-white/70 mt-1 text-sm">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-16">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-2">About D2D</h2>
            <p className="text-white/70">
              Dream-to-Design is your personal dream companion. Capture your
              dreams, visualize them with AI, and uncover patterns and emotions
              over time.
            </p>
          </div>
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ol className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 shrink-0 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 flex items-center justify-center text-xs">
                  1
                </span>{" "}
                Type your dream
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 shrink-0 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 flex items-center justify-center text-xs">
                  2
                </span>{" "}
                AI analyzes key symbols & emotions
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 shrink-0 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 flex items-center justify-center text-xs">
                  3
                </span>{" "}
                Get a beautiful visualization
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 shrink-0 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 flex items-center justify-center text-xs">
                  4
                </span>{" "}
                Explore insights in your journal
              </li>
            </ol>
            {Boolean((import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY) ? (
              <div className="mt-6">
                <Link
                  to="/sign-up"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-neon-gradient bg-[length:200%_200%] animate-shimmer text-black font-semibold border border-white/10"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </Layout>
  );
}
