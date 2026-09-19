import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://higumpwitazqsojluiad.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_OwCgVHaph44FWQcbiMsKig_Fy3gr0EL";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
