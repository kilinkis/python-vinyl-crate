import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RecordCreateInput, RecordItem } from '../types';
import { createRecord, deleteRecord, getRecords, updateRecord } from '../services/records';

export type CrateSort = 'newest' | 'price_high' | 'price_low' | 'year' | 'title';

export function useCrateWorkflow(collectorId: number | null) {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [sortBy, setSortBy] = useState<CrateSort>('newest');
  const requestId = useRef(0);
  const collectorEpoch = useRef(0);

  const refreshRecords = useCallback(async () => {
    if (collectorId === null) return;

    const currentRequest = ++requestId.current;
    setIsLoadingRecords(true);
    try {
      const response = await getRecords({ limit: 100 });
      if (currentRequest === requestId.current) setRecords(response.items);
    } catch (error) {
      if (currentRequest === requestId.current) {
        console.error('Failed to fetch records:', error);
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoadingRecords(false);
    }
  }, [collectorId]);

  useEffect(() => {
    setRecords([]);
    setIsDeleting(false);
    if (collectorId === null) {
      setIsLoadingRecords(false);
    } else {
      void refreshRecords();
    }

    return () => {
      requestId.current += 1;
      collectorEpoch.current += 1;
    };
  }, [collectorId, refreshRecords]);

  const saveRecord = async (data: RecordCreateInput, existingId?: number) => {
    const activeEpoch = collectorEpoch.current;
    const saved = existingId === undefined
      ? await createRecord(data)
      : await updateRecord(existingId, data);
    if (activeEpoch !== collectorEpoch.current) return;

    setRecords((current) => existingId === undefined
      ? [saved, ...current]
      : current.map((record) => record.id === saved.id ? saved : record)
    );
    void refreshRecords();
  };

  const removeRecord = async (id: number): Promise<boolean> => {
    const activeEpoch = collectorEpoch.current;
    setIsDeleting(true);
    try {
      await deleteRecord(id);
      if (activeEpoch === collectorEpoch.current) {
        setRecords((current) => current.filter((record) => record.id !== id));
        void refreshRecords();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete record:', error);
      return false;
    } finally {
      if (activeEpoch === collectorEpoch.current) setIsDeleting(false);
    }
  };

  const visibleRecords = useMemo(() => {
    let result = [...records];
    const search = searchQuery.trim().toLowerCase();
    if (search) {
      result = result.filter((record) =>
        record.title.toLowerCase().includes(search) || record.artist.toLowerCase().includes(search)
      );
    }
    if (conditionFilter !== 'All') {
      result = result.filter((record) => record.condition === conditionFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_high': return b.price - a.price;
        case 'price_low': return a.price - b.price;
        case 'year': return b.release_year - a.release_year;
        case 'title': return a.title.localeCompare(b.title);
        default: return b.id - a.id;
      }
    });
    return result;
  }, [records, searchQuery, conditionFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setConditionFilter('All');
  };

  return {
    records,
    visibleRecords,
    isLoadingRecords,
    isDeleting,
    searchQuery,
    setSearchQuery,
    conditionFilter,
    setConditionFilter,
    sortBy,
    setSortBy,
    clearFilters,
    refreshRecords,
    saveRecord,
    removeRecord,
  };
}
