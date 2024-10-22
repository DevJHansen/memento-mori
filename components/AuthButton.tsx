'use client';

import { auth, googleProvider } from '@/lib/firebase/firebase';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { FcGoogle } from 'react-icons/fc';

interface Props {
  className: string;
}

export default function AuthButton({ className }: Props) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      router.push('/app');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return (
      <Link href="/app">
        <Button text={'Go to App'} className={className} />
      </Link>
    );
  }

  return (
    <Button text={'Get Started'} onClick={signIn} className={className}>
      <FcGoogle className="bg-foreground rounded-full ml-2" />
    </Button>
  );
}
