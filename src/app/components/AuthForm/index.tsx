"use client";

import React from "react";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-8 bg-white card"
    >
      <h2 className="text-2xl font-bold mb-6 text-center capitalize">
        {variant}
      </h2>

      {variant === "register" && (
        <div className="mb-4">
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder="Your Name"
            className="peer"
          />
          <label htmlFor="name">Name</label>
        </div>
      )}

      <div className="mb-4">
        <div className="input-container">
          <input
            id="email"
            {...register("email", { required: true })}
            type="email"
            placeholder=" "
            className="peer"
            autoComplete="username"
          />
          <label htmlFor="email">Email</label>
        </div>
      </div>

      <div className="mb-6">
        <input
          id="password"
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="peer"
          autoComplete={
            variant === "login" ? "current-password" : "new-password"
          }
        />
        <label htmlFor="password">Password</label>
      </div>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`btn btn-primary w-full ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Loading..." : variant === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
