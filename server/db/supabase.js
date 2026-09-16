// db/supabase.js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Supabase client initialize kar rahe hain
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;