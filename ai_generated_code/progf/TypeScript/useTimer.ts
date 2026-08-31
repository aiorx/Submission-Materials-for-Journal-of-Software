// Assisted using common GitHub development utilities

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for a simple timer.
 * @returns The current timer value in seconds.
 * Assisted using common GitHub development utilities
 */
const useTimer = (): number => {
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return timer;
};

export default useTimer;
