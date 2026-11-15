'use client';

import { useSyncExternalStore } from 'react';

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  };
}

/** SSR-safe media query. Returns `serverValue` during SSR / first hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** True on touch / coarse-pointer devices (no custom cursor, no hover-only effects). */
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)');

/** Fine pointer + hover + motion allowed: enables cursor, magnetic and tilt effects. */
export function useFancyPointer() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduced = useReducedMotion();
  return fine && !reduced;
}

/** Tracks whether the component has mounted on the client. */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
