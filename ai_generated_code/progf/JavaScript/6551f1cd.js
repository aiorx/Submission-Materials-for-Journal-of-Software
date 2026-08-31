function processOrder(order) {
  if (order.isPaid) {
    // Violates the rule by not returning early when the order is paid.
    console.log('Processing order')
    sendConfirmation(order)
  }
}

// Written with routine coding tools-4-0125-preview
