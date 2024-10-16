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
      <div className="py-12 px-4 sm:px-8 md:px-12 lg:px-16">
        <ProtectedRoute>{children}</ProtectedRoute>
      </div>
    </RecoilRoot>
  );
}
