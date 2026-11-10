// Assisted using common GitHub development utilities
var createBrowserClient = require('@supabase/ssr').createBrowserClient;

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
