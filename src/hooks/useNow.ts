import { createContext, useContext } from 'react';

export const NowContext = createContext<number>(0);

/**
 * Reads the shared clock. Relative labels ("2h ago", "Due today") derive from
 * this rather than calling Date.now() during render, which keeps rendering pure
 * and refreshes every label from one timer instead of one timer per card.
 */
export const useNow = (): number => useContext(NowContext);
