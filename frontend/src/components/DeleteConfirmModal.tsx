import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { RecordItem } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  record: RecordItem | null;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  record,
  isDeleting,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center gap-3 text-rose-400 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Remove from Crate</h3>
            <p className="text-xs text-zinc-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-zinc-300">
          Are you sure you want to delete <span className="font-bold text-white">"{record.title}"</span> by{' '}
          <span className="font-bold text-white">{record.artist}</span>?
        </p>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isDeleting ? 'Removing...' : 'Delete Album'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
