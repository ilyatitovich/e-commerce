import AuthForm from "@/components/forms/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <AuthForm type="register" />
    </main>
  );
}
