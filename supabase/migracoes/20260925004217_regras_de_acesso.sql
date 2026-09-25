-- Cada pessoa só enxerga o que é da conta dela. O master enxerga tudo.

create or replace function public.conta_atual()
returns uuid language sql stable security definer set search_path = public as $$
  select conta_id from public.perfis where id = auth.uid()
$$;

create or replace function public.eh_master()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select papel = 'master' from public.perfis where id = auth.uid()), false)
$$;

alter table public.contas enable row level security;
alter table public.distribuidores enable row level security;
alter table public.perfis enable row level security;
alter table public.pessoas enable row level security;
alter table public.equipamentos enable row level security;
alter table public.itens enable row level security;
alter table public.orcamentos enable row level security;
alter table public.orcamento_itens enable row level security;
alter table public.parametros_gerais enable row level security;

-- contas
drop policy if exists contas_ver on public.contas;
create policy contas_ver on public.contas for select to authenticated
  using (id = public.conta_atual() or public.eh_master());
drop policy if exists contas_editar on public.contas;
create policy contas_editar on public.contas for update to authenticated
  using (id = public.conta_atual() or public.eh_master())
  with check (id = public.conta_atual() or public.eh_master());
drop policy if exists contas_criar on public.contas;
create policy contas_criar on public.contas for insert to authenticated
  with check (public.eh_master());
drop policy if exists contas_apagar on public.contas;
create policy contas_apagar on public.contas for delete to authenticated
  using (public.eh_master());

-- perfis
drop policy if exists perfis_ver on public.perfis;
create policy perfis_ver on public.perfis for select to authenticated
  using (id = auth.uid() or conta_id = public.conta_atual() or public.eh_master());
drop policy if exists perfis_editar on public.perfis;
create policy perfis_editar on public.perfis for update to authenticated
  using (id = auth.uid() or public.eh_master())
  with check (id = auth.uid() or public.eh_master());
drop policy if exists perfis_criar on public.perfis;
create policy perfis_criar on public.perfis for insert to authenticated
  with check (public.eh_master());

-- distribuidores: só o master mexe; todo mundo lê
drop policy if exists distribuidores_ver on public.distribuidores;
create policy distribuidores_ver on public.distribuidores for select to authenticated using (true);
drop policy if exists distribuidores_mexer on public.distribuidores;
create policy distribuidores_mexer on public.distribuidores for all to authenticated
  using (public.eh_master()) with check (public.eh_master());

-- tabelas por conta
do $$
declare t text;
begin
  foreach t in array array['pessoas','equipamentos','itens','orcamentos','orcamento_itens'] loop
    execute format('drop policy if exists %I_ver on public.%I', t, t);
    execute format('create policy %I_ver on public.%I for select to authenticated using (conta_id = public.conta_atual() or public.eh_master())', t, t);
    execute format('drop policy if exists %I_criar on public.%I', t, t);
    execute format('create policy %I_criar on public.%I for insert to authenticated with check (conta_id = public.conta_atual() or public.eh_master())', t, t);
    execute format('drop policy if exists %I_editar on public.%I', t, t);
    execute format('create policy %I_editar on public.%I for update to authenticated using (conta_id = public.conta_atual() or public.eh_master()) with check (conta_id = public.conta_atual() or public.eh_master())', t, t);
    execute format('drop policy if exists %I_apagar on public.%I', t, t);
    execute format('create policy %I_apagar on public.%I for delete to authenticated using (conta_id = public.conta_atual() or public.eh_master())', t, t);
  end loop;
end $$;

-- parâmetros gerais: todos leem, só o master muda
drop policy if exists parametros_ver on public.parametros_gerais;
create policy parametros_ver on public.parametros_gerais for select to authenticated using (true);
drop policy if exists parametros_mexer on public.parametros_gerais;
create policy parametros_mexer on public.parametros_gerais for all to authenticated
  using (public.eh_master()) with check (public.eh_master());
