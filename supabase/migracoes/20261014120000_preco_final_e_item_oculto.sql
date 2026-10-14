-- 14/10/2026. Preço ao cliente digitado à mão e item que não aparece na proposta.
--
-- orcamentos.preco_final: quando preenchido, é o total do orçamento no lugar da
-- soma dos itens. Vazio = vale a soma.
-- orcamento_itens.oculto: o item entra no total mas some da proposta que o
-- cliente abre.
-- A função pública da proposta passa a devolver os dois, senão o link do
-- cliente mostraria o item escondido e o total errado.

alter table public.orcamentos add column if not exists preco_final numeric;
alter table public.orcamento_itens add column if not exists oculto boolean not null default false;

create or replace function public.proposta_por_token(p_token text)
returns jsonb language sql stable security definer set search_path to 'public' as $function$
  select jsonb_build_object(
    'orcamento', jsonb_build_object(
      'id', o.id, 'numero', o.numero, 'modelo', o.modelo, 'situacao', o.situacao,
      'total', o.total, 'validadeDias', o.validade_dias, 'condicoes', o.condicoes,
      'observacoes', o.observacoes, 'mostrarUnitario', o.mostrar_unitario,
      'motivoPerda', o.motivo_perda, 'aceite', o.aceite, 'criadoEm', o.criado_em,
      'enviadoEm', o.enviado_em, 'impostoPct', o.imposto_pct, 'margemPct', o.margem_pct,
      'seguro', o.seguro, 'seguroValorEquip', o.seguro_valor_equip, 'seguroPremio', o.seguro_premio,
      'precoFinal', o.preco_final
    ),
    'empresa', jsonb_build_object(
      'nomeFantasia', c.nome_fantasia, 'razaoSocial', c.razao_social, 'cnpj', c.cnpj,
      'telefone', c.telefone, 'email', c.email, 'endereco', c.endereco, 'logo', c.logo,
      'modeloCabecalho', c.modelo_cabecalho, 'icone', c.icone,
      'corProposta', c.parametros->>'corProposta'
    ),
    'cliente', jsonb_build_object(
      'nome', coalesce(p.nome, ''), 'documento', coalesce(p.documento, ''),
      'whatsapp', coalesce(p.whatsapp, ''), 'endereco', coalesce(p.endereco, '')
    ),
    'itens', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nome', i.nome, 'unidade', i.unidade, 'qtd', i.qtd,
        'custoUnit', i.custo_unit, 'precoUnit', i.preco_unit, 'oculto', i.oculto
      ) order by i.ordem)
      from public.orcamento_itens i where i.orcamento_id = o.id
    ), '[]'::jsonb)
  )
  from public.orcamentos o
  join public.contas c on c.id = o.conta_id
  left join public.pessoas p on p.id = o.pessoa_id
  where o.token = p_token
$function$;
