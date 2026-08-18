import React, { useState } from 'react';
import { Edit3, Trash2, Disc3, Music2 } from 'lucide-react';
import { RecordItem } from '../types';

interface RecordCardProps {
  record: RecordItem;
  onEdit: (record: RecordItem) => void;
  onDelete: (record: RecordItem) => void;
}

const CONDITION_COLORS: Record<string, string> = {
  Mint: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
  'Near Mint': 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
  'VG+': 'bg-amber-950/80 text-amber-300 border-amber-700/60',
  VG: 'bg-orange-950/80 text-orange-300 border-orange-700/60',
  Good: 'bg-yellow-950/80 text-yellow-300 border-yellow-700/60',
  Fair: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
  Poor: 'bg-zinc-900 text-zinc-400 border-zinc-700',
};

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);
  const conditionStyle =
    CONDITION_COLORS[record.condition || ''] ||
    'bg-zinc-900/90 text-zinc-300 border-zinc-700';

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-amber-500/10">
      
      {/* Album Artwork & Sliding Vinyl Disc Container */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-zinc-950 shadow-inner">
        
        {/* Hidden Spinning Vinyl Record (Slides out on hover) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full vinyl-disc vinyl-grooves flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-1/3 group-hover:rotate-45 shadow-2xl">
          {/* Vinyl Label */}
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-1 flex items-center justify-center text-zinc-950 shadow-md">
            <Disc3 className="h-6 w-6 animate-spin-slow text-zinc-950" />
            {/* Center Spindle Hole */}
            <div className="absolute h-3 w-3 rounded-full bg-[#050608] border border-zinc-700" />
          </div>
        </div>

        {/* Album Cover Art / Fallback (Foreground Sleeve) */}
        <div className="relative z-10 h-full w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-900 shadow-md transition-transform duration-300 group-hover:scale-[0.98]">
          {record.cover_url && !imageError ? (
            <img
              src={record.cover_url}
              alt={`${record.title} by ${record.artist}`}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Retro Album Artwork Fallback */
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 p-6 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
                <Music2 className="h-8 w-8" />
              </div>
              <h4 className="font-heading line-clamp-1 text-base font-bold text-zinc-100">{record.title}</h4>
              <p className="line-clamp-1 text-xs font-medium text-zinc-400">{record.artist}</p>
            </div>
          )}

          {/* Glossy Overlay Sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between">
            {record.condition && (
              <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-bold shadow-md backdrop-blur-md ${conditionStyle}`}>
                {record.condition}
              </span>
            )}
            <span className="ml-auto inline-flex items-center rounded-lg border border-zinc-700/80 bg-zinc-950/80 px-2 py-0.5 text-xs font-bold text-zinc-300 shadow-md backdrop-blur-md">
              {record.release_year}
            </span>
          </div>
        </div>
      </div>

      {/* Album Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold tracking-tight text-white transition-colors group-hover:text-amber-300 line-clamp-1">
            {record.title}
          </h3>
          <p className="text-sm font-medium text-zinc-400 line-clamp-1 mt-0.5">
            {record.artist}
          </p>
        </div>

        {/* Footer: Price & Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-500 block leading-none">Est. Value</span>
            <span className="font-heading text-lg font-extrabold text-amber-400">
              ${record.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(record)}
              title="Edit record"
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-amber-300 transition-colors active:scale-95"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(record)}
              title="Delete from crate"
              className="rounded-lg p-2 text-zinc-400 hover:bg-rose-950/60 hover:text-rose-400 transition-colors active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
