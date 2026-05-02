import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://dsyykpcnewmdckyacxaf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeXlrcGNuZXdtZGNreWFjeGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzA4NzMsImV4cCI6MjA5MzI0Njg3M30.5z5DkXVvtM2i5nHX2Nr0UV5FrafGQwR7thasrTGjE5Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
