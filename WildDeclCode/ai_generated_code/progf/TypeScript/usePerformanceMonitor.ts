'use client'

import { useEffect, useRef, useState } from 'react'

// Assisted using common GitHub development utilities
interface MemoryInfo {
  usedJSHeapSize?: number
  totalJSHeapSize?: number
  jsHeapSizeLimit?: number
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    domNodes: 0,
    fps: 0,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationFrameRef = useRef<number>(0)

  // Monitor FPS
  useEffect(() => {
    const measureFPS = () => {
      frameCountRef.current++
      const now = performance.now()

      if (now - lastTimeRef.current >= 1000) {
        const timeDiff = now - lastTimeRef.current
        const fps = timeDiff > 0 ? (frameCountRef.current * 1000) / timeDiff : 0

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
    const updateDOMNodes = () => {
      const nodeCount = document.querySelectorAll('*').length
      setMetrics(prev => ({
        ...prev,
        domNodes: Number.isNaN(nodeCount) ? 0 : nodeCount,
      }))
    }

    updateDOMNodes()
    const interval = setInterval(updateDOMNodes, 1000)

    return () => clearInterval(interval)
  }, [])

  // Monitor memory usage (if available)
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemory = () => {
        const perfWithMemory = performance as PerformanceWithMemory
        const memory = perfWithMemory.memory
        const memoryUsage = memory?.usedJSHeapSize
          ? Math.round(memory.usedJSHeapSize / 1024 / 1024)
          : 0

        setMetrics(prev => ({
          ...prev,
          memoryUsage: Number.isNaN(memoryUsage) ? 0 : memoryUsage,
        }))
      }

      updateMemory()
      const interval = setInterval(updateMemory, 2000)

      return () => clearInterval(interval)
    }
  }, [])

  const setRenderTime = (time: number) => {
    setMetrics(prev => ({
      ...prev,
      renderTime: time,
    }))
  }

  return { metrics, setRenderTime }
}
