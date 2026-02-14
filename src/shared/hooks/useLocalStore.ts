import { useEffect, useRef } from 'react';
import { ILocalStore } from 'shared/types/ILocalStore';

/**
 * Creates a MobX store instance that persists across re-renders
 * and calls `destroy()` on unmount for proper cleanup.
 */
export function useLocalStore<T extends ILocalStore>(factory: () => T): T {
  const storeRef = useRef<T | null>(null);

  if (storeRef.current === null) {
    storeRef.current = factory();
  }

  useEffect(() => {
    return () => {
      storeRef.current?.destroy();
    };
  }, []);

  return storeRef.current;
}
