import React from 'react';
import { Disc, DollarSign, Sparkles, Calendar } from 'lucide-react';
import { RecordItem } from '../types';

interface StatsBannerProps {
  records: RecordItem[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ records }) => {
  const totalRecords = records.length;
  const totalValue = records.reduce((acc, r) => acc + (r.price || 0), 0);
  const avgPrice = totalRecords > 0 ? totalValue / totalRecords : 0;

  const years = records.map((r) => r.release_year).filter(Boolean);
  const earliestYear = years.length > 0 ? Math.min(...years) : null;
  const latestYear = years.length > 0 ? Math.max(...years) : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      {/* Total Records */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-5 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Albums</p>
            <h3 className="font-heading mt-1 text-2xl sm:text-3xl font-extrabold text-white">{totalRecords}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Disc className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
      </div>

      {/* Total Crate Value */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-5 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Crate Value</p>
            <h3 className="font-heading mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-400">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
      </div>

      {/* Avg Album Price */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-5 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Avg Value / Disc</p>
            <h3 className="font-heading mt-1 text-2xl sm:text-3xl font-extrabold text-amber-300">
              ${avgPrice.toFixed(2)}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
      </div>

      {/* Era / Year Span */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-5 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Pressing Span</p>
            <h3 className="font-heading mt-1 text-xl sm:text-2xl font-extrabold text-zinc-200">
              {earliestYear && latestYear ? (
                earliestYear === latestYear ? `${earliestYear}` : `${earliestYear} – ${latestYear}`
              ) : (
                '—'
              )}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};
