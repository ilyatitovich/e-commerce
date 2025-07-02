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
import { openOAuthWindow } from "@/lib/oauth";

export default function RegisterForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const onSubmit = async (data: RegisterSchema) => {
    setSuccess(false);
    setError(null);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    console.table(data);

    // try {
    //   const res = await fetch("/api/auth/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //     signal: controller.signal,
    //   });

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
      <h1 className="text-2xl font-bold text-center">Create an account</h1>

      <OAuthButton
        icon={<GoogleIcon />}
        providerName="Google"
        onClick={() => openOAuthWindow("/api/auth/google", "Google")}
      />

      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <Input
        label="Email"
        placeholder="Email"
        type="email"
        {...register("email")}
        error={errors.email}
      />

      <PasswordInput
        label="Password"
        placeholder="Password"
        {...register("password")}
        error={errors.password}
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isSubmitting}>
        Sign Up
      </Button>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm text-center">
          Регистрация прошла успешно!
        </p>
      )}
    </form>
  );
}
