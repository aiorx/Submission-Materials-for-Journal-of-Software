// Example 4: Game player state
type PlayerState =
  | { state: 'idle' }
  | { state: 'moving'; direction: 'left' | 'right' | 'up' | 'down' }
  | { state: 'attacking'; targetId: number }

// This ensures that the player's state is always valid and specific to the action being performed.

// Built using basic development resources-4-0125-preview
