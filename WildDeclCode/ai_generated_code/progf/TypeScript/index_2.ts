// Assisted using common GitHub development utilities
export interface ListItem {
  id: number
  name: string
  description: string
  category: string
  status: 'Active' | 'Inactive' | 'Pending'
  date: string
}

export interface PerformanceMetrics {
  renderTime: number
  domElements: number
  memoryUsage: 'Low' | 'Medium' | 'High'
}

export type OptimizationTechnique =
  | 'no-optimization'
  | 'content-visibility'
  | 'windowing'

export interface TabConfig {
  id: OptimizationTechnique
  label: string
  description: string
}
