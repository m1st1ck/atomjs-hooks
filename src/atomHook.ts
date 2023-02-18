import { useState, useEffect } from "react";
import { ObservableAtom } from "@m1st1ck/atomjs";

export function useAtom<T>(
  atom: ObservableAtom<T>,
  shouldUpdate: (prev: T, next: T) => boolean = () => true
): T {
  const [state, setState] = useState(atom.getState());

  useEffect(() => {
    const unsub = atom.subscribe(() => {
      const next = atom.getState();
      setState((prev) => (shouldUpdate(prev, next) ? next : prev));
    });

    const next = atom.getState();
    setState((prev) => (shouldUpdate(prev, next) ? next : prev));

    return unsub;
  }, [atom]);

  return state;
}
