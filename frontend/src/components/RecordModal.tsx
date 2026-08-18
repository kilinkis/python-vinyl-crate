import React, { useState, useEffect } from 'react';
import { X, Disc, Image as ImageIcon, Sparkles } from 'lucide-react';
import { RecordItem, RecordCreateInput } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordCreateInput) => Promise<void>;
  editingRecord?: RecordItem | null;
}

const CONDITIONS = ['Mint', 'Near Mint', 'VG+', 'VG', 'Good', 'Fair', 'Poor'];

const SAMPLE_COVERS = [
  {
    name: 'Daft Punk - RAM',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    year: 2013,
    price: 45.0,
    condition: 'Mint',
    url: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg',
  },
  {
    name: 'Miles Davis - Kind of Blue',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    year: 1959,
    price: 60.0,
    condition: 'Near Mint',
    url: 'https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg',
  },
  {
    name: 'Pink Floyd - Dark Side',
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    year: 1973,
    price: 75.0,
    condition: 'VG+',
    url: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png',
  },
  {
    name: 'Fleetwood Mac - Rumours',
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    year: 1977,
    price: 38.0,
    condition: 'Near Mint',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG',
  },
];

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRecord,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [condition, setCondition] = useState<string>('Mint');
  const [price, setPrice] = useState<string>('25.00');
  const [coverUrl, setCoverUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRecord) {
      setTitle(editingRecord.title);
      setArtist(editingRecord.artist);
      setReleaseYear(editingRecord.release_year);
      setCondition(editingRecord.condition || 'Mint');
      setPrice(editingRecord.price.toString());
      setCoverUrl(editingRecord.cover_url || '');
    } else {
      setTitle('');
      setArtist('');
      setReleaseYear(new Date().getFullYear());
      setCondition('Mint');
      setPrice('25.00');
      setCoverUrl('');
    }
    setError(null);
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (sample: typeof SAMPLE_COVERS[0]) => {
    setTitle(sample.title);
    setArtist(sample.artist);
    setReleaseYear(sample.year);
    setPrice(sample.price.toString());
    setCondition(sample.condition);
    setCoverUrl(sample.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Please enter a valid non-negative price');
      return;
    }

    if (!title.trim() || !artist.trim()) {
      setError('Title and Artist are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        artist: artist.trim(),
        release_year: Number(releaseYear),
        condition,
        price: parsedPrice,
        cover_url: coverUrl.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Disc className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">
                {editingRecord ? 'Edit Vinyl Record' : 'Add Vinyl to Crate'}
              </h2>
              <p className="text-xs text-zinc-400">
                {editingRecord ? 'Update your album specs & condition' : 'Catalog a new LP in your collection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Sample Selector (When creating new) */}
        {!editingRecord && (
          <div className="mt-4 p-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Quick Sample Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_COVERS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleApplyPreset(sample)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Album Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Random Access Memories"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Artist */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Artist / Band *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Daft Punk"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Release Year */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Release Year *
              </label>
              <input
                type="number"
                required
                min={1880}
                max={2100}
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Price (USD $) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Cover Art URL with Live Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Album Artwork URL (Optional)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                placeholder="https://... image link"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {/* Mini Preview Thumbnail */}
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-zinc-600" />
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all disabled:opacity-50"
            >
              <Disc className={`h-4 w-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Saving...' : editingRecord ? 'Update Vinyl' : 'Add to Crate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
