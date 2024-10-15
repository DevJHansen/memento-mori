'use client';

import { Loading } from '@/components/Loading';
import { getMementos, GetMementosResult } from '@/lib/api/momento';
import { LoadingState } from '@/schemas/loading';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import MementoCard from './MementoCard';
import { accountState } from '@/components/ProtectedRoute';

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {mementos.status === 'loading' && (
        <div className="flex items-center justify-center h-full">
          <Loading />
        </div>
      )}

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

      {mementos.status === 'success' &&
        mementos.results?.hits.hits.length === 0 && (
          <div className="text-foreground">
            <p>No mementos found.</p>
          </div>
        )}

      {mementos.status === 'error' && (
        <div className="text-red-600 mb-4">
          <p>
            An error occurred while fetching mementos. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
