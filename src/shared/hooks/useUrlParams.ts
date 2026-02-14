'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type UrlParamValue = string | number | boolean | null | undefined;
type UrlParams = Record<string, UrlParamValue>;

/**
 * Hook for convenient URL search params management in Next.js App Router.
 */
export function useUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentParams = useMemo(
    () => new URLSearchParams(searchParams?.toString() || ''),
    [searchParams],
  );

  const get = useCallback((key: string) => currentParams.get(key), [currentParams]);

  const getAll = useCallback(() => {
    const params: Record<string, string> = {};
    currentParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [currentParams]);

  const set = useCallback(
    (updates: UrlParams) => {
      const newParams = new URLSearchParams(currentParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      const queryString = newParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url || '', { scroll: false });
    },
    [pathname, router, currentParams],
  );

  const setSingle = useCallback(
    (key: string, value: UrlParamValue) => set({ [key]: value }),
    [set],
  );

  const remove = useCallback(
    (keys: string | string[]) => {
      const newParams = new URLSearchParams(currentParams);
      (Array.isArray(keys) ? keys : [keys]).forEach((key) => newParams.delete(key));
      const queryString = newParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url || '', { scroll: false });
    },
    [pathname, router, currentParams],
  );

  const clear = useCallback(() => {
    router.replace(pathname || '', { scroll: false });
  }, [pathname, router]);

  const has = useCallback((key: string) => currentParams.has(key), [currentParams]);

  return { params: searchParams, get, getAll, set, setSingle, remove, clear, has };
}
