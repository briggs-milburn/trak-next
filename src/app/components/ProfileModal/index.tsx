'use client';

import React, { useEffect, useState } from 'react';
import Dialog from '../ui/Dialog';
import { useModal } from '../ModalContext';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/features/authSlice';

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
  const [showPasswordSection, setShowPasswordSection] = useState(false);

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
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        if (json.user)
          reset({ name: json.user.name || '', email: json.user.email });
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
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Failed to update profile');

      setSuccess('Profile updated successfully');

      dispatch(
        setUser({
          email: data.email,
          profile: {
            firstName: data.name?.split(' ')[0] || '',
            lastName: data.name?.split(' ')[1] || '',
          },
        })
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function onPassSubmit(data: PasswordData) {
    setPassLoading(true);
    setPassError(null);
    setPassSuccess(null);

    if (data.newPassword !== data.confirmPassword) {
      setPassError('New passwords do not match');
      setPassLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Password reset failed');

      setPassSuccess('Password reset successfully');
      passReset();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setPassError(e.message);
      }
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
      {/* Profile Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Edit Profile
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              {...register('name')}
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <hr className="my-6 border-gray-200" />

      {/* Collapsible Password Section */}
      <div>
        <button
          type="button"
          onClick={() => setShowPasswordSection((v) => !v)}
          className="w-full flex items-center justify-between py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition mb-2"
          aria-expanded={showPasswordSection}
          aria-controls="change-password-section"
        >
          <span className="text-lg font-semibold text-gray-800">
            Change Password
          </span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              showPasswordSection ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showPasswordSection && (
          <form
            id="change-password-section"
            onSubmit={passHandleSubmit(onPassSubmit)}
            className="space-y-6 animate-fade-in"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  {...passRegister('currentPassword', {
                    required: 'Current password is required',
                  })}
                  type="password"
                  placeholder="Current password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={passLoading}
                />
                {passErrors.currentPassword && (
                  <p className="text-red-600 mt-1 text-sm">
                    {passErrors.currentPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  {...passRegister('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Min length is 6' },
                  })}
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={passLoading}
                />
                {passErrors.newPassword && (
                  <p className="text-red-600 mt-1 text-sm">
                    {passErrors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  {...passRegister('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value) =>
                      value === watch('newPassword') ||
                      'Passwords do not match',
                  })}
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={passLoading}
                />
                {passErrors.confirmPassword && (
                  <p className="text-red-600 mt-1 text-sm">
                    {passErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            {passError && <p className="text-red-600">{passError}</p>}
            {passSuccess && <p className="text-green-600">{passSuccess}</p>}
            <button
              type="submit"
              disabled={passLoading}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              {passLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </Dialog>
  );
};

export default ProfileModal;
