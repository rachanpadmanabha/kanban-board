import { useCallback, useEffect, useRef, useState } from 'react';

type Setter<T> = (value: T | ((prev: T) => T)) => void;

interface Options<T> {
  /**
   * Rejects structurally invalid persisted data so a stale or hand-edited
   * payload falls back to the initial value instead of crashing the render.
   */
  readonly validate?: (value: unknown) => value is T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  { validate }: Options<T> = {},
): [T, Setter<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const fallback = () =>
      typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return fallback();
      const parsed: unknown = JSON.parse(item);
      if (validate && !validate(parsed)) {
        console.warn(`Discarding malformed localStorage value for "${key}"`);
        return fallback();
      }
      return parsed as T;
    } catch {
      return fallback();
    }
  });

  // Skip the write on mount: it would just rewrite what we read.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.warn(`Failed to save to localStorage key "${key}"`);
    }
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        const parsed: unknown = JSON.parse(e.newValue);
        if (validate && !validate(parsed)) return;
        setStoredValue(parsed as T);
      } catch {
        /* another tab wrote something unparseable; keep our copy */
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, validate]);

  const setValue = useCallback<Setter<T>>((value) => {
    setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
  }, []);

  return [storedValue, setValue];
}
