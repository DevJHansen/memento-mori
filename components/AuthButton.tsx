'use client';

import { auth, googleProvider } from '@/lib/firebase/firebase';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  className: string;
}

export default function AuthButton({ className }: Props) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return (
      <Link href="/dashboard">
        <Button text={'Go to Dashboard'} className={className} />
      </Link>
    );
  }

  return (
    <Button
      text={'Sign In with Google'}
      onClick={signIn}
      className={className}
    />
  );
}
