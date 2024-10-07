'use client';

import { useRecoilState } from 'recoil';
import { accountState } from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

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

const getLifePercentage = (weeksLived: number): number => {
  return (weeksLived / LIFE_EXPECTANCY_WEEKS) * 100;
};

const getWeeksRemaining = (weeksLived: number): number => {
  return Math.floor(LIFE_EXPECTANCY_WEEKS - weeksLived);
};

// Progress Bar for Weeks Lived and Remaining
function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-foreground rounded-full h-4 mb-4">
      <div
        className="bg-accent h-4 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

// Pie chart for Life Percentage
function LifePercentagePie({ percentage }: { percentage: number }) {
  const data = {
    labels: ['Life Lived', 'Remaining'],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#d3edfd', '#f74922'],
        borderColor: ['#011823', '#980656'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-32 h-32">
      <Pie data={data} options={options} />
    </div>
  );
}

export default function Stats() {
  const [account] = useRecoilState(accountState);
  const [weeksLived, setWeeksLived] = useState<number | null>(null);
  const [lifePercentage, setLifePercentage] = useState<number | null>(null);
  const [weeksRemaining, setWeeksRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (account.account?.dob) {
      const weeks = getWeeksLived(account.account?.dob.unix);
      setWeeksLived(weeks);
      setLifePercentage(getLifePercentage(weeks));
      setWeeksRemaining(getWeeksRemaining(weeks));
    }
  }, [account]);

  if (!account) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0 max-h-screen overflow-scroll">
      {/* Weeks Lived */}
      {weeksLived !== null && (
        <div className="h-fit p-6 bg-backgroundLight rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-4">Weeks Lived</h3>
          <ProgressBar
            percentage={(weeksLived / LIFE_EXPECTANCY_WEEKS) * 100}
          />
          <p className="text-3xl font-bold text-foreground">{weeksLived}</p>
          <p className="text-sm text-accent">
            Out of {Math.floor(LIFE_EXPECTANCY_WEEKS)} weeks
          </p>
        </div>
      )}

      {/* Weeks Remaining */}
      {weeksRemaining !== null && (
        <div className="h-fit p-6 bg-backgroundLight rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-4">Weeks Remaining</h3>
          <ProgressBar
            percentage={(weeksRemaining / LIFE_EXPECTANCY_WEEKS) * 100}
          />
          <p className="text-3xl font-bold text-foreground">{weeksRemaining}</p>
          <p className="text-sm text-accent">Weeks to go</p>
        </div>
      )}

      {/* Life Percentage */}
      {lifePercentage !== null && (
        <div className="h-fit p-6 bg-backgroundLight rounded-lg shadow-md text-center flex items-center flex-col">
          <h3 className="text-xl font-semibold mb-4">Life Percentage</h3>
          <LifePercentagePie percentage={lifePercentage} />
          <p className="text-3xl font-bold text-foreground mt-4">
            {lifePercentage.toFixed(1)}%
          </p>
          <p className="text-sm text-accent">of life lived</p>
        </div>
      )}
    </div>
  );
}
