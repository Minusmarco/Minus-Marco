"use client";

import { useCallback, useSyncExternalStore } from "react";

// A tiny pub/sub so writes from this hook notify every subscriber reading
// the same key, in this or other components.
const listeners = new Set<() => void>();
function emitChange() {
  for (const l of listeners) l();
}
function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

// Reactive localStorage read, SSR-safe (server snapshot is always null).
// This is the correct way to sync a component with a browser-only external
// store — reading it in a plain effect requires calling setState directly
// in the effect body, which can't express "restore persisted state after
// mount" any other way.
export function useLocalStorageValue(key: string): [string | null, (value: string) => void] {
  const getSnapshot = useCallback(
    () => (typeof window === "undefined" ? null : localStorage.getItem(key)),
    [key],
  );
  const getServerSnapshot = useCallback(() => null, []);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const write = useCallback(
    (v: string) => {
      localStorage.setItem(key, v);
      emitChange();
    },
    [key],
  );

  return [value, write];
}
