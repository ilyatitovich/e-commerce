"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";

export type InputProps = {
  label?: string;
  error?: FieldError;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      error,
      placeholder,
      type = "text",
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const id = `input-${name}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={clsx(
            "w-full p-3 border rounded-lg text-sm transition outline-none",
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white text-black",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500",
            className
          )}
          {...props}
        />

        {error && (
          <small
            id={`${id}-error`}
            className="text-sm text-red-500 mt-1"
            role="alert"
          >
            {error.message}
          </small>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
