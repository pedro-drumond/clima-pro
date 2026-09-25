-- Seguro do equipamento: marcação no orçamento, com valor estimado do
-- aparelho. O prêmio entra como uma linha no total (decisão de 25/09).
-- A regra do cálculo fica nos parâmetros gerais, para o master mudar sem
-- publicar versão nova (D15).
alter table public.orcamentos
  add column if not exists seguro boolean not null default false,
  add column if not exists seguro_valor_equip numeric not null default 0,
  add column if not exists seguro_premio numeric not null default 0;

-- Aparência do PDF: modelo de cabeçalho e desenho de aparelho escolhidos
-- pela empresa.
alter table public.contas
  add column if not exists modelo_cabecalho text not null default 'simples',
  add column if not exists icone text not null default '';
