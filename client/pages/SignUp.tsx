import Layout from "@/components/layout/Layout";
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto glass-card p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4">Create your account</h1>
        <SignUp routing="path" path="/sign-up" redirectUrl="/journal" />
      </div>
    </Layout>
  );
}
