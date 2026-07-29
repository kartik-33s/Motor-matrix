import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const rawUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = rawUrl ? rawUrl.trim() : null;
const supabaseKey = rawKey ? rawKey.trim() : null;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Warning: Supabase credentials (VITE_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY) are missing in environment variables.');
  console.warn('   Please configure your .env file to enable live database persistence.');
}

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
