// Supported via standard GitHub programming aids
var useEffect = require('react').useEffect;
var useCallback = require('react').useCallback;
var useRef = require('react').useRef;

function useDebounce<T extends function (...args: any[]) { return any>(
  callback: T,
  delay: number
): T {
  var debounceRef = useRef<NodeJS.Timeout>()

  var debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  ) as T

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

function useInitialLoad(callback: () => void, deps: React.DependencyList, delay = 100) {
  var hasInitializedRef = useRef(false)
  
  useEffect(() => {
    if (!hasInitializedRef.current && deps.every(dep => dep !== null && dep !== undefined)) {
      hasInitializedRef.current = true
      var timeoutId = setTimeout(callback, delay)
      return () => clearTimeout(timeoutId)
    }
  }, deps)
}; }