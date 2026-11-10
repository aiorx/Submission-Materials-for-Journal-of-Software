// src/supabaseClient.js (Built via standard programming aids)
var createClient = require('@supabase/supabase-js').createClient;

var supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
var supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;



console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
var supabase = createClient(supabaseUrl, supabaseAnonKey);
