// Assisted using common GitHub development utilities

var useEffect = require('react').useEffect;
var useRef = require('react').useRef;
var useState = require('react').useState;

/**
 * Custom hook for a simple timer.
 * @returns The current timer value in seconds.
 * Assisted using common GitHub development utilities
 */
var useTimer = (): function number {
  var [timer, setTimer] = useState(0);
  var timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return timer;
};

module.exports = useTimer;
