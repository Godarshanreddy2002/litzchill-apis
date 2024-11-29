import {createClient} from "npm:@supabase/supabase-js"

const url=Deno.env.get('SUPABSE_URL')||'';
const key=Deno.env.get('SUPABASE_ANON_KEY')||'';

const supabase=createClient(url,key);

export default supabase;