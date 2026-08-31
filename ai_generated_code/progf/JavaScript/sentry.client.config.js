// Assisted using common GitHub development utilities
// This file configures the initialization of Sentry on the client side
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://example@sentry.io/123456',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  replaysOnErrorSampleRate: 1.0,

  // This option should be set if you're experiencing transaction data loss in high-throughput serverless functions
  autoSessionTracking: true,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Only set this if you plan to use Sentry's Performance Monitoring features
  integrations: [
    // Enable HTTP capturing for monitoring API requests
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
