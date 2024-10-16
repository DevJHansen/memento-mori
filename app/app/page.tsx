'use client';

import { useRecoilState } from 'recoil';
import { accountState } from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import {
  getWeeksLived,
  getLifePercentage,
  getWeeksRemaining,
  LIFE_EXPECTANCY_WEEKS,
} from '@/utils/lifeUtils';

Chart.register(ArcElement);

const cssVar = (name: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-background rounded-full h-4 mb-4">
      <div
        className="bg-accent h-4 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

function LifePercentagePie({ percentage }: { percentage: number }) {
  const data = {
    labels: ['Life Lived', 'Remaining'],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [cssVar('--background'), cssVar('--accent')],
        borderWidth: 0,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0 max-h-screen overflow-auto">
      {/* Weeks Lived */}
      {weeksLived !== null && (
        <div className="h-fit p-6 bg-backgroundSecondary rounded-lg shadow-md text-center">
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
        <div className="h-fit p-6 bg-backgroundSecondary rounded-lg shadow-md text-center">
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
        <div className="h-fit p-6 bg-backgroundSecondary rounded-lg shadow-md text-center flex items-center flex-col">
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
