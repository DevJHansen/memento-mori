'use client';

import { useState } from 'react';
import Stats from './(stats)/Stats';
import Grid from './(grid)/Grid';

export default function AppPage() {
  const [view, setView] = useState<'stats' | 'grid'>('stats');
  return (
    <div className="lg:px-32 md:px-24 px-12">
      <div className="flex mt-24 mb-6">
        <button
          onClick={() => setView('stats')}
          className={`px-4 py-2 mx-2 font-bold rounded-md ${
            view === 'stats'
              ? 'bg-accent text-white'
              : 'bg-foreground text-background'
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setView('grid')}
          className={`px-4 py-2 mx-2 font-bold rounded-md ${
            view === 'grid'
              ? 'bg-accent text-white'
              : 'bg-foreground text-background'
          }`}
        >
          Life Grid
        </button>
      </div>
      {view === 'stats' && <Stats />}
      {view === 'grid' && <Grid />}
    </div>
  );
}
