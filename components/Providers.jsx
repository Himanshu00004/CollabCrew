'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export function Providers({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <AuthProvider>
      {isHome ? (
        children
      ) : (
        <div className="bg-saas-dark w-full min-h-screen">
          {children}
        </div>
      )}
    </AuthProvider>
  );
}
