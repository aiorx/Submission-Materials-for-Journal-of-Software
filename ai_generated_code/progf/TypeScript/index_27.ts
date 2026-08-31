// Aided with basic GitHub coding tools
export interface TabItem {
  id: string
  label: string
  description?: string
}

export interface TabsProps {
  tabs: readonly TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  children?: React.ReactNode
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

// Re-export common types
export type { VariantProps } from 'class-variance-authority'
