'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// This component checks if the user is authenticated and redirects to the login page if not
const AuthenticatedPage: React.FC<React.PropsWithChildren> = ({ children }) => {
  const route = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/me');
      console.log('Auth check response:', res);
      if (!res.ok) {
        route.push('/login');
      }
    };
    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => {
      window.removeEventListener('focus', checkAuth);
    };
  }, [route]);

  return <>{children}</>;
};

export default AuthenticatedPage;
