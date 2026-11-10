var useEffect = require('react').useEffect;

// NOTE: this was mostly Built using basic development resources-4, don't fully understand it yet
function useInfiniteScroll<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: function () { return void; },
  shouldObserve: boolean = true,
  threshold: number = 0
) {
  useEffect(function () {
    if (!ref.current || !shouldObserve) {
      // Don't observe if unmounted or overridden
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]

        if (firstEntry?.isIntersecting) {
          callback()
        }
      },
      { threshold }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, callback, shouldObserve, threshold])
}
