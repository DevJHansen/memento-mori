'use client';

import { auth } from '@/lib/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loading } from './Loading';
import { useRouter } from 'next/navigation';
import { Account } from '@/lib/schemas/account';
import { atom, useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { getAuthToken } from '@/lib/firebase/auth';
import CompleteSignUp from './CompleteSignUp';

export const accountState = atom<{
  status: 'initial' | 'loading' | 'success' | 'error';
  account: null | Account;
}>({
  key: 'accountState',
  default: {
    status: 'initial',
    account: null,
  },
});

export const useAccount = () => {
  const [user] = useAuthState(auth);
  const [account, setAccount] = useRecoilState(accountState);

  useEffect(() => {
    const fetchAccount = async () => {
      if (user && account.status === 'initial') {
        const token = await getAuthToken();

        if (!token) {
          throw new Error('Failed to fetch token');
        }

        setAccount({
          ...account,
          status: 'loading',
        });

        try {
          const res = await fetch('/api/accounts/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status !== 200) {
            setAccount({
              ...account,
              status: 'error',
            });
            return;
          }

          const accountRes = await res.json();
          setAccount({
            account: accountRes as Account,
            status: 'success',
          });
        } catch (error) {
          setAccount({
            ...account,
            status: 'error',
          });
          console.error(error);
        }
      }
    };

    fetchAccount();
  }, [account, setAccount, user]);
};

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [account] = useRecoilState(accountState);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  useAccount();

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return;
  }

  if (account.status === 'initial' || account.status === 'loading') {
    <div className="flex h-screen justify-center items-center">
      <Loading />
    </div>;
  }

  if (account.status === 'success') {
    return <>{children}</>;
  }

  if (account.status === 'error') {
    return <CompleteSignUp />;
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <Loading />
    </div>
  );
}
