'use client';

import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { accountState } from '@/components/ProtectedRoute';
import StorageUsage from '@/components/StorageUsage';
import { auth } from '@/lib/firebase/firebase';
import { format } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import DeleteAccount, { deleteAccountState } from './DeleteAccountModal';

export default function Account() {
  const [user] = useAuthState(auth);
  const [account] = useRecoilState(accountState);
  const [, setIsOpen] = useRecoilState(deleteAccountState);

  return (
    <div className="flex flex-col items-center justify-around  w-full h-[calc(100vh_-_8rem)]  rounded pb-8 px-8">
      <DeleteAccount />
      <div className=" flex flex-col items-center">
        <Avatar src={user!.photoURL} size={56} />
        <h2 className="text-xl md:text-2xl lg:text-4xl mt-8 font-bold">{`${
          account.account!.firstName
        } ${account.account!.surname}`}</h2>
        <p className="lg:text-md md:text-sm text-xs pt-2">
          User since -{' '}
          {format(new Date(account.account!.createdAt.unix), 'MMM dd, yyyy')}
        </p>
      </div>
      <Button
        text="Delete Account"
        className="my-4"
        onClick={() => setIsOpen(true)}
      />
      <StorageUsage
        usedSpace={account.account!.storageUsage.bytesUsed}
        totalSpace={account.account!.storageUsage.maxUsage}
      />
    </div>
  );
}
