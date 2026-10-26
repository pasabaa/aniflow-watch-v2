'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to safely detect client-side hydration for zustand persisted stores.
 * Prevents SSR mismatch when reading localStorage.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
