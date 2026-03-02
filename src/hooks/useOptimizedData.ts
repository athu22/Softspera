import { useEffect, useState, useCallback } from 'react';
import { ref, get, onValue, off } from '@firebase/database';
import { database } from '../lib/firebase';

interface UseOptimizedDataOptions {
  path: string;
  enableRealtime?: boolean;
  cacheKey?: string;
  staleTime?: number;
}

// Simple in-memory cache
const dataCache = new Map<string, { data: any; timestamp: number }>();

export function useOptimizedData<T = any>({ 
  path, 
  enableRealtime = false,
  cacheKey,
  staleTime = 5 * 60 * 1000 // 5 minutes
}: UseOptimizedDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheKeyToUse = cacheKey || path;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = dataCache.get(cacheKeyToUse);
      if (cached && Date.now() - cached.timestamp < staleTime) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      const snapshot = await get(ref(database, path));
      const fetchedData = snapshot.val();
      
      // Cache the data
      dataCache.set(cacheKeyToUse, { data: fetchedData, timestamp: Date.now() });
      setData(fetchedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [path, cacheKeyToUse, staleTime]);

  useEffect(() => {
    if (enableRealtime) {
      // Set up real-time listener
      const dbRef = ref(database, path);
      onValue(dbRef, (snapshot) => {
        const newData = snapshot.val();
        dataCache.set(cacheKeyToUse, { data: newData, timestamp: Date.now() });
        setData(newData);
        setLoading(false);
      }, (err) => {
        setError(err);
        setLoading(false);
      });

      return () => {
        // Clean up the listener
        off(dbRef);
      };
    } else {
      fetchData();
    }
  }, [path, enableRealtime, fetchData, cacheKeyToUse]);

  const refetch = useCallback(() => {
    // Clear cache and refetch
    dataCache.delete(cacheKeyToUse);
    fetchData();
  }, [fetchData, cacheKeyToUse]);

  return { data, loading, error, refetch };
}

// Hook for fetching multiple paths in parallel
export function useParallelData<T = any>(paths: string[], cacheKeys?: string[]) {
  const [data, setData] = useState<(T | null)[]>(new Array(paths.length).fill(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = paths.map(async (path, index) => {
          const cacheKey = cacheKeys?.[index] || path;
          
          // Check cache first
          const cached = dataCache.get(cacheKey);
          if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
            return cached.data;
          }

          const snapshot = await get(ref(database, path));
          const fetchedData = snapshot.val();
          
          // Cache the data
          dataCache.set(cacheKey, { data: fetchedData, timestamp: Date.now() });
          return fetchedData;
        });

        const results = await Promise.all(promises);
        setData(results);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [paths, cacheKeys]);

  return { data, loading, error };
}

// Utility to clear cache
export const clearDataCache = (key?: string) => {
  if (key) {
    dataCache.delete(key);
  } else {
    dataCache.clear();
  }
};
