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

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 p-6 rounded-2xl shadow-md space-y-5 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-center">Регистрация</h1>

        <input
          type="text"
          placeholder="Email или телефон"
          {...register("email")}
          className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        <div>
          <input
            type="password"
            placeholder="Пароль"
            {...register("password")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition disabled:opacity-50"
        >
          {isSubmitting ? "Регистрируем..." : "Зарегистрироваться"}
        </button>

        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">или</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 py-3 rounded-lg shadow-sm transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h146.9c-6.3 33.5-25.1 61.9-53.4 81v67h86.5c50.5-46.6 81.5-115.4 81.5-193z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c72.6 0 133.5-24.1 178-65.5l-86.5-67c-24 16.1-54.8 25.7-91.5 25.7-70.5 0-130.2-47.7-151.6-111.6H33.2v69.7c44.9 88.6 137 149.7 238.8 149.7z"
              fill="#34A853"
            />
            <path
              d="M120.4 325.9c-10.5-31.5-10.5-65.4 0-96.9V159.3H33.2c-43.7 86.7-43.7 189.3 0 276l87.2-67.4z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c39.5-.6 77.3 14.1 106.3 41.3l79.5-79.5C415.5 24.3 345.5-1.4 272 0 170.2 0 78.1 61.1 33.2 149.3l87.2 67.4C141.8 154.9 201.5 107.7 272 107.7z"
              fill="#EA4335"
            />
          </svg>
          <span>Войти через Google</span>
        </button>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm text-center">
            Регистрация прошла успешно!
          </p>
        )}
      </form>
    </main>
  );
}
