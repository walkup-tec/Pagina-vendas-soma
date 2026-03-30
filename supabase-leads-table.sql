-- Tabela leads_emprestimo_CLT
-- Execute no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS leads_emprestimo_clt (
  lead_ref TEXT PRIMARY KEY,
  nome_completo TEXT,
  cpf TEXT,
  rg TEXT,
  data_nascimento TEXT,
  valor TEXT,
  whatsapp TEXT,
  carteira_assinada TEXT,
  tres_meses TEXT,
  optin TEXT DEFAULT 'NAO',
  finalizado TEXT DEFAULT 'NAO',
  vendeai TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: permitir insert e update para anon e service_role
ALTER TABLE leads_emprestimo_clt ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir insert leads" ON leads_emprestimo_clt;
DROP POLICY IF EXISTS "Permitir update leads" ON leads_emprestimo_clt;
DROP POLICY IF EXISTS "Permitir all leads anon" ON leads_emprestimo_clt;

-- Permite INSERT e UPDATE para role anon (chave anon do Supabase)
CREATE POLICY "Permitir all leads anon" ON leads_emprestimo_clt
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Garante permissões na tabela
GRANT ALL ON leads_emprestimo_clt TO anon;
GRANT ALL ON leads_emprestimo_clt TO authenticated;
