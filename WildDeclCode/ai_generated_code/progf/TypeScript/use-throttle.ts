import { useState } from 'react';

// A custom hook to throttle a function
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  const [ready, setReady] = useState(true);

  function throttledFn(...args: Parameters<T>) {
    if (ready) {
      fn(...args);
      setReady(false);
      setTimeout(() => {
        setReady(true);
      }, delay);
    }
  }

  return throttledFn;
}

// Aided using common development resources
/**
 * Sure. The useThrottle hook is a custom hook that returns a throttled version of a given function. Throttling means limiting the frequency of calling a function, so that it only executes once in a specified time interval. This can improve the performance and responsiveness of your app, especially when dealing with events that fire rapidly, such as mouse move, scroll, resize, etc.

The useThrottle hook takes two parameters: fn and delay. The fn parameter is the function that you want to throttle, and the delay parameter is the number of milliseconds to wait between each call. The hook returns a throttledFn function that you can use instead of the original fn function.

The throttledFn function uses a state variable called ready to keep track of whether it can execute the fn function or not. Initially, ready is true, meaning that the fn function can be executed. When the throttledFn function is called, it checks the value of ready. If ready is true, it executes the fn function with the given arguments, and sets ready to false. Then, it uses setTimeout to set ready back to true after the delay time has passed. This way, the fn function can only be executed once in every delay interval. If ready is false, the throttledFn function does nothing.

The useThrottle hook also uses TypeScript to add type safety and inference to the fn and throttledFn functions. It uses a generic type T that extends a function type, and a utility type Parameters that extracts the parameter types of a function type. This way, the hook can accept any function as the fn parameter, and return a throttledFn function that has the same parameter types and return type as the fn function.
 *
 * */
