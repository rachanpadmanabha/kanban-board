import React, { useEffect, useState } from 'react';
import { NowContext } from '../hooks/useNow';

const DEFAULT_INTERVAL_MS = 60_000;

interface NowProviderProps {
  readonly children: React.ReactNode;
  readonly intervalMs?: number;
}

export const NowProvider: React.FC<NowProviderProps> = ({
  children,
  intervalMs = DEFAULT_INTERVAL_MS,
}) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, intervalMs);
    // A backgrounded tab throttles timers, so catch up when it regains focus.
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, [intervalMs]);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
};
