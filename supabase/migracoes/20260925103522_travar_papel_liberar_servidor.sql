-- A trava vale para quem está logado no app. Sem usuário logado a chamada vem
-- do servidor (chave de serviço ou console do banco), que já é de confiança.
create or replace function public.travar_papel_do_perfil()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if auth.uid() is null or public.eh_master() then
    return new;
  end if;
  if new.papel is distinct from old.papel or new.conta_id is distinct from old.conta_id then
    raise exception 'nao e permitido mudar papel ou conta';
  end if;
  return new;
end $$;
