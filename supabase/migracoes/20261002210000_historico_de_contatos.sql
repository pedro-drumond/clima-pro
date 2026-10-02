-- Histórico de contato com o cliente. É isso que tira um orçamento do atrasado:
-- registrou o contato, ficou marcada a próxima data, e o atraso some.
create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references public.contas(id) on delete cascade,
  pessoa_id uuid references public.pessoas(id) on delete cascade,
  orcamento_id uuid references public.orcamentos(id) on delete cascade,
  equipamento_id uuid references public.equipamentos(id) on delete cascade,
  resultado text not null default 'nao-atendeu',
  anotacao text not null default '',
  proximo_em timestamptz,
  criado_em timestamptz not null default now()
);
create index if not exists idx_contatos_orcamento on public.contatos(orcamento_id);
create index if not exists idx_contatos_pessoa on public.contatos(pessoa_id);
alter table public.contatos enable row level security;

create policy contatos_ver on public.contatos for select to authenticated
  using (conta_id = public.conta_atual() or public.eh_master());
create policy contatos_criar on public.contatos for insert to authenticated
  with check (conta_id = public.conta_atual() or public.eh_master());
create policy contatos_editar on public.contatos for update to authenticated
  using (conta_id = public.conta_atual() or public.eh_master())
  with check (conta_id = public.conta_atual() or public.eh_master());
create policy contatos_apagar on public.contatos for delete to authenticated
  using (conta_id = public.conta_atual() or public.eh_master());

-- Validade renovada sem mexer na data de envio original nem no preço.
alter table public.orcamentos add column if not exists validade_ate timestamptz;

-- A aprovação passa a olhar a validade renovada, quando existir.
create or replace function public.aceitar_proposta(p_token text, p_nome text, p_estilo text, p_aparelho text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_vence timestamptz;
begin
  select id, coalesce(validade_ate, coalesce(enviado_em, criado_em) + (validade_dias || ' days')::interval)
    into v_id, v_vence
    from public.orcamentos
   where token = p_token and situacao in ('contato','enviado');

  if v_id is null then
    return jsonb_build_object('ok', false, 'motivo', 'proposta indisponivel');
  end if;

  if v_vence is not null and now() > (date_trunc('day', v_vence) + interval '1 day') then
    return jsonb_build_object('ok', false, 'motivo', 'validade vencida');
  end if;

  update public.orcamentos set
    situacao = 'fechado', decidido_em = now(), proximo_contato = null,
    aceite = jsonb_build_object('nome', p_nome, 'estilo', p_estilo, 'em', now(),
      'aparelho', p_aparelho, 'ip', coalesce(current_setting('request.headers', true)::jsonb ->> 'x-forwarded-for', ''))
  where id = v_id;

  update public.pessoas set eh_cliente = true
    where id = (select pessoa_id from public.orcamentos where id = v_id);

  return jsonb_build_object('ok', true);
end $$;
