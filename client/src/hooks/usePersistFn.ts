import { useRef, useState } from "react";

/**
 * usePersistFn instead of useCallback to reduce cognitive load.
 * Devuelve una función con identidad estable que siempre invoca la última implementación recibida.
 */
export function usePersistFn<Args extends unknown[], Result>(fn: (...args: Args) => Result): (...args: Args) => Result {
  const latestFnRef = useRef(fn);
  latestFnRef.current = fn;

  const [stableFn] = useState(() => (...args: Args): Result => latestFnRef.current(...args));
  return stableFn;
}
