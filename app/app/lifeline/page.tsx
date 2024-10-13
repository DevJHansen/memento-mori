'use client';

import { atom, useRecoilState } from 'recoil';
import { accountState } from '@/components/ProtectedRoute';
import { useEffect, useRef, useState } from 'react';
import { MdCheck, MdLocationPin } from 'react-icons/md';
import AddMementoModal, { addMementoState } from './AddMementoModal';
import { MementoCache } from '@/schemas/memento';
import { LoadingState } from '@/schemas/loading';
import { Loading } from '@/components/Loading';
import { DotImage } from './DotImage';
import { format } from 'date-fns';
import { getMementoCache } from '@/lib/api/momento';
import { FormFieldLabel } from '@/components/FormFieldLabel';
import {
  getDateFromWeek,
  getWeeksLived,
  LIFE_EXPECTANCY_WEEKS,
} from '@/utils/lifeUtils';
import Tooltip from '@/components/Tooltip';

interface MementoCacheState {
  status: LoadingState;
  cache: null | MementoCache;
}

export const mementoCacheState = atom<MementoCacheState>({
  key: 'mementoCacheState',
  default: {
    status: 'initial',
    cache: null,
  },
});

export default function Grid() {
  const [account] = useRecoilState(accountState);
  const [weeksLived, setWeeksLived] = useState<number | null>(null);
  const currentWeekRef = useRef<HTMLDivElement | null>(null);
  const [, createMemento] = useRecoilState(addMementoState);
  const [cache, setCache] = useRecoilState(mementoCacheState);
  const [scale, setScale] = useState(8);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCache = async () => {
      if (cache.status === 'loading') {
        return;
      }

      setCache({
        status: 'loading',
        cache: null,
      });

      try {
        const res = await getMementoCache();

        setCache({
          status: 'success',
          cache: res,
        });
      } catch (error) {
        console.error(error);
        setCache({
          status: 'error',
          cache: null,
        });
      }
    };

    if (cache.status === 'initial' && account.account !== null) {
      getCache();
    }
  }, [account.account, cache.status, setCache]);

  useEffect(() => {
    if (account.account?.dob) {
      const weeks = getWeeksLived(account.account?.dob.unix);
      setWeeksLived(weeks);
    }
  }, [account]);

  useEffect(() => {
    if (currentWeekRef.current) {
      currentWeekRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [weeksLived]);

  if (!account || weeksLived === null) {
    return null;
  }

  const lifeGrid = [];
  for (let i = 0; i < LIFE_EXPECTANCY_WEEKS; i++) {
    const isLived = i < weeksLived;
    const isCurrentWeek = i === weeksLived;

    const decade = Math.floor(i / 520) * 10;
    const displayDecade = decade + 1;
    const endDecade = decade + 10 > 70 ? 75 : decade + 10;

    if (i > 0 && i % 520 === 0) {
      lifeGrid.push(
        <div key={`spacer-${i}`} className="w-full">
          <h3 className="my-4 text-xs">{`${displayDecade} - ${endDecade}`}</h3>
        </div>
      );
    }

    lifeGrid.push(
      <Tooltip
        text={`${getDateFromWeek(account!.account!.dob.unix, i)}`}
        key={`week-${i}`}
        parentRef={gridRef}
      >
        <div
          ref={isCurrentWeek ? currentWeekRef : null}
          className={`p-[1px] cursor-pointer hover:bg-secondary z-0 rounded-full flex items-center justify-center m-1 ${
            isLived
              ? 'bg-accent text-background'
              : 'bg-foreground hover:text-secondary'
          } ${
            isCurrentWeek &&
            'text-secondary hover:text-foreground hover:bg-secondary'
          }`}
          onClick={() => {
            if (isLived || isCurrentWeek) {
              createMemento({
                isOpen: true,
                week: i.toString(),
                title:
                  cache.cache !== null && cache.cache[i]
                    ? cache.cache[i].title
                    : '',
                mementoId:
                  cache.cache !== null && cache.cache[i]
                    ? cache.cache[i].mementoId
                    : '',
                mementoDate: getDateFromWeek(account!.account!.dob.unix, i),
              });
            }
          }}
        >
          {cache.cache !== null && cache.cache[i] && (
            <DotImage
              url={cache.cache[i].heroImage}
              alt={`week-icon`}
              scale={scale}
            />
          )}
          {isCurrentWeek && !(cache.cache && cache.cache[i]) && (
            <MdLocationPin
              size={scale}
              className={`${isLived ? '' : ' text-inherit font-extrabold'}`}
            />
          )}
          {!isCurrentWeek && !(cache.cache && cache.cache[i]) && (
            <MdCheck
              size={scale}
              className={`${isLived ? '' : ' text-inherit font-extrabold'}`}
            />
          )}
        </div>
      </Tooltip>
    );
  }

  if (cache.status === 'initial' || cache.status === 'loading') {
    return (
      <div className="flex h-[calc(100vh_-_12rem)] justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <AddMementoModal />
      <div className="mb-4">
        <div className="mb-6">
          <h2 className="text-2xl">{account.account!.firstName}'s Lifeline.</h2>
          <p className="py-2 text-xs text-gray-400">
            Life is a collection of moments. The lifeline divides an average
            lifespan of 75 years into weekly circles. Click on a circle to add a
            memento—images and text that capture your experiences. As you fill
            in each week, you "colour in" your life grid, creating a vivid
            tapestry of your journey.
          </p>
        </div>
        <FormFieldLabel label="Icon Size" id="slider" />
        <input
          type="range"
          min="1"
          max="48"
          step="1"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-48"
        />
      </div>
      <div
        className="max-h-[calc(100vh_-_12rem)] overflow-y-auto pb-8"
        ref={gridRef}
      >
        <h3 className="mb-4 text-xs">0 - 10</h3>
        <div className="flex flex-wrap">{lifeGrid}</div>
      </div>
    </>
  );
}
