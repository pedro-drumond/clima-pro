-- Clima Pro — estrutura inicial
-- Uma conta é a empresa do instalador. Tudo pertence a uma conta.

create table if not exists public.contas (
  id uuid primary key default gen_random_uuid(),
  razao_social text not null default '',
  nome_fantasia text not null default '',
  tipo_pessoa text not null default 'pj',
  cnpj text not null default '',
  telefone text not null default '',
  email text not null default '',
  endereco text not null default '',
  logo text not null default '',
  imposto_pct numeric not null default 6,
  margem_pct numeric not null default 25,
  validade_dias int not null default 7,
  condicoes_padrao text not null default '',
  observacoes_padrao text not null default '',
  parametros jsonb,
  distribuidor_id uuid,
  criada_em timestamptz not null default now()
);

-- espaço para a lógica de distribuição, como combinado na reunião de 22/09
create table if not exists public.distribuidores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  observacoes text not null default '',
  criado_em timestamptz not null default now()
);

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  conta_id uuid references public.contas(id) on delete cascade,
  nome text not null default '',
  email text not null default '',
  papel text not null default 'dono',
  criado_em timestamptz not null default now()
);

create table if not exists public.pessoas (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references public.contas(id) on delete cascade,
  tipo text not null default 'pf',
  nome text not null,
  documento text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  endereco text not null default '',
  observacoes text not null default '',
  eh_cliente boolean not null default false,
  proximo_contato timestamptz,
  criado_em timestamptz not null default now()
);

create table if not exists public.equipamentos (
  id uuid primary key default gen_random_uuid(),
  pessoa_id uuid not null references public.pessoas(id) on delete cascade,
  conta_id uuid not null references public.contas(id) on delete cascade,
  ambiente text not null default '',
  btu int not null default 0,
  marca text not null default '',
  uso text not null default 'residencial',
  instalado_em timestamptz,
  ultima_limpeza timestamptz
);

create table if not exists public.itens (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references public.contas(id) on delete cascade,
  tipo text not null default 'servico',
  nome text not null,
  unidade text not null default 'unidade',
  custo numeric not null default 0,
  criado_em timestamptz not null default now()
);

create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references public.contas(id) on delete cascade,
  pessoa_id uuid references public.pessoas(id) on delete set null,
  numero int not null default 0,
  modelo text not null default 'margem',
  situacao text not null default 'contato',
  imposto_pct numeric not null default 0,
  margem_pct numeric not null default 0,
  custo_total numeric not null default 0,
  total numeric not null default 0,
  validade_dias int not null default 7,
  condicoes text not null default '',
  observacoes text not null default '',
  mostrar_unitario boolean not null default true,
  motivo_perda text not null default '',
  cobrancas int not null default 0,
  aceite jsonb,
  token text not null unique default encode(gen_random_bytes(9), 'hex'),
  proximo_contato timestamptz,
  criado_em timestamptz not null default now(),
  enviado_em timestamptz,
  decidido_em timestamptz,
  instalado_em timestamptz
);

create table if not exists public.orcamento_itens (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid not null references public.orcamentos(id) on delete cascade,
  conta_id uuid not null references public.contas(id) on delete cascade,
  item_id uuid references public.itens(id) on delete set null,
  nome text not null default '',
  unidade text not null default 'unidade',
  qtd numeric not null default 1,
  custo_unit numeric not null default 0,
  preco_unit numeric not null default 0,
  ordem int not null default 0
);

create table if not exists public.parametros_gerais (
  id boolean primary key default true,
  valores jsonb not null,
  atualizado_em timestamptz not null default now(),
  constraint linha_unica check (id)
);

create index if not exists idx_pessoas_conta on public.pessoas(conta_id);
create index if not exists idx_itens_conta on public.itens(conta_id);
create index if not exists idx_orcamentos_conta on public.orcamentos(conta_id);
create index if not exists idx_orcamento_itens_orcamento on public.orcamento_itens(orcamento_id);
create index if not exists idx_equipamentos_pessoa on public.equipamentos(pessoa_id);

-- numeração do orçamento por conta
create or replace function public.definir_numero_orcamento()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.numero is null or new.numero = 0 then
    select coalesce(max(numero), 1000) + 1 into new.numero
      from public.orcamentos where conta_id = new.conta_id;
  end if;
  return new;
end $$;

drop trigger if exists tg_numero_orcamento on public.orcamentos;
create trigger tg_numero_orcamento before insert on public.orcamentos
for each row execute function public.definir_numero_orcamento();
