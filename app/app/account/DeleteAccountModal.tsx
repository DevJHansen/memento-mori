'use client';

import Modal from '@/components/Modal';
import { atom, useRecoilState } from 'recoil';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { Button } from '@/components/Button';
import { getAuthToken } from '@/lib/firebase/auth';

export const deleteAccountState = atom<boolean>({
  key: 'deleteAccountState',
  default: false,
});

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useRecoilState(deleteAccountState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Unable to retrieve authentication token.');
      }

      fetch('/api/accounts/me', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete account', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-4">
          <Button
            onClick={() => setIsOpen(false)}
            text="Cancel"
            outline={true}
          />

          <Button onClick={handleDelete} disabled={isLoading} text="Delete" />
        </div>
      </div>
    </Modal>
  );
}
