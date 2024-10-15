'use client';

import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MdMenu, MdClose } from 'react-icons/md';
import { auth } from '@/lib/firebase/firebase';
import Avatar from './Avatar';
import Link from 'next/link';

export default function AuthNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);

  return (
    <nav className="bg-background shadow-foreground shadow-sm border-foreground sticky w-screen top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between w-full">
            <div className="text-background font-bold text-xl">
              <Avatar src={user?.photoURL} />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                  href="/app"
                >
                  Home
                </Link>
                <Link
                  className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                  href="/app/lifeline"
                >
                  Lifeline
                </Link>
                <Link
                  className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                  href="/app/mementos"
                >
                  Mementos
                </Link>
                <Link
                  className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                  href="/app/account"
                >
                  Account
                </Link>
                <button
                  className="hover:text-accent px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => signOut(auth)}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:text-accent"
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
          <Link
            className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium text-right w-full"
            href="/app"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium text-right w-full"
            href="/app/lifeline"
            onClick={() => setIsOpen(false)}
          >
            Lifeline
          </Link>
          <Link
            className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium text-right w-full"
            href="/app/mementos"
            onClick={() => setIsOpen(false)}
          >
            Mementos
          </Link>
          <Link
            className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium text-right w-full"
            href="/app/account"
            onClick={() => setIsOpen(false)}
          >
            Account
          </Link>
          <button
            className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium text-right w-full"
            onClick={() => signOut(auth)}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
