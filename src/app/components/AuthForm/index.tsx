"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface AuthFormProps {
  variant: "login" | "register";
  onSubmit: (data: FormData) => void;
  loading: boolean;
  error?: string | null;
}

interface FormData {
  email: string;
  password: string;
  name?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  variant,
  onSubmit,
  loading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {variant === "login" ? "Login to view your TRAKs" : "Register"}
      </h2>

      {variant === "register" && (
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="username"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          {...register("password", { required: "Password is required" })}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          autoComplete={
            variant === "login" ? "current-password" : "new-password"
          }
          disabled={loading}
        />
        <button
          type="button"
          tabIndex={-1}
          style={{top: "44px", right: "10px", transform: "translateY(-50%)"}}
          className="absolute top-36 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        {errors.password && (
          <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Loading..." : variant === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
