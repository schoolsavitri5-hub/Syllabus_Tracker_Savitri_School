import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://gzbfxictffxgkvycbwdi.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HmYhVJfU6C7IsJ778TULDA_Kh7HQs1R'

// Clear any residual persistent auth tokens from localStorage to enforce session security
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    Object.keys(window.localStorage).forEach(k => {
      if (k.includes('supabase.auth.token') || (k.startsWith('sb-') && k.endsWith('-auth-token'))) {
        window.localStorage.removeItem(k);
      }
    });
  } catch(e) {}
}

export const supabase = url && key ? createClient(url, key, {
  auth: {
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
}) : null


