import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ltvqklvtoufhracpwmor.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_uFkOQNB6eZF4FRBemyt7-A_fx9_ENMt";

export const supabase = createClient(supabaseUrl, supabaseKey);