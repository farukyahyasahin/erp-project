import { createClient } from '@supabase/supabase-js';

const supabaseUrl='https://hsmjoqoswylgxfpwugwg.supabase.co'
const supabaseKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbWpvcW9zd3lsZ3hmcHd1Z3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Njg3NTEsImV4cCI6MjA2NDM0NDc1MX0.OyiGt_BcPD14mtFoO3X2MGvg-NemcTX_v-H9OONuKSo'        // public anon key (Dashboard → Project Settings → API)

export const supabase = createClient(supabaseUrl, supabaseKey);
