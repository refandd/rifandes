import { createClient } from '@supabase/supabase-js';

// URL-nya harus bersih, cukup sampe .co aja
const supabaseUrl = 'https://gcmmkeqhkagcljkoyzuf.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbW1rZXFoa2FnY2xqa295enVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzU2NzksImV4cCI6MjA5MzA1MTY3OX0.1XfkFNw5cjLUdVefkX1C_OGbdllTeap9NB1D8NoRB-8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);