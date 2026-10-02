-- Depois da validade o cliente não aprova mais. Sem isso ele poderia aprovar
-- semanas depois, com o preço velho, e a conta não fecharia para o instalador.
-- A trava fica aqui, no banco: barrar só na tela não barra nada.
create or replace function public.aceitar_proposta(p_token text, p_nome text, p_estilo text, p_aparelho text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_vence timestamptz;
begin
  select id, coalesce(enviado_em, criado_em) + (validade_dias || ' days')::interval
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
    situacao = 'fechado',
    decidido_em = now(),
    proximo_contato = null,
    aceite = jsonb_build_object(
      'nome', p_nome, 'estilo', p_estilo, 'em', now(),
      'aparelho', p_aparelho, 'ip', coalesce(current_setting('request.headers', true)::jsonb ->> 'x-forwarded-for', '')
    )
  where id = v_id;

  update public.pessoas set eh_cliente = true
    where id = (select pessoa_id from public.orcamentos where id = v_id);

  return jsonb_build_object('ok', true);
end $$;
