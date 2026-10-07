# Reunião de 22/09/2026 — lista de mudanças para o MVP

Participantes: Pedro, Mauro e Marco. Fonte: anotações e transcrição do Gemini.
O Marco testou o protótipo ao vivo montando um orçamento de climatização.

## Decisão de nome
O produto passa a se chamar **Clima Pro** (antes Frizo). Decisão inicial, pode mudar depois.

## Escopo da primeira versão, como ficou combinado
Gerador de propostas + quadro de etapas (Kanban) + calendário de atividades.

## Ajustes no que já existe
1. **Orçamento simplificado**: uma linha descritiva com valor final de venda, sem detalhar custo (exemplo do Marco: "instalação simplificada de 9.000 a 12.000 BTU com até 3 m de tubulação — R$ 800"). Conviver com o orçamento detalhado de hoje.
2. **Preço por item, livre**: em cada item, escolher entre custo com margem ou digitar direto o valor final de venda. A biblioteca precisa funcionar nos dois modos, inclusive no simplificado.
3. **Cadastro de cliente**: obrigatório só nome e WhatsApp. O resto opcional.
4. **Vocabulário**: todo mundo é cliente desde o primeiro contato. Acaba a separação entre contato e cliente.
5. **Perdidos no quadro**: lista de perdidos acessível por um seletor de visualização, junto do Kanban.
6. **Proposta enxuta**: página única, com logo e dados cadastrais. Nada de documento longo.

## Novidades do MVP
7. **PDF do orçamento**, gerado e atualizado na hora pelo próprio usuário.
8. **Seguro do equipamento no orçamento** (ideia do Mauro, com cálculo automático): até R$ 8.500 de equipamento, R$ 96 por ano; acima disso, 1,25% do valor. Ativado por uma marcação, com campo de valor estimado do equipamento.
9. **Calendário de atividades**, estilo Outlook, enxuto, para a semana da equipe.
10. **Campanhas de relacionamento**: mensagens automáticas de limpeza semestral e alertas de sazonalidade, além do follow-up de orçamento que já existe.
11. **Ícones genéricos de ar-condicionado** na biblioteca, para o orçamento ficar visual.
12. **Espaço para distribuidor no banco de dados**: deixar a estrutura pronta para distribuição e precificação por distribuidor, para não refazer depois. Cotação automática com redes como Frigelar e Clima Rio fica para mais tarde.

## Fora do MVP, registrado
13. **Comando de voz** para gerar orçamento (ideia do Marco).
14. **IA com o conhecimento do Marco**: códigos de erro de equipamento e apoio a precificação. Antes disso, um roteiro de entrevista com ele.
15. **Envio automático pelo WhatsApp**: por causa da API da Meta, continua como botão que abre a conversa com a mensagem pronta. Pedro vai investigar alternativas.

## Combinados de prazo e comercial
- Pedro manda as atualizações no grupo até quinta, e fecha a versão nova com correções até sexta.
- Febrava: 6 a 8 de outubro, no Rio. Marco e Mauro citam o Clima Pro na participação e no marketing do evento; ideia de cupons de teste nos treinamentos do Marco.
- Marco alcança cerca de 4.000 pessoas por ano em treinamento, e treinou 1.300 em cinco dias na Febrava do ano passado. Redes: 80 mil no Instagram, 380 mil no TikTok, 280 mil no Kwai.
- Modelo SaaS: preferir volume de assinantes com ticket menor.

## Contexto de mercado citado
- Distribuidor Edeltec entrou em recuperação judicial.
- Cobre subiu forte; o Marco precifica a R$ 150 o quilo.
- Boa parte do mercado precifica por valor de mercado, sem calcular custo — o que reforça o orçamento simplificado.
