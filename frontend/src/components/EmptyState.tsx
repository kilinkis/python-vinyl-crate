import React from 'react';
import { Disc3, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  isSearching: boolean;
  onOpenAddModal: () => void;
  onClearSearch: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isSearching,
  onOpenAddModal,
  onClearSearch,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center my-12">
      <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-2xl">
        <Disc3 className="h-12 w-12 animate-spin-slow" />
      </div>

      {isSearching ? (
        <>
          <h3 className="font-heading text-xl font-bold text-white">No matching records found</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-sm">
            We couldn't find any albums in your crate matching that search query.
          </p>
          <button
            onClick={onClearSearch}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Clear Search</span>
          </button>
        </>
      ) : (
        <>
          <h3 className="font-heading text-xl font-bold text-white">Your Vinyl Crate is Empty</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-sm">
            Start cataloging your personal record collection by adding your first LP release.
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Your First Record</span>
          </button>
        </>
      )}
    </div>
  );
};
