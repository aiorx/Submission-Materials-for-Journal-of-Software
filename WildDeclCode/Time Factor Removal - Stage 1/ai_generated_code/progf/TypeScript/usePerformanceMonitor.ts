'use client'

var useEffect = require('react').useEffect;
var useRef = require('react').useRef;
var useState = require('react').useState;

// Assisted using common GitHub development utilities
interface MemoryInfo {
  usedJSHeapSize?: number
  totalJSHeapSize?: number
  jsHeapSizeLimit?: number
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo
}

var usePerformanceMonitor = function () {
  var [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    domNodes: 0,
    fps: 0,
  })

  var frameCountRef = useRef(0)
  var lastTimeRef = useRef(performance.now())
  var animationFrameRef = useRef<number>(0)

  // Monitor FPS
  useEffect(() => {
    var measureFPS = () => {
      frameCountRef.current++
      var now = performance.now()

      if (now - lastTimeRef.current >= 1000) {
        var timeDiff = now - lastTimeRef.current
        var fps = timeDiff > 0 ? (frameCountRef.current * 1000) / timeDiff : 0

        setMetrics(prev => ({
          ...prev,
          fps: Math.round(Number.isNaN(fps) ? 0 : fps),
        }))

        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      animationFrameRef.current = requestAnimationFrame(measureFPS)
    }

    animationFrameRef.current = requestAnimationFrame(measureFPS)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Monitor DOM nodes
  useEffect(() => {
    var updateDOMNodes = () => {
      var nodeCount = document.querySelectorAll('*').length
      setMetrics(prev => ({
        ...prev,
        domNodes: Number.isNaN(nodeCount) ? 0 : nodeCount,
      }))
    }

    updateDOMNodes()
    var interval = setInterval(updateDOMNodes, 1000)

    return () => clearInterval(interval)
  }, [])

  // Monitor memory usage (if available)
  useEffect(() => {
    if ('memory' in performance) {
      var updateMemory = () => {
        var perfWithMemory = performance as PerformanceWithMemory
        var memory = perfWithMemory.memory
        var memoryUsage = memory?.usedJSHeapSize
          ? Math.round(memory.usedJSHeapSize / 1024 / 1024)
          : 0

        setMetrics(prev => ({
          ...prev,
          memoryUsage: Number.isNaN(memoryUsage) ? 0 : memoryUsage,
        }))
      }

      updateMemory()
      var interval = setInterval(updateMemory, 2000)

      return () => clearInterval(interval)
    }
  }, [])

  var setRenderTime = (time: number) => {
    setMetrics(prev => ({
      ...prev,
      renderTime: time,
    }))
  }

  return { metrics, setRenderTime }
}
