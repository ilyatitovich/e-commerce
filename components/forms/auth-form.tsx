"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validators/registerSchema";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { OAuthButton } from "../ui/oauth-button";
import GoogleIcon from "../icons/google";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginSchema } from "@/lib/validators/loginSchema";
import Link from "next/link";

type AuthFormProps = {
  type: "register" | "login";
};

export default function AuthForm({ type }: AuthFormProps) {
  const rounter = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterSchema | LoginSchema>({
    resolver: zodResolver(type === "register" ? registerSchema : loginSchema),
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const onSubmit = async (data: RegisterSchema) => {
    setError("root", { message: "" });

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (res.ok) {
        if (type === "register") {
          rounter.push("/auth/verify-email-sent");
        }
      } else {
        if (res.status === 401) {
          setError("root", { message: "Incorrect email or password" });
          setError("email", { message: "" });
          setError("password", { message: " " });
          return;
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        console.log("Запрос отменён");
      } else {
        setError("root", { message: "Server error. Try again letter" });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-6 rounded-2xl shadow-md space-y-2 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center">
        {type === "register" ? "Create an account" : "Welcome back"}
      </h1>

      <OAuthButton icon={<GoogleIcon />} providerName="Google" />

      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm font-bold">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {errors["root"]?.message && (
        <p className="text-red-600 text-sm text-center">
          {errors["root"]?.message}
        </p>
      )}

      <Input
        label="Email"
        placeholder="Email"
        type="email"
        {...register("email")}
        error={errors.email}
        autoComplete="email"
      />

      <PasswordInput
        label="Password"
        placeholder="Password"
        {...register("password")}
        error={errors.password}
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isSubmitting}>
        {type === "register" ? "Sign Up" : "Sign In"}
      </Button>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground">
        {type === "login" ? (
          <>
            <Link
              href="/auth/reset-password"
              className="hover:underline transition-colors"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth/register"
              className="hover:underline transition-colors"
            >
              Don&apos;t have an account? Register
            </Link>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="hover:underline transition-colors"
          >
            Already have an account? Login
          </Link>
        )}
      </div>
    </form>
  );
}
