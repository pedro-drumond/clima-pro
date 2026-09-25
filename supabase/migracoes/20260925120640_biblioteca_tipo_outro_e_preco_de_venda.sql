-- O item da biblioteca passa a dizer se o valor guardado é custo ou preço de
-- venda. O orçamento por margem só usa item de custo; o por preço de venda só
-- usa item de venda; o de itens avulsos usa os dois.
alter table public.itens
  add column if not exists tipo_preco text not null default 'custo',
  add column if not exists tipo_outro text not null default '';

alter table public.itens drop constraint if exists itens_tipo_preco_check;
alter table public.itens add constraint itens_tipo_preco_check
  check (tipo_preco in ('custo', 'venda'));
