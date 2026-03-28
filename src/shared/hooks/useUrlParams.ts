import { useCallback, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

type UrlParamValue = string | number | boolean | null | undefined;
type UrlParams = Record<string, UrlParamValue>;

/**
 * Hook for convenient URL search params management with React Router.
 */
export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const currentParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
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

      setSearchParams(newParams, { replace: true });
    },
    [currentParams, setSearchParams],
  );

  const setSingle = useCallback(
    (key: string, value: UrlParamValue) => set({ [key]: value }),
    [set],
  );

  const remove = useCallback(
    (keys: string | string[]) => {
      const newParams = new URLSearchParams(currentParams);
      (Array.isArray(keys) ? keys : [keys]).forEach((key) => newParams.delete(key));
      setSearchParams(newParams, { replace: true });
    },
    [currentParams, setSearchParams],
  );

  const clear = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const has = useCallback((key: string) => currentParams.has(key), [currentParams]);

  return { params: searchParams, get, getAll, set, setSingle, remove, clear, has, pathname: location.pathname };
}
