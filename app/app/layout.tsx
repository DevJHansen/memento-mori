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
        <div className="lg:px-32 md:px-24 px-12 mt-24 mb-6">{children}</div>
      </ProtectedRoute>
    </RecoilRoot>
  );
}
