"use client";

import React, { useEffect, useState } from "react";
import Dialog from "../ui/Dialog";
import { useModal } from "../ModalContext";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/features/authSlice";

interface ProfileData {
  name?: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileModal = () => {
  const { isProfileOpen, closeProfile } = useModal();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileData>();

  const {
    register: passRegister,
    handleSubmit: passHandleSubmit,
    reset: passReset,
    watch,
    formState: { errors: passErrors },
  } = useForm<PasswordData>();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.user)
          reset({ name: json.user.name || "", email: json.user.email });
      } catch {}
    }
    if (isProfileOpen) {
      fetchUser();
      setError(null);
      setSuccess(null);
      setPassError(null);
      setPassSuccess(null);
      passReset();
    }
  }, [isProfileOpen, reset, passReset]);

  async function onSubmit(data: ProfileData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to update profile");

      setSuccess("Profile updated successfully");

      dispatch(
        setUser({
          email: data.email,
          name: data.name,
        })
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onPassSubmit(data: PasswordData) {
    setPassLoading(true);
    setPassError(null);
    setPassSuccess(null);

    if (data.newPassword !== data.confirmPassword) {
      setPassError("New passwords do not match");
      setPassLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Password reset failed");

      setPassSuccess("Password reset successfully");
      passReset();
    } catch (e: any) {
      setPassError(e.message);
    } finally {
      setPassLoading(false);
    }
  }

  return (
    <Dialog
      open={isProfileOpen}
      onClose={closeProfile}
      title="Profile & Settings"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
        <div className="input-container">
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder=" "
            className="peer"
            disabled={loading}
          />
          <label htmlFor="name">Name</label>
        </div>

        <div className="input-container">
          <input
            id="email"
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder=" "
            className="peer"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <hr className="my-6" />

      <form onSubmit={passHandleSubmit(onPassSubmit)} className="space-y-6">
        <div className="input-container">
          <input
            id="currentPassword"
            {...passRegister("currentPassword", {
              required: "Current password is required",
            })}
            type="password"
            placeholder=" "
            className="peer"
            disabled={passLoading}
          />
          {passErrors.currentPassword && (
            <p className="text-red-600 mt-1 text-sm">
              {passErrors.currentPassword.message}
            </p>
          )}
          <label htmlFor="currentPassword">Current Password</label>
        </div>

        <div className="input-container">
          <input
            id="newPassword"
            {...passRegister("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Min length is 6" },
            })}
            type="password"
            placeholder=" "
            className="peer"
            disabled={passLoading}
          />
          {passErrors.newPassword && (
            <p className="text-red-600 mt-1 text-sm">
              {passErrors.newPassword.message}
            </p>
          )}
          <label htmlFor="newPassword">New Password</label>
        </div>

        <div className="input-container">
          <input
            id="confirmPassword"
            {...passRegister("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            })}
            type="password"
            placeholder=" "
            className="peer"
            disabled={passLoading}
          />
          {passErrors.confirmPassword && (
            <p className="text-red-600 mt-1 text-sm">
              {passErrors.confirmPassword.message}
            </p>
          )}
          <label htmlFor="confirmPassword">Confirm New Password</label>
        </div>

        {passError && <p className="text-red-600">{passError}</p>}
        {passSuccess && <p className="text-green-600">{passSuccess}</p>}

        <button
          type="submit"
          disabled={passLoading}
          className="btn btn-error w-full"
        >
          {passLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </Dialog>
  );
};

export default ProfileModal;
