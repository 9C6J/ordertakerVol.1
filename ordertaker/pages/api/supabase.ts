import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceToken = process.env.NEXT_PUBLIC_SERVICE_KEY || "";

export const supabase = createClient(
  supabaseUrl as string,
  supabaseServiceToken as string,
);

debugger;

export const supabaseClient = createClient(supabaseUrl, supabaseServiceToken)


