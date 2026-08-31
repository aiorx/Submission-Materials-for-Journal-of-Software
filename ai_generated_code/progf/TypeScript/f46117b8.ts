// Example 13: Device connection state
type DeviceConnectionState =
  | { state: 'disconnected' }
  | { state: 'connecting' }
  | { state: 'connected'; deviceId: string }

// This ensures that the device's connection state is always valid and includes necessary information for each state.

// Built using basic development resources-4-0125-preview
