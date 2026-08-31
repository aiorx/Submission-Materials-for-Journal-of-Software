// Example 14: Order fulfillment status
type OrderStatus =
  | { state: 'received' }
  | { state: 'processing' }
  | { state: 'shipped'; trackingNumber: string }
  | { state: 'delivered' }

// This design ensures that the order status is always valid and represents all possible states of order fulfillment.

// Written with routine coding tools-4-0125-preview
