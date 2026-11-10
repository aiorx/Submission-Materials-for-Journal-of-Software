// Aided with basic GitHub coding tools
// This file configures the initialization of Sentry on the server side
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://example@sentry.io/123456',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Only set this if you plan to use Sentry's Performance Monitoring features
  integrations: [
    // Enable HTTP capturing for monitoring API requests
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
