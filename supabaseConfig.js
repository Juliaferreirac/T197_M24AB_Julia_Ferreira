import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wxrgzlowarndbqguxevk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cmd6bG93YXJuZGJxZ3V4ZXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4Mzk0NDMsImV4cCI6MjA2MTQxNTQ0M30.wHiDIkIAFTmBpnyawvGH-GviM_cE0MpVTAsiiQHeRBE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
