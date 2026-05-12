import { createContext, useContext, useMemo, type ReactNode } from 'react';

/* eslint-disable react-refresh/only-export-components -- Provider plus controller/consumer hooks in one module */

export type CountryRibbonExpandApi = {
  expand: (keys: string[]) => void;
  register: (key: string, onExpand: () => void) => () => void;
};

function createCountryRibbonExpandApi(): CountryRibbonExpandApi {
  const listeners = new Map<string, Set<() => void>>();
  return {
    register(key, onExpand) {
      let bag = listeners.get(key);
      if (!bag) {
        bag = new Set();
        listeners.set(key, bag);
      }
      bag.add(onExpand);
      return () => {
        bag!.delete(onExpand);
        if (bag!.size === 0) listeners.delete(key);
      };
    },
    expand(keys) {
      const seen = new Set<() => void>();
      for (const k of keys) {
        const bag = listeners.get(k);
        if (!bag) continue;
        for (const fn of bag) {
          if (seen.has(fn)) continue;
          seen.add(fn);
          fn();
        }
      }
    },
  };
}

const CountryRibbonExpandContext = createContext<CountryRibbonExpandApi | null>(null);

export function CountryRibbonExpandProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: CountryRibbonExpandApi;
}) {
  return <CountryRibbonExpandContext.Provider value={value}>{children}</CountryRibbonExpandContext.Provider>;
}

/** Stable expand API for the country page ribbon (one instance per dashboard mount). */
export function useCountryRibbonExpandController(): CountryRibbonExpandApi {
  return useMemo(() => createCountryRibbonExpandApi(), []);
}

export function useCountryRibbonExpandOptional(): CountryRibbonExpandApi | null {
  return useContext(CountryRibbonExpandContext);
}
