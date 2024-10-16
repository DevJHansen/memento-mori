import { format } from 'date-fns';

const LIFE_EXPECTANCY_YEARS = 75;
const WEEKS_IN_YEAR = 52.1775;
const MILLISECONDS_IN_WEEK = 604800000;
const MILLISECONDS_IN_YEAR = 31556952000;
export const LIFE_EXPECTANCY_WEEKS = LIFE_EXPECTANCY_YEARS * WEEKS_IN_YEAR;

export const getLifePercentage = (weeksLived: number): number => {
  return (weeksLived / LIFE_EXPECTANCY_WEEKS) * 100;
};

export const getWeeksRemaining = (weeksLived: number): number => {
  return Math.floor(LIFE_EXPECTANCY_WEEKS - weeksLived);
};

export const getWeeksLived = (birthTimestamp: number): number => {
  const currentDate = new Date();
  const birthDate = new Date(birthTimestamp);
  const diffInMilliseconds = currentDate.getTime() - birthDate.getTime();
  const weeksLived = diffInMilliseconds / (1000 * 60 * 60 * 24 * 7);
  return Math.floor(weeksLived);
};

export const getDateFromWeek = (dobUnix: number, week: number) => {
  return format(new Date(dobUnix + 604800000 * week), 'MMM dd, yyyy');
};

export const getWeekFromDate = (
  dobUnix: number,
  date: number,
  roundDirection: 'up' | 'down'
) => {
  const dif = date - dobUnix;
  let difToWeeks: number;

  if (roundDirection === 'down') {
    difToWeeks = Math.floor(dif / MILLISECONDS_IN_WEEK);
  } else {
    difToWeeks = Math.ceil(dif / MILLISECONDS_IN_WEEK);
  }

  return difToWeeks;
};

export const millisecondsToYears = (milliseconds: number) => {
  return Math.floor(milliseconds / MILLISECONDS_IN_YEAR);
};
