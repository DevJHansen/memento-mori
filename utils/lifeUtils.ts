import { format } from 'date-fns';

const LIFE_EXPECTANCY_YEARS = 75;
const WEEKS_IN_YEAR = 52.1775;
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
