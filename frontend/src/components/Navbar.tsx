import React from 'react';
import { Disc3, Plus, LogIn, LogOut, User as UserIcon, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddModal: () => void;
  onOpenAuthModal: () => void;
  onOpenRecommendations: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenAuthModal,
  onOpenRecommendations,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-zinc-900 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10">
            <Disc3 className="h-7 w-7 animate-spin-slow text-amber-400" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              VINYL<span className="text-amber-400">CRATE</span>
            </h1>
            <p className="text-xs font-medium text-zinc-400">Audiophile Collection Manager</p>
          </div>
        </div>

        {/* Center Search (Visible when authenticated) */}
        {isAuthenticated && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by album title or artist..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full border border-zinc-800 bg-zinc-900/90 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 shadow-inner transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* AI "What to Spin Next" Curator Button */}
              <button
                onClick={onOpenRecommendations}
                title="AI Curator: What to Spin Next"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-amber-600/10 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-amber-300 shadow-md shadow-amber-500/5 hover:border-amber-500/60 hover:from-amber-500/25 hover:to-amber-500/20 hover:text-amber-200 transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="hidden sm:inline">Spin Next</span>
              </button>

              <button
                onClick={onOpenAddModal}
                className="group relative inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 hover:shadow-amber-500/30 active:scale-95"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span className="hidden sm:inline">Add Vinyl</span>
              </button>

              {/* User Badge */}
              <div className="hidden lg:flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-sm text-zinc-300">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-zinc-200">{user?.username}</span>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isAuthenticated && (
        <div className="px-4 pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search albums or artists..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
};
