'use client';

import { auth, googleProvider } from '@/lib/firebase/firebase';
import Link from 'next/link';
import { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      router.push('/app');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-background shadow-foreground shadow-sm fixed w-screen top-0">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between w-full">
            <div className="text-foreground hover:text-accent font-bold text-xl">
              <Link href="/">Memento Mori</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user ? (
                  <Link
                    className="text-foreground hover:text-accent  px-3 py-2 rounded-md text-sm font-medium"
                    href="/app"
                  >
                    Home
                  </Link>
                ) : (
                  <button
                    className="text-foreground hover:text-accent  px-3 py-2 rounded-md text-sm font-medium"
                    onClick={signIn}
                  >
                    Sign In
                  </button>
                )}
                {user && (
                  <button
                    className="text-foreground hover:text-accent  px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => signOut(auth)}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none focus:text-accent"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              {!isOpen ? <MdMenu size={24} /> : <MdClose size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-right">
          {user ? (
            <Link
              className="text-foreground hover:text-accent  block px-3 py-2 rounded-md text-base font-medium"
              href="/app"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          ) : (
            <button
              className="text-foreground hover:text-accent  block px-3 py-2 rounded-md text-base font-medium"
              onClick={signIn}
            >
              Sign In
            </button>
          )}
          {user && (
            <button
              className="text-foreground hover:text-accent  block px-3 py-2 rounded-md text-base font-medium text-right w-full"
              onClick={() => signOut(auth)}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
