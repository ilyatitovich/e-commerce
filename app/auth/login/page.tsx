import AuthForm from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <AuthForm type="login" />
    </main>
  );
}
