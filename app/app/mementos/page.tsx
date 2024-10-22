'use client';

import { Loading } from '@/components/Loading';
import { getMementos } from '@/lib/api/momento';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import MementoCard from './MementoCard';
import { accountState } from '@/components/ProtectedRoute';
import { MdPhotoLibrary } from 'react-icons/md';
import SearchComponent from './FloatingSearch';
import { mementosState, viewMementoState } from './recoil';
import FullMemento from './FullMemento';
import { Memento } from '@/schemas/memento';

export default function Timeline() {
  const [mementos, setMementos] = useRecoilState(mementosState);
  const [viewMemento, setViewMemento] = useRecoilState(viewMementoState);
  const [account] = useRecoilState(accountState);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);

  const fetchMementos = useCallback(async (page: number) => {
    try {
      const res = await getMementos(page);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const handleGetMementos = async () => {
      if (
        mementos.status !== 'initial' ||
        (mementos.results && mementos.results.hits.hits.length)
      ) {
        return;
      }

      setMementos({
        status: 'loading',
        results: null,
      });

      try {
        const initialRes = await fetchMementos(0);
        setMementos({
          status: 'success',
          results: initialRes,
        });

        if (window.innerHeight >= document.body.scrollHeight) {
          const res = await fetchMementos(1);

          const resHits = res.hits.hits;

          setMementos((prev) => ({
            status: 'success',
            results: {
              ...prev.results,
              hits: {
                hits: [...initialRes.hits.hits, ...resHits],
              },
              nbHits: res.nbHits,
              nbPages: res.nbPages,
              page: res.page,
            },
          }));
        }
      } catch (error) {
        console.error(error);
        setMementos({
          status: 'error',
          results: null,
        });
      }
    };

    handleGetMementos();
  }, [mementos.status, mementos.results?.hits.hits.length, fetchMementos]);

  useEffect(() => {
    if (viewMemento.memento) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [viewMemento]);

  const handleScroll = async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loadingMore &&
      mementos.results &&
      page < mementos.results.nbPages - 1
    ) {
      setLoadingMore(true);
      const nextPage = page + 1;

      try {
        const newMementos = await getMementos(nextPage);
        setMementos((prev) => ({
          status: 'success',
          results: {
            ...prev.results,
            hits: {
              hits: [
                ...(prev.results?.hits.hits || []),
                ...newMementos.hits.hits,
              ],
            },
            nbHits: newMementos.nbHits,
            nbPages: newMementos.nbPages,
            page: nextPage,
          },
        }));
        setPage(nextPage);
      } catch (error) {
        console.error('Error fetching more mementos:', error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadingMore, page, mementos.results]);

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

  const handleView = (memento: Memento, index: number) => {
    setViewMemento({
      memento,
      index,
    });
  };

  return (
    <div>
      <SearchComponent />
      <FullMemento />
      {mementos.status === 'success' &&
        mementos.results?.hits.hits.length === 0 && (
          <div className="text-foreground flex flex-col items-center space-y-4">
            <MdPhotoLibrary size={48} className="text-accent" />
            <h1 className="font-bold text-2xl">No mementos found.</h1>
            <p className="text-sm">
              You haven&apos;t added any momentos yet. Go to your life to get
              started.
            </p>
          </div>
        )}
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4`}
      >
        {mementos.status === 'success' &&
          mementos.results!.hits.hits.length > 0 && (
            <>
              {mementos.results!.hits.hits.map((memento, i) => (
                <MementoCard
                  memento={memento}
                  key={memento.uid}
                  account={account.account!}
                  handleView={handleView}
                  index={i}
                />
              ))}
            </>
          )}
      </div>
    </div>
  );
}
