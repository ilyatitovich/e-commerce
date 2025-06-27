"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validators/registerSchema";
import { useState } from "react";

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setSuccess(false);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const json = await res.json();
      setError(json.message || "Ошибка регистрации");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto p-4 space-y-4"
    >
      <h1 className="text-xl font-bold">Регистрация</h1>

      <input
        type="text"
        placeholder="Email или телефон"
        {...register("email")}
        className="border p-2 w-full"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <input
        type="password"
        placeholder="Пароль"
        {...register("password")}
        className="border p-2 w-full"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 w-full disabled:opacity-50"
      >
        {isSubmitting ? "Регистрируем..." : "Зарегистрироваться"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Регистрация прошла успешно!</p>}
    </form>
  );
}
