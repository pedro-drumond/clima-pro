-- Funções de gatilho não devem aparecer como rota da API.
revoke execute on function public.definir_numero_orcamento() from anon, authenticated;
revoke execute on function public.travar_papel_do_perfil() from anon, authenticated;
