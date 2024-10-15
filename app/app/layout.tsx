'use client';

import AuthNavbar from '@/components/AuthNavbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { RecoilRoot } from 'recoil';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RecoilRoot>
      <AuthNavbar />
      <ProtectedRoute>
        <div className="p-4 sm:p-8 md:p-12 lg:p-16">{children}</div>
      </ProtectedRoute>
    </RecoilRoot>
  );
}
