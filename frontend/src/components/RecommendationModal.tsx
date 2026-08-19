import React, { useEffect, useState, useCallback } from 'react';
import {
  Sparkles,
  X,
  Disc3,
  Plus,
  Check,
  RefreshCw,
  Quote,
  Music2,
  Tag,
  Calendar,
} from 'lucide-react';
import { AlbumRecommendation, RecommendationResponse, RecordCreateInput } from '../types';
import { getAiRecommendations } from '../services/recommendations';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCrate: (record: RecordCreateInput) => Promise<void>;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  onAddToCrate,
}) => {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAiRecommendations();
      setData(response);
      setAddedMap({});
    } catch (err: any) {
      console.error('Failed to fetch AI recommendations:', err);
      setError(err.message || 'Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen, fetchRecommendations]);

  const handleAdd = async (rec: AlbumRecommendation, index: number) => {
    if (addedMap[index]) return;
    try {
      await onAddToCrate({
        title: rec.title,
        artist: rec.artist,
        release_year: rec.release_year,
        condition: rec.suggested_condition || 'Near Mint',
        price: rec.estimated_price || 35.0,
        cover_url: rec.cover_url || null,
      });
      setAddedMap((prev) => ({ ...prev, [index]: true }));
    } catch (err) {
      console.error('Failed to add recommendation to crate:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-zinc-800 bg-[#12151b] shadow-2xl shadow-amber-500/5 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-5 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <span>What to Spin Next</span>
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-950 shadow-sm">
                  pydantic-ai
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                AI Curator analyzing your archive & sound preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecommendations}
              disabled={isLoading}
              title="Refresh Recommendations"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xl">
                <Disc3 className="h-10 w-10 animate-spin-slow" />
              </div>
              <h4 className="font-heading text-lg font-bold text-white">
                Consulting the Audiophile Curator...
              </h4>
              <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                Analyzing harmonic patterns, pressing eras, and sonic bridges across your collection.
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
              <p className="text-sm font-medium text-rose-300">{error}</p>
              <button
                onClick={fetchRecommendations}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          ) : data ? (
            <>
              {/* Curator Taste Profile Assessment */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Quote className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Curator Taste Assessment
                    </span>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-cream">
                      "{data.curator_summary}"
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Recommended Album Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-zinc-400">
                    3 Recommended Pressings For Your Crate
                  </h4>
                  <span className="text-xs font-medium text-zinc-400">
                    {data.total_crate_size_analyzed} crate albums analyzed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.recommendations.map((rec, idx) => (
                    <RecommendationCard
                      key={idx}
                      recommendation={rec}
                      isAdded={!!addedMap[idx]}
                      onAdd={() => handleAdd(rec, idx)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 px-6 py-4 bg-zinc-950/40 text-xs text-zinc-400">
          <span>Powered by Pydantic-AI Structured Outputs</span>
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function RecommendationCard({
  recommendation,
  isAdded,
  onAdd,
}: {
  recommendation: AlbumRecommendation;
  isAdded: boolean;
  onAdd: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition-all hover:border-amber-500/30 hover:bg-zinc-900/90 shadow-lg group">
      <div>
        {/* Cover Artwork */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950 mb-3.5 shadow-md">
          {recommendation.cover_url && !imageError ? (
            <img
              src={recommendation.cover_url}
              alt={recommendation.title}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                <Music2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-zinc-300 line-clamp-1">{recommendation.title}</span>
            </div>
          )}

          {/* Genre Badge */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-white/10">
              <Tag className="h-2.5 w-2.5" />
              {recommendation.genre}
            </span>
          </div>

          {/* Price Pill */}
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center rounded-lg bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-zinc-950 shadow-md">
              ${recommendation.estimated_price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Title & Artist */}
        <h5 className="font-heading font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
          {recommendation.title}
        </h5>
        <p className="text-xs font-medium text-zinc-400 mt-0.5 line-clamp-1">
          {recommendation.artist}
        </p>

        <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {recommendation.release_year}
          </span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{recommendation.suggested_condition}</span>
        </div>

        {/* Curator's Reasoning */}
        <p className="mt-3 text-xs leading-relaxed text-zinc-300/90 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60 italic">
          "{recommendation.reason_for_recommendation}"
        </p>
      </div>

      {/* 1-Click Add to Crate Button */}
      <button
        onClick={onAdd}
        disabled={isAdded}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-md ${
          isAdded
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
            : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 hover:shadow-amber-500/20 active:scale-95'
        }`}
      >
        {isAdded ? (
          <>
            <Check className="h-4 w-4" />
            <span>Added to Crate</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>Add to Crate</span>
          </>
        )}
      </button>
    </div>
  );
}
