var React = require('react');
var Header = require('./components/Header');
var Footer = require('./components/Footer');
require('./globals.css');
var useAuthState = require('react-firebase-hooks/auth').useAuthState;
var auth = require('../app/firebase/config').auth;
var ThemeProvider = require('./context/themecontext').ThemeProvider;
var Analytics = require('@vercel/analytics/react').Analytics;
var dynamic = require('next/dynamic');

// Dynamic import with error handling to properly load SpeedInsights this code was Assisted with basic coding tools, Vercel Insights, and StackOver Flow 
// Prompt: "How can i dynamically import a component in Next.js and add error handling? im dealing with this error "Error: There was an error while hydrating this Suspense boundary. Switched to client rendering" with SpeedInsights for this section here "pasted reference code section "
const SpeedInsights = dynamic(function () { return import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights); }, { 
  ssr: false,
  loading: function () { return <p>Loading Speed Insights...</p>; }, 
  onError: function (error) {
    console.error("Error loading SpeedInsights:", error);
    return null;
  },
});

const RootLayout = function ({ children }) {
  const [user] = useAuthState(auth);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <Analytics />
      {/*Chat GPT generated line for Speed Insights on Vercel*/}
      {SpeedInsights && <SpeedInsights />}
    </ThemeProvider>
  );
};

module.exports = RootLayout;
