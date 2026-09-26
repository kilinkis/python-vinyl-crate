import React, { useState } from 'react';
import {
  Disc3,
  SlidersHorizontal,
  LogIn,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  Layers,
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { RecordCard } from './components/RecordCard';
import { RecordCrate } from './components/RecordCrate';
import { RecordModal } from './components/RecordModal';
import { AuthModal } from './components/AuthModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RecommendationModal } from './components/RecommendationModal';
import { EmptyState } from './components/EmptyState';
import { RecordItem, RecordCreateInput } from './types';
import { useCrateWorkflow } from './hooks/useCrateWorkflow';

export const App: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    records, visibleRecords, isLoadingRecords, isDeleting,
    searchQuery, setSearchQuery, conditionFilter, setConditionFilter,
    sortBy, setSortBy, clearFilters, refreshRecords, saveRecord, removeRecord,
  } = useCrateWorkflow(user?.id ?? null);
  const [viewMode, setViewMode] = useState<'crate' | 'grid'>('crate');

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<RecordItem | null>(null);

  const handleSaveRecord = async (data: RecordCreateInput) => {
    await saveRecord(data, editingRecord?.id);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    if (await removeRecord(recordToDelete.id)) setRecordToDelete(null);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d11]">
        <div className="flex flex-col items-center gap-4 text-amber-400">
          <Disc3 className="h-10 w-10 animate-spin-slow" />
          <p className="text-sm font-medium tracking-wide text-zinc-400">Spinning up crate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d11] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => {
          setEditingRecord(null);
          setIsRecordModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenRecommendations={() => setIsRecommendationsOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {!isAuthenticated ? (
          /* Unauthenticated Hero State */
          <div className="my-12 sm:my-20 flex flex-col items-center text-center">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-zinc-900 border border-amber-500/30 text-amber-400 shadow-2xl shadow-amber-500/10">
              <Disc3 className="h-14 w-14 animate-spin-slow" />
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-2xl">
              Curate Your Private <span className="text-amber-400">Vinyl Crate</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-xl">
              Catalog rare pressings, track portfolio valuation, and dig through your 3D record crate with album artwork.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-base font-bold text-zinc-950 shadow-xl shadow-amber-500/20 hover:bg-amber-400 hover:shadow-amber-500/30 transition-all active:scale-95"
              >
                <LogIn className="h-5 w-5" />
                <span>Open Your Crate</span>
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl text-left">
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-white text-base">3D Crate Digging</h3>
                <p className="text-xs text-zinc-400 mt-1">Realistic tactile crate browsing with mouse wheel, gestures, and keyboard navigation.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-white text-base">Grading & Valuations</h3>
                <p className="text-xs text-zinc-400 mt-1">Standard Goldmine condition grades (Mint to Poor) with real-time portfolio worth.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-3 border border-purple-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-white text-base">AI Vinyl Curator</h3>
                <p className="text-xs text-zinc-400 mt-1">Type-safe AI recommendations for what album to spin and buy next using Pydantic-AI.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Stats Summary Banner */}
            <StatsBanner records={records} />

            {/* Filter & View Switcher Bar */}
            <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4">
              {/* Left: View Mode Toggle & Condition Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View Mode Toggle: 3D Crate vs Grid */}
                <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                  <button
                    onClick={() => setViewMode('crate')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      viewMode === 'crate'
                        ? 'bg-amber-500 text-zinc-950 shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>3D Crate</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-amber-500 text-zinc-950 shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Grid View</span>
                  </button>
                </div>

                <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

                {/* Condition Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['All', 'Mint', 'Near Mint', 'VG+', 'VG'].map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setConditionFilter(cond)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                        conditionFilter === cond
                          ? 'bg-zinc-200 text-zinc-950 shadow-sm'
                          : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Sort Dropdown & Refresh */}
              <div className="flex items-center gap-3 justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="newest">Recently Added</option>
                    <option value="price_high">Price (High to Low)</option>
                    <option value="price_low">Price (Low to High)</option>
                    <option value="year">Release Year (Newest)</option>
                    <option value="title">Title (A – Z)</option>
                  </select>
                </div>

                <button
                  onClick={refreshRecords}
                  title="Refresh Crate"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingRecords ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Content Display: 3D Crate, Grid View, or Empty State */}
            {visibleRecords.length === 0 ? (
              <EmptyState
                isSearching={!!searchQuery || conditionFilter !== 'All'}
                onOpenAddModal={() => {
                  setEditingRecord(null);
                  setIsRecordModalOpen(true);
                }}
                onClearSearch={clearFilters}
              />
            ) : viewMode === 'crate' ? (
              /* 3D Crate Flipping Mode */
              <RecordCrate
                records={visibleRecords}
                onEdit={(r) => {
                  setEditingRecord(r);
                  setIsRecordModalOpen(true);
                }}
                onDelete={(r) => setRecordToDelete(r)}
              />
            ) : (
              /* Grid Gallery Mode */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleRecords.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onEdit={(r) => {
                      setEditingRecord(r);
                      setIsRecordModalOpen(true);
                    }}
                    onDelete={(r) => setRecordToDelete(r)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSaveRecord}
        editingRecord={editingRecord}
      />

      <RecommendationModal
        isOpen={isRecommendationsOpen}
        onClose={() => setIsRecommendationsOpen(false)}
        onAddToCrate={handleSaveRecord}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        record={recordToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default App;
