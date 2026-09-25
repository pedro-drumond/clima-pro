import { createClient } from '@supabase/supabase-js'

// Projeto Clima Pro. A chave publicável pode ficar no código: ela só dá acesso
// ao que as regras do banco permitem para quem está logado.
export const SUPABASE_URL = 'https://wmkalrkerjmqzkjiowto.supabase.co'
export const SUPABASE_CHAVE = 'sb_publishable_Qqqrnx3P54cTaY8FPdLedA_Ay_PYICq'

export const supabase = createClient(SUPABASE_URL, SUPABASE_CHAVE, {
  auth: { persistSession: true, autoRefreshToken: true },
})
