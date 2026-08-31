// Supported via standard GitHub programming aids
import { useEffect, useCallback, useRef } from 'react'

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const debounceRef = useRef<NodeJS.Timeout>()

  const debouncedCallback = useCallback(
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

export function useInitialLoad(callback: () => void, deps: React.DependencyList, delay = 100) {
  const hasInitializedRef = useRef(false)
  
  useEffect(() => {
    if (!hasInitializedRef.current && deps.every(dep => dep !== null && dep !== undefined)) {
      hasInitializedRef.current = true
      const timeoutId = setTimeout(callback, delay)
      return () => clearTimeout(timeoutId)
    }
  }, deps)
}
