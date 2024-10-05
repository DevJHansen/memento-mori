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
      <ProtectedRoute>{children}</ProtectedRoute>
    </RecoilRoot>
  );
}
