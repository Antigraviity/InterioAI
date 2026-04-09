import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabaseSecret = process.env.SUPABASE_SECRET_KEY!;

// Client for browser/public operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for server-side operations (uses secret key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecret);
