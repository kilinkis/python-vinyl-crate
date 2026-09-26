import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCrateWorkflow } from './useCrateWorkflow';
import * as recordsService from '../services/records';
import { RecordCreateInput, RecordItem } from '../types';

vi.mock('../services/records');

const blue: RecordItem = {
  id: 1, title: 'Kind of Blue', artist: 'Miles Davis', release_year: 1959,
  condition: 'Mint', price: 45, user_id: 1, created_at: '', updated_at: '',
};
const rumours: RecordItem = {
  id: 2, title: 'Rumours', artist: 'Fleetwood Mac', release_year: 1977,
  condition: 'VG+', price: 30, user_id: 1, created_at: '', updated_at: '',
};
const blueInput: RecordCreateInput = {
  title: blue.title,
  artist: blue.artist,
  release_year: blue.release_year,
  condition: blue.condition,
  price: blue.price,
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(recordsService.getRecords).mockResolvedValue({
    items: [blue, rumours], total: 2, skip: 0, limit: 100,
  });
});

describe('useCrateWorkflow', () => {
  it('loads records and derives the visible crate from search, condition, and sort', async () => {
    const { result } = renderHook(() => useCrateWorkflow(1));
    await waitFor(() => expect(result.current.records).toHaveLength(2));
    expect(recordsService.getRecords).toHaveBeenCalledWith({ limit: 100 });
    expect(result.current.visibleRecords.map((record) => record.id)).toEqual([2, 1]);

    act(() => result.current.setSortBy('price_high'));
    expect(result.current.visibleRecords.map((record) => record.id)).toEqual([1, 2]);

    act(() => {
      result.current.setSearchQuery('FLEETWOOD');
      result.current.setConditionFilter('VG+');
    });
    expect(result.current.visibleRecords.map((record) => record.id)).toEqual([2]);

    act(() => result.current.clearFilters());
    expect(result.current.visibleRecords).toHaveLength(2);
  });

  it('keeps crate records current after create, edit, and delete', async () => {
    let stored = [blue, rumours];
    vi.mocked(recordsService.getRecords).mockImplementation(async () => ({
      items: [...stored], total: stored.length, skip: 0, limit: 100,
    }));
    vi.mocked(recordsService.createRecord).mockImplementation(async () => {
      const created = { ...blue, id: 3 };
      stored = [created, ...stored];
      return created;
    });
    vi.mocked(recordsService.updateRecord).mockImplementation(async () => {
      const updated = { ...blue, price: 55 };
      stored = stored.map((record) => record.id === updated.id ? updated : record);
      return updated;
    });
    vi.mocked(recordsService.deleteRecord).mockImplementation(async () => {
      stored = stored.filter((record) => record.id !== 2);
    });
    const { result } = renderHook(() => useCrateWorkflow(1));
    await waitFor(() => expect(result.current.records).toHaveLength(2));

    await act(async () => result.current.saveRecord(blueInput));
    expect(result.current.records.map((record) => record.id)).toEqual([3, 1, 2]);

    await act(async () => result.current.saveRecord({ ...blueInput, price: 55 }, 1));
    expect(result.current.records.find((record) => record.id === 1)?.price).toBe(55);

    let removed = false;
    await act(async () => { removed = await result.current.removeRecord(2); });
    expect(removed).toBe(true);
    expect(result.current.records.map((record) => record.id)).toEqual([3, 1]);
  });

  it('keeps a record when deletion fails', async () => {
    vi.mocked(recordsService.deleteRecord).mockRejectedValue(new Error('offline'));
    const logError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useCrateWorkflow(1));
    await waitFor(() => expect(result.current.records).toHaveLength(2));

    let removed = true;
    await act(async () => { removed = await result.current.removeRecord(blue.id); });

    expect(removed).toBe(false);
    expect(result.current.records).toHaveLength(2);
    expect(result.current.isDeleting).toBe(false);
    logError.mockRestore();
  });

  it('discards a late load after the collector signs out', async () => {
    let resolveLoad!: (value: Awaited<ReturnType<typeof recordsService.getRecords>>) => void;
    vi.mocked(recordsService.getRecords).mockImplementation(() => new Promise((resolve) => {
      resolveLoad = resolve;
    }));
    const { result, rerender } = renderHook(
      ({ collectorId }) => useCrateWorkflow(collectorId),
      { initialProps: { collectorId: 1 as number | null } }
    );
    expect(result.current.isLoadingRecords).toBe(true);

    rerender({ collectorId: null });
    await act(async () => {
      resolveLoad({ items: [blue], total: 1, skip: 0, limit: 100 });
    });

    expect(result.current.records).toEqual([]);
    expect(result.current.isLoadingRecords).toBe(false);
  });

  it('does not add a record after the collector signs out', async () => {
    let resolveCreate!: (record: RecordItem) => void;
    vi.mocked(recordsService.createRecord).mockImplementation(() => new Promise((resolve) => {
      resolveCreate = resolve;
    }));
    const { result, rerender } = renderHook(
      ({ collectorId }) => useCrateWorkflow(collectorId),
      { initialProps: { collectorId: 1 as number | null } }
    );
    await waitFor(() => expect(result.current.records).toHaveLength(2));

    let save!: Promise<void>;
    act(() => { save = result.current.saveRecord(blueInput); });
    rerender({ collectorId: null });
    await act(async () => {
      resolveCreate({ ...blue, id: 3 });
      await save;
    });

    expect(result.current.records).toEqual([]);
  });
});
