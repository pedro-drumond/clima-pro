-- Sem isto, o dono de uma conta podia editar a própria linha em perfis
-- e se tornar master, passando a enxergar todas as contas.
-- Agora só o master muda papel e conta_id; o usuário comum só mexe no nome.
create or replace function public.travar_papel_do_perfil()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if public.eh_master() then
    return new;
  end if;
  if new.papel is distinct from old.papel or new.conta_id is distinct from old.conta_id then
    raise exception 'nao e permitido mudar papel ou conta';
  end if;
  return new;
end $$;

drop trigger if exists travar_papel_do_perfil on public.perfis;
create trigger travar_papel_do_perfil
  before update on public.perfis
  for each row execute function public.travar_papel_do_perfil();
