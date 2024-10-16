'use client';

import { Loading } from '@/components/Loading';
import { getMementos, GetMementosResult } from '@/lib/api/momento';
import { LoadingState } from '@/schemas/loading';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import MementoCard from './MementoCard';
import { accountState } from '@/components/ProtectedRoute';
import { MdPhotoLibrary } from 'react-icons/md';
import SearchComponent from './FloatingSearch';

interface MementoState {
  status: LoadingState;
  results: GetMementosResult | null;
}

const mementosState = atom<MementoState>({
  key: 'mementosState',
  default: {
    status: 'initial',
    results: null,
  },
});

export default function Timeline() {
  const [mementos, setMementos] = useRecoilState(mementosState);
  const [account] = useRecoilState(accountState);

  useEffect(() => {
    const handleGetMementos = async () => {
      if (mementos.status !== 'initial' || mementos.results?.hits.hits.length) {
        return;
      }

      setMementos({
        status: 'loading',
        results: null,
      });

      try {
        const res = await getMementos(0);

        setMementos({
          status: 'success',
          results: res,
        });
      } catch (error) {
        console.error(error);
        setMementos({
          status: 'error',
          results: null,
        });
      }
    };

    handleGetMementos();
  }, [mementos.results?.hits.hits.length, mementos.status, setMementos]);

  if (mementos.status === 'loading') {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (mementos.status === 'error') {
    return (
      <div className="text-center text-accent">
        <p>
          An error occurred while fetching mementos. Please try again later.
        </p>
      </div>
    );
  }

  if (
    mementos.status === 'success' &&
    mementos.results?.hits.hits.length === 0
  ) {
    return (
      <div className="text-foreground flex flex-col items-center space-y-4">
        <MdPhotoLibrary size={48} className="text-accent" />
        <h1 className="font-bold text-2xl">No mementos found.</h1>
        <p className="text-sm">
          You haven&apos;t added any momentos yet. Go to your life to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <SearchComponent />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {mementos.status === 'success' &&
          mementos.results!.hits.hits.length > 0 && (
            <>
              {mementos.results!.hits.hits.map((memento) => (
                <MementoCard
                  memento={memento}
                  key={memento.uid}
                  account={account.account!}
                />
              ))}
            </>
          )}
      </div>
    </div>
  );
}
