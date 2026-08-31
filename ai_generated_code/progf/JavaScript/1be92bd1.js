// Demonstrating the use of environment variables in a class constructor for API credentials
class StripeClient {
  constructor() {
    this.apiKey = process.env.STRIPE_API_KEY
  }
}

// Written with routine coding tools-4-0125-preview
