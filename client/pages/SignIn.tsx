import Layout from "@/components/layout/Layout";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto glass-card p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
        <SignIn routing="path" path="/sign-in" redirectUrl="/journal" />
      </div>
    </Layout>
  );
}
