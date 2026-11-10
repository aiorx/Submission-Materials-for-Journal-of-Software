var NextRequest = require('next/server').NextRequest;
var createIntlMiddleware = require('next-intl/middleware');
var locales = require('./i18n').locales;
var defaultLocale = require('./i18n').defaultLocale;
var createMiddlewareClient = require('@supabase/auth-helpers-nextjs').createMiddlewareClient;

// Create the i18n middleware configuration
const handleI18nRouting = createIntlMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed', // Adjust as needed ('always', 'never', 'as-needed')
});

export async function middleware(req: NextRequest) {
  // --- Step 1: Handle Internationalization Routing ---
  const intlResponse = handleI18nRouting(req);

  // --- Step 2: Handle Supabase Session Management ---
  // Create a Supabase client tailored for middleware
  const supabase = createMiddlewareClient({ req, res: intlResponse });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  // This will update the session cookie if needed.
  await supabase.auth.getSession();

  // --- Step 3: (Optional) Route Protection ---
  // You can add route protection logic here if desired, similar to the previous Auth.js example,
  // but using Supabase session data.
  // Example:
  // var { data: { session } } = await supabase.auth.getSession();
  // var pathname = req.nextUrl.pathname;
  // var isProtectedRoute = pathname.startsWith('/dashboard'); // Check if path needs auth
  //
  // if (isProtectedRoute && !session) {
  //   // Redirect unauthenticated users to sign-in page
  //   var locale = intlResponse.headers.get('x-next-intl-locale') || defaultLocale;
  //   var signInUrl = new URL(`/${locale}/sign-in`, req.url);
  //   signInUrl.searchParams.set('next', pathname); // Add redirect path after login
  //   return NextResponse.redirect(signInUrl);
  // }

  // Return the response object (potentially modified by i18n routing)
  // The Supabase client automatically handles setting/updating cookies on the response.
  return intlResponse;
}

// Configuration for middleware path matching
const config = {
  matcher: [
    // Skip internal paths and static assets
    '/((?!api|_next/static|_next/image|favicon.ico|assets/).*)',
    // Include the root path for locale redirection
    '/',
  ],
};
