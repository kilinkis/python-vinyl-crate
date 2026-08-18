import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Disc3, Edit3, Music2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { RecordItem } from '../types';

interface RecordCrateProps {
  records: RecordItem[];
  initialIndex?: number;
  onSelect?: (record: RecordItem, index: number) => void;
  onEdit?: (record: RecordItem) => void;
  onDelete?: (record: RecordItem) => void;
}

const MAX_BEHIND = 6;

const CONDITION_COLORS: Record<string, string> = {
  Mint: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
  'Near Mint': 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
  'VG+': 'bg-amber-950/80 text-amber-300 border-amber-700/60',
  VG: 'bg-orange-950/80 text-orange-300 border-orange-700/60',
  Good: 'bg-yellow-950/80 text-yellow-300 border-yellow-700/60',
  Fair: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
  Poor: 'bg-zinc-900 text-zinc-400 border-zinc-700',
};

export const RecordCrate: React.FC<RecordCrateProps> = ({
  records,
  initialIndex = 0,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [active, setActive] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(records.length - 1, 0))
  );

  // Keep active index in bounds when records list changes
  useEffect(() => {
    setActive((prev) => Math.min(Math.max(prev, 0), Math.max(records.length - 1, 0)));
  }, [records.length]);

  const clamp = useCallback(
    (n: number) => Math.min(Math.max(n, 0), records.length - 1),
    [records.length]
  );

  const go = useCallback(
    (dir: number) => setActive((i) => clamp(i + dir)),
    [clamp]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Announce / callback on change
  useEffect(() => {
    if (records[active]) onSelect?.(records[active], active);
  }, [active, records, onSelect]);

  // Wheel navigation (debounced)
  const wheelLock = useRef(false);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8 || wheelLock.current) return;
      wheelLock.current = true;
      go(delta > 0 ? 1 : -1);
      window.setTimeout(() => (wheelLock.current = false), 220);
    },
    [go]
  );

  // Drag navigation
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 64) {
      go(dx < 0 ? 1 : -1);
      drag.current = { x: e.clientX, moved: true };
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
  };

  const current = records[active];

  if (records.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-8 my-6">
      {/* 3D Stage */}
      <div
        className="relative flex w-full touch-none select-none items-end justify-center pt-8 pb-4"
        style={{ perspective: '1200px', perspectiveOrigin: '50% 32%' }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="listbox"
        aria-label="Record crate"
        aria-activedescendant={current ? `record-${current.id}` : undefined}
        tabIndex={0}
      >
        <div
          className="relative"
          style={{
            width: 'min(78vw, 340px)',
            height: 'min(86vw, 380px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {records.map((record, i) => {
            const rel = i - active;
            return (
              <Sleeve
                key={record.id}
                record={record}
                rel={rel}
                isActive={rel === 0}
                onClick={() => setActive(i)}
              />
            );
          })}
        </div>
      </div>

      {/* Active Record Info & Controls */}
      <div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="min-h-16 text-center" aria-live="polite">
          {current && (
            <>
              <div className="flex items-center justify-center gap-2 mb-1.5">
                {current.condition && (
                  <span
                    className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-bold shadow-md ${
                      CONDITION_COLORS[current.condition] || 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {current.condition}
                  </span>
                )}
                <span className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-zinc-300">
                  {current.release_year}
                </span>
                <span className="inline-flex items-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-extrabold text-amber-400">
                  ${current.price.toFixed(2)}
                </span>
              </div>

              <h2 className="font-heading text-2xl font-bold tracking-tight text-cream">
                {current.title}
              </h2>
              <p className="mt-0.5 text-sm font-medium text-cream/60">
                {current.artist}
              </p>
            </>
          )}
        </div>

        {/* Action Controls: Prev / Next + Edit / Delete */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-zinc-800/80">
          <NavButton
            label="Previous record"
            disabled={active === 0}
            onClick={() => go(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </NavButton>

          {/* Edit / Delete actions for active record */}
          {current && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit?.(current)}
                title="Edit record"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(current)}
                title="Delete record"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tabular-nums text-cream/50">
              {records.length ? `${active + 1} / ${records.length}` : '0 / 0'}
            </span>

            <NavButton
              label="Next record"
              disabled={active >= records.length - 1}
              onClick={() => go(1)}
            >
              <ChevronRight className="h-5 w-5" />
            </NavButton>
          </div>
        </div>

        <p className="text-center text-xs text-cream/35">
          Drag, mouse-wheel, arrow keys, or click sleeves to dig through your crate
        </p>
      </div>
    </div>
  );
};

function Sleeve({
  record,
  rel,
  isActive,
  onClick,
}: {
  record: RecordItem;
  rel: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  let transform: string;
  let opacity = 1;
  let zIndex = 100 - Math.abs(rel);
  let filter = 'none';

  if (rel === 0) {
    transform = 'translateY(-4%) translateZ(60px) rotateX(-8deg)';
  } else if (rel > 0) {
    const step = Math.min(rel, MAX_BEHIND);
    transform = `translateY(${-6 - step * 7}%) translateZ(${-step * 58}px) rotateX(-26deg) scale(${
      1 - step * 0.015
    })`;
    filter = `brightness(${Math.max(0.4, 1 - step * 0.12)})`;
    opacity = rel > MAX_BEHIND ? 0 : 1;
  } else {
    transform = 'translateY(60%) translateZ(220px) rotateX(78deg)';
    opacity = 0;
    zIndex = 0;
  }

  return (
    <button
      type="button"
      id={`record-${record.id}`}
      role="option"
      aria-selected={isActive}
      aria-label={`${record.title} by ${record.artist}`}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      className={cn(
        'absolute inset-0 cursor-pointer rounded-sm outline-none transition-all duration-500 ease-out',
        'focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-0'
      )}
      style={{
        transform,
        opacity,
        zIndex,
        filter,
        transformOrigin: '50% 100%',
        transformStyle: 'preserve-3d',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
      }}
    >
      {/* Vinyl Jacket Sleeve */}
      <div className="relative h-full w-full overflow-hidden rounded-md bg-zinc-900 shadow-2xl ring-1 ring-black/40">
        {record.cover_url && !imageError ? (
          <img
            src={record.cover_url}
            alt={`${record.title} album cover`}
            draggable={false}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover select-none"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 p-6 text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
              <Music2 className="h-7 w-7" />
            </div>
            <h4 className="font-heading line-clamp-1 text-sm font-bold text-zinc-100">{record.title}</h4>
            <p className="line-clamp-1 text-xs text-zinc-400">{record.artist}</p>
          </div>
        )}

        {/* Cardboard sheen texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 32%, rgba(0,0,0,0.35) 100%)',
          }}
        />

        {/* Vinyl disc peeking out top of active sleeve */}
        {isActive && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 aspect-square w-[86%] -translate-x-1/2 -translate-y-[46%] rounded-full vinyl-disc vinyl-grooves flex items-center justify-center shadow-2xl"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-1 flex items-center justify-center text-zinc-950 shadow-md">
              <Disc3 className="h-5 w-5 animate-spin-slow text-zinc-950" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

function NavButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 bg-cream/5 text-cream',
        'transition-all hover:bg-cream/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500'
      )}
    >
      {children}
    </button>
  );
}
