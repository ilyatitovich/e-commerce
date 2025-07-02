"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validators/registerSchema";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { OAuthButton } from "../ui/oauth-button";
import GoogleIcon from "../icons/google";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginSchema } from "@/lib/validators/loginSchema";

type AuthFormProps = {
  type: "register" | "login";
};

export default function AuthForm({ type }: AuthFormProps) {
  const rounter = useRouter();
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema | LoginSchema>({
    resolver: zodResolver(type === "register" ? registerSchema : loginSchema),
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const onSubmit = async (data: RegisterSchema) => {
    setError(null);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    console.table(data);

    if (type === "register") {
      rounter.push("/auth/verify-email-sent");
    }

    // try {
    // const res = await fetch(`/api/auth/${type}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    //   signal: controller.signal,
    // });

    //   if (res.ok) {
    //     setSuccess(true);
    //   } else {
    //     const json = await res.json();
    //     setError(json.message || "Ошибка регистрации");
    //   }
    // } catch (err) {
    //   if ((err as Error).name === "AbortError") {
    //     console.log("Запрос отменён");
    //   } else {
    //     setError("Ошибка сети или сервера");
    //   }
    // }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-6 rounded-2xl shadow-md space-y-2 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center">
        {type === "register" ? "Create an account" : "Welcome back"}
      </h1>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

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

      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm font-bold">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <OAuthButton icon={<GoogleIcon />} providerName="Google" />
    </form>
  );
}
