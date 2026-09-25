-- O cliente abre a proposta por um link com token. Ele não enxerga as tabelas,
-- só o que estas três funções devolvem.

create or replace function public.proposta_por_token(p_token text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'orcamento', jsonb_build_object(
      'id', o.id,
      'numero', o.numero,
      'modelo', o.modelo,
      'situacao', o.situacao,
      'total', o.total,
      'validadeDias', o.validade_dias,
      'condicoes', o.condicoes,
      'observacoes', o.observacoes,
      'mostrarUnitario', o.mostrar_unitario,
      'motivoPerda', o.motivo_perda,
      'aceite', o.aceite,
      'criadoEm', o.criado_em,
      'enviadoEm', o.enviado_em,
      'impostoPct', o.imposto_pct,
      'margemPct', o.margem_pct
    ),
    'empresa', jsonb_build_object(
      'nomeFantasia', c.nome_fantasia,
      'cnpj', c.cnpj,
      'telefone', c.telefone,
      'endereco', c.endereco,
      'logo', c.logo
    ),
    'cliente', jsonb_build_object(
      'nome', coalesce(p.nome, ''),
      'endereco', coalesce(p.endereco, '')
    ),
    'itens', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nome', i.nome, 'unidade', i.unidade, 'qtd', i.qtd,
        'custoUnit', i.custo_unit, 'precoUnit', i.preco_unit
      ) order by i.ordem)
      from public.orcamento_itens i where i.orcamento_id = o.id
    ), '[]'::jsonb)
  )
  from public.orcamentos o
  join public.contas c on c.id = o.conta_id
  left join public.pessoas p on p.id = o.pessoa_id
  where o.token = p_token
$$;

create or replace function public.aceitar_proposta(p_token text, p_nome text, p_estilo text, p_aparelho text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from public.orcamentos where token = p_token and situacao in ('contato','enviado');
  if v_id is null then
    return jsonb_build_object('ok', false, 'motivo', 'proposta indisponivel');
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

create or replace function public.recusar_proposta(p_token text, p_motivo text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from public.orcamentos where token = p_token and situacao in ('contato','enviado');
  if v_id is null then
    return jsonb_build_object('ok', false, 'motivo', 'proposta indisponivel');
  end if;
  update public.orcamentos set
    situacao = 'perdido', decidido_em = now(), proximo_contato = null,
    motivo_perda = coalesce(nullif(p_motivo, ''), 'Recusado pelo cliente')
  where id = v_id;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.proposta_por_token(text) from public;
revoke all on function public.aceitar_proposta(text, text, text, text) from public;
revoke all on function public.recusar_proposta(text, text) from public;
grant execute on function public.proposta_por_token(text) to anon, authenticated;
grant execute on function public.aceitar_proposta(text, text, text, text) to anon, authenticated;
grant execute on function public.recusar_proposta(text, text) to anon, authenticated;
