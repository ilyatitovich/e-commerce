"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const resetSchema = z.object({
  email: z.string().email("Введите корректный email"),
});

const RESEND_TIMEOUT = 60; // секунд

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    resolver: zodResolver(resetSchema),
  });

  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIMEOUT);

  const onSubmit = async (data: { email: string }) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.ok) {
        setSent(true);
        setTimer(RESEND_TIMEOUT);
      } else {
        const json = await res.json();
        alert(json.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Network error");
    }
  };

  useEffect(() => {
    if (sent && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [sent, timer]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">
          Reset your password
        </h1>

        {sent ? (
          <p className="text-green-600 text-center text-sm">
            We sent you a link. Please check your email.
          </p>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        )}

        <Input
          label="Email"
          placeholder="your@email.com"
          type="email"
          {...register("email")}
          error={errors.email}
        />

        {sent && timer > 0 ? (
          <Button type="button" disabled>
            You can resend in {timer}s
          </Button>
        ) : (
          <Button type="submit" isLoading={isSubmitting}>
            Send reset link
          </Button>
        )}

        <div className="text-center text-sm">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </main>
  );
}
