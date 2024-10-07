'use client';

import { useRecoilState } from 'recoil';
import { accountState } from '@/components/ProtectedRoute';
import { useEffect, useRef, useState } from 'react';
import { MdCheck, MdEvent } from 'react-icons/md';
import AddMomentModal, { addMomentState } from './AddMomentModal';

const LIFE_EXPECTANCY_YEARS = 75; // Average life expectancy
const WEEKS_IN_YEAR = 52.1775; // Including leap years
const LIFE_EXPECTANCY_WEEKS = LIFE_EXPECTANCY_YEARS * WEEKS_IN_YEAR;

const getWeeksLived = (birthTimestamp: number): number => {
  const currentDate = new Date();
  const birthDate = new Date(birthTimestamp);
  const diffInMilliseconds = currentDate.getTime() - birthDate.getTime();
  const weeksLived = diffInMilliseconds / (1000 * 60 * 60 * 24 * 7);
  return Math.floor(weeksLived);
};

export default function Grid() {
  const [account] = useRecoilState(accountState);
  const [weeksLived, setWeeksLived] = useState<number | null>(null);
  const currentWeekRef = useRef<HTMLDivElement | null>(null);
  const [, createMoment] = useRecoilState(addMomentState);

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
      lifeGrid.push(<div key={`spacer-${i}`} className="w-full h-6"></div>);
    }

    lifeGrid.push(
      <div
        ref={isCurrentWeek ? currentWeekRef : null}
        key={`week-${i}`}
        className={`p-[1px] cursor-pointer hover:bg-secondary rounded-full flex items-center justify-center m-1 ${
          isLived
            ? 'bg-accent text-background'
            : 'bg-foreground hover:text-secondary'
        } ${isCurrentWeek && 'text-secondary hover:text-foreground'}`}
        onClick={() => {
          if (isLived || isCurrentWeek) {
            createMoment(true);
          }
        }}
      >
        {isCurrentWeek ? (
          <MdEvent
            size={10}
            className={`${isLived ? '' : ' text-inherit font-extrabold'}`}
          />
        ) : (
          <MdCheck
            size={10}
            className={`${isLived ? '' : ' text-inherit font-extrabold'}`}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <AddMomentModal />
      <div className="max-h-[calc(100vh_-_12rem)] overflow-scroll pb-8">
        <div className="flex flex-wrap ">{lifeGrid}</div>
      </div>
    </>
  );
}
