'use client';

import { useRecoilState } from 'recoil';
import { accountState } from '@/components/ProtectedRoute';
import { useEffect, useRef, useState } from 'react';
import AddMementoModal, { addMementoState } from './AddMementoModal';
import { Loading } from '@/components/Loading';
import { DotImage } from './DotImage';
import { getMementoCache } from '@/lib/api/momento';
import {
  getDateFromWeek,
  getWeekFromDate,
  getWeeksLived,
  LIFE_EXPECTANCY_WEEKS,
  millisecondsToYears,
} from '@/utils/lifeUtils';
import Tooltip from '@/components/Tooltip';
import { mementoCacheState } from './recoil';
import ScaleControl from './ScaleControl';
import ToolsComponent from './FloatingTools';

const getHeading = (age: number) => {
  console.log(age);
  if (age >= 0 && age <= 9) {
    return '0 - 9';
  }
  if (age >= 10 && age <= 19) {
    return '10 - 19';
  }
  if (age >= 20 && age <= 29) {
    return '20 - 29';
  }
  if (age >= 30 && age <= 39) {
    return '30 - 39';
  }
  if (age >= 40 && age <= 49) {
    return '40 - 49';
  }
  if (age >= 50 && age <= 59) {
    return '50 - 59';
  }
  if (age >= 60 && age <= 69) {
    return '60 - 69';
  }

  return '70 - 75';
};

export default function Grid() {
  const [account] = useRecoilState(accountState);
  const [weeksLived, setWeeksLived] = useState<number | null>(null);
  const currentWeekRef = useRef<HTMLDivElement | null>(null);
  const [, createMemento] = useRecoilState(addMementoState);
  const [cache, setCache] = useRecoilState(mementoCacheState);
  const [scale, setScale] = useState(12);
  const [topHeading, setTopHeading] = useState('0 - 9');
  const gridRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState({
    week: 0,
    date: '',
  });
  const [endDate, setEndDate] = useState({
    week: LIFE_EXPECTANCY_WEEKS,
    date: '',
  });

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

  const handleSetStartDate = (date: string) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return;
    }

    const dateToUnix = +parsedDate;

    const week = getWeekFromDate(account.account!.dob.unix, dateToUnix, 'down');
    const age = millisecondsToYears(dateToUnix - account.account!.dob.unix);

    setTopHeading(getHeading(age));

    setStartDate({
      week: week,
      date,
    });
  };

  const handleSetEndDate = (date: string) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return;
    }

    const dateToUnix = +parsedDate;

    const week = getWeekFromDate(account.account!.dob.unix, dateToUnix, 'up');

    setEndDate({
      week: week,
      date,
    });
  };

  const handleResetFilter = () => {
    setTopHeading('0 - 9');

    setStartDate({
      week: 0,
      date: '',
    });
    setEndDate({
      week: LIFE_EXPECTANCY_WEEKS,
      date: '',
    });
  };

  const lifeGrid = [];
  for (let i = 0; i < LIFE_EXPECTANCY_WEEKS; i++) {
    if (i < startDate.week) {
      continue;
    }
    if (i > endDate.week) {
      continue;
    }

    const isLived = i < weeksLived;
    const isCurrentWeek = i === weeksLived;

    const decade = Math.floor(i / 520) * 10;
    const displayDecade = decade;
    const endDecade = decade + 10 > 70 ? 75 : decade + 9;

    if (i > 0 && i % 520 === 0) {
      lifeGrid.push(
        <div key={`spacer-${i}`} className="w-full">
          <h3 className="my-4 text-xs">{`${displayDecade} - ${endDecade}`}</h3>
        </div>
      );
    }

    const hasMemento = cache.cache !== null && cache.cache[i];

    const isLivedBg = 'bg-foreground';
    const notIsLivedBg = 'bg-background';
    const currentWeekBg = 'bg-accent';

    lifeGrid.push(
      <Tooltip
        text={`${getDateFromWeek(account!.account!.dob.unix, i)}`}
        key={`week-${i}`}
        parentRef={gridRef}
      >
        <div
          style={{ width: `${scale}px`, height: `${scale}px` }}
          ref={isCurrentWeek ? currentWeekRef : null}
          className={`cursor-pointer hover:bg-accentSecondary z-0 rounded-sm flex items-center justify-center m-[2px] ${
            isLived && !isCurrentWeek && isLivedBg
          } ${!isLived && !isCurrentWeek && notIsLivedBg} ${
            isCurrentWeek && currentWeekBg
          } ${hasMemento ? 'border-0' : 'border-[1px] border-foreground'}`}
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
        </div>
      </Tooltip>
    );
  }

  if (cache.status === 'initial' || cache.status === 'loading') {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <AddMementoModal />
      <ScaleControl scale={scale} setScale={setScale} />
      <ToolsComponent
        startDate={startDate.date}
        endDate={endDate.date}
        setStartDate={handleSetStartDate}
        setEndDate={handleSetEndDate}
        handleReset={handleResetFilter}
      />
      <div className="mb-4">
        <div className="relative">
          <div className="mb-6 bg-background z-20 w-full">
            <h2 className="text-2xl">
              {account.account!.firstName}&apos;s Calendar.
            </h2>
            <p className="py-2 text-xs text-foreground">
              Life is a collection of moments. The calendar divides an average
              lifespan of 75 years into weekly squares. Click on a square to add
              a memento—image and text that capture your experiences. As you
              fill in each week, you{' '}
              <u className="text-accent">&quot;colour in&quot;</u> your
              calendar, creating a vivid tapestry of your journey.
            </p>
          </div>
        </div>
      </div>
      <div className="pb-8" ref={gridRef}>
        <h3 className="mb-4 text-xs">{topHeading}</h3>
        <div className="flex flex-wrap">{lifeGrid}</div>
      </div>
    </>
  );
}
