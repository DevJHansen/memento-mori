'use client';

import { atom, useRecoilState } from 'recoil';
import { accountState } from '@/components/ProtectedRoute';
import { useEffect, useRef, useState } from 'react';
import { MdCheck, MdEvent } from 'react-icons/md';
import AddMomentModal, { addMomentState } from './AddMomentModal';
import { getWeeksLived, LIFE_EXPECTANCY_WEEKS } from '../(utils)/utils';
import { MomentCache } from '@/schemas/moment';
import { getAuthToken } from '@/lib/firebase/auth';
import { LoadingStatus } from '@/schemas/loading';
import { Loading } from '@/components/Loading';
import Image from 'next/image';
import { fetchImage } from '@/lib/firebase/storage';
import Hammer from 'hammerjs';

interface MomentCacheState {
  status: LoadingStatus;
  cache: null | MomentCache;
}

export const momentCacheState = atom<MomentCacheState>({
  key: 'momentCacheState',
  default: {
    status: 'initial',
    cache: null,
  },
});

const DotImage = ({
  url,
  alt,
  scale,
}: {
  url: string;
  alt: string;
  scale: number;
}) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      const authUrl = await fetchImage(url);
      setImageUrl(authUrl ?? '');
    };
    loadImage();
  }, [url]);

  return imageUrl ? (
    <Image
      src={imageUrl}
      alt={alt}
      width={scale}
      height={scale}
      className="rounded-full"
    />
  ) : (
    <div
      className={`w-[${scale}px] h-[${scale}px] bg-primary rounded-full animate-ping`}
    />
  );
};

export default function Grid() {
  const [account] = useRecoilState(accountState);
  const [weeksLived, setWeeksLived] = useState<number | null>(null);
  const currentWeekRef = useRef<HTMLDivElement | null>(null);
  const [, createMoment] = useRecoilState(addMomentState);
  const [cache, setCache] = useRecoilState(momentCacheState);
  const [scale, setScale] = useState(1);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const gridElement = gridRef.current;

    if (gridElement) {
      const hammer = new Hammer(gridElement);

      hammer.get('pinch').set({ enable: true });

      let lastScale = 1;

      hammer.on('pinch', (event) => {
        let newScale = lastScale * event.scale;

        if (newScale > 48) newScale = 48;
        if (newScale < 1) newScale = 1;

        setScale(newScale);
      });

      hammer.on('pinchend', () => {
        lastScale = scale;
      });

      return () => {
        hammer.off('pinch pinchend');
      };
    }
  }, [scale]);

  useEffect(() => {
    const getCache = async () => {
      if (cache.status === 'loading') {
        return;
      }

      setCache({
        status: 'loading',
        cache: null,
      });

      const token = await getAuthToken();

      if (!token) {
        throw new Error('Failed to fetch token');
      }

      const res = await fetch('/api/moments/cache', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setCache({
          status: 'success',
          cache: await res.json(),
        });
        return;
      }

      setCache({
        status: 'error',
        cache: null,
      });
    };

    if (cache.status === 'initial' && account.account !== null) {
      getCache();
    }
  }, [account.account, cache.status]);

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

    if (i > 0 && i % 520 === 0) {
      lifeGrid.push(<div key={`spacer-${i}`} className="w-full h-4"></div>);
    }

    lifeGrid.push(
      <div
        ref={isCurrentWeek ? currentWeekRef : null}
        key={`week-${i}`}
        className={`p-[1px] cursor-pointer hover:bg-secondary z-0 rounded-full flex items-center justify-center m-1 ${
          isLived
            ? 'bg-accent text-background'
            : 'bg-foreground hover:text-secondary'
        } ${isCurrentWeek && 'text-secondary hover:text-background'}`}
        onClick={() => {
          if (isLived || isCurrentWeek) {
            createMoment({
              isOpen: true,
              week: i.toString(),
            });
          }
        }}
      >
        {cache.cache !== null && cache.cache[`${i}`] && (
          <DotImage
            url={cache.cache[i].heroImage}
            alt={`week-icon`}
            scale={scale}
          />
        )}
        {isCurrentWeek && !(cache.cache && cache.cache[`${i}`]) && (
          <MdEvent
            size={scale}
            className={`${isLived ? '' : ' text-inherit font-extrabold'}`}
          />
        )}
        {!isCurrentWeek && !(cache.cache && cache.cache[`${i}`]) && (
          <MdCheck
            size={scale}
            className={`${isLived ? '' : ' text-inherit font-extrabold'}`}
          />
        )}
      </div>
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
      <AddMomentModal />
      <div className="mb-4">
        <input
          type="range"
          min="1"
          max="48"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-48"
        />
      </div>
      <div className="max-h-[calc(100vh_-_12rem)] overflow-scroll pb-8">
        <div className="flex flex-wrap ">{lifeGrid}</div>
      </div>
    </>
  );
}
