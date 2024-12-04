import 'https://deno.land/x/dotenv@v3.0.0/load.ts';
import { createClient } from 'npm:@supabase/supabase-js';
 
export const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);