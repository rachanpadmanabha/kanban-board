import React from 'react';
import type { BoardStat } from '../hooks/useBoardStats';

interface BoardStatsProps {
  readonly stats: readonly BoardStat[];
}

export const BoardStats: React.FC<BoardStatsProps> = ({ stats }) => (
  <section
    aria-label="Board summary"
    className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-5 shrink-0 relative z-10"
  >
    {stats.map((stat) => (
      <div key={stat.id} className="glass-card rounded-DEFAULT px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
          {stat.label}
        </p>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className={`text-2xl font-bold tracking-tight ${stat.tone}`}>{stat.value}</span>
          <span className="text-[11px] text-on-surface-variant">{stat.detail}</span>
        </div>
      </div>
    ))}
  </section>
);
