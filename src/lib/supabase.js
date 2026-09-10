import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://gzbfxictffxgkvycbwdi.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HmYhVJfU6C7IsJ778TULDA_Kh7HQs1R'

export const supabase = url && key ? createClient(url, key) : null

