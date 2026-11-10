// Based on change event
// Supported via standard programming aids

var useCallback = require('react').useCallback;
var useRef = require('react').useRef;

function useDebounce<
    T extends function (...args: Parameters<T>) { return ReturnType<T>
>(callback: T, delay: number = 500) {
    var timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
}; }