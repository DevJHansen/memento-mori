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
      if (mementos.status !== 'initial' || mementos.results?.results.length) {
        return;
      }

      setMementos({
        status: 'loading',
        results: null,
      });

      try {
        const res = await getMementos(1);

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
  }, [mementos.results?.results.length, mementos.status, setMementos]);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-4 bg-backgroundLight max-w-xl rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Memento Timeline</h1>

        {mementos.status === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        )}

        {mementos.status === 'error' && (
          <div className="text-red-600 mb-4">
            <p>
              An error occurred while fetching mementos. Please try again later.
            </p>
          </div>
        )}

        {mementos.status === 'success' &&
          mementos.results!.results.length > 0 && (
            <div>
              {mementos.results!.results.map((memento) => (
                <MementoCard
                  memento={memento}
                  key={memento.uid}
                  account={account.account!}
                />
              ))}
            </div>
          )}

        {mementos.status === 'success' &&
          mementos.results?.results.length === 0 && (
            <div className="text-gray-600">
              <p>No mementos found.</p>
            </div>
          )}
      </div>
    </div>
  );
}