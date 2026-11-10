var createClient = require('@supabase/supabase-js').createClient;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

module.exports = supabase;
