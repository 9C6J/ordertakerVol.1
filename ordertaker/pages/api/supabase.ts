import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseToken = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabaseServiceToken = process.env.NEXT_PUBLIC_SERVICE_KEY || "";
const supabaseServiceAnonToken = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  supabaseUrl as string,
  supabaseServiceAnonToken as string,
);

export const supabaseClient = createClient(supabaseUrl, supabaseServiceAnonToken)


