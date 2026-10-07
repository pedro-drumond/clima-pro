# Melhorias futuras

Fila do que ficou fora do v1 de propósito. Cada item diz de onde veio. Nada aqui está prometido; entra quando o teste com instaladores mostrar que vale.

## Depende só de tempo (não precisa de validação)
- **PDF do orçamento para baixar e mandar por e-mail.** No v1 a proposta chega por link (D20).
- **Importar a biblioteca por planilha**: baixar um modelo, preencher no Excel e subir (D16).
- **Lista sugerida de equipamentos e materiais** já cadastrada, para o instalador começar sem digitar nada. A tabela de referência do Marco é a candidata natural (D10, D16).
- **Convidar parceiros e equipe**: o dono da conta cria usuários para os instaladores dele, que entram e veem os mesmos clientes. A estrutura do banco já nasce pronta para isso (D18).

## Módulos novos
- **Ordem de serviço e relatório de entrega**: orçamento fechado vira OS, vai para o técnico credenciado pelo WhatsApp, ele faz check-in, manda fotos de antes e depois, e o cliente recebe o relatório e dá o aceite. Depois vira crédito na carteira do técnico, com data de pagamento. É o fluxo que o Marco descreveu na reunião de 16/09 (D22).
- **PMOC** para clientes comerciais.
- **Seguro do equipamento como item do orçamento** (ideia do Mauro).
- **QR code adesivo na máquina**, com a data da instalação; o cliente escaneia e cai no instalador.
- **Cobrança automática de assinatura**. No teste a cobrança é manual, por Pix.
- **App nas lojas e notificação no celular**, se o teste mostrar que faz falta.

## Com inteligência artificial
- **Assistente de ajuda dentro do sistema** (pedido do Pedro, 02/10). Um botão na Central de Ajuda que abre uma conversa com uma IA que conhece todas as funcionalidades e responde em linguagem simples: como fazer um orçamento, o que é margem líquida, como mandar a proposta. Ligar no Gemini. Fica ao lado dos cartões de ajuda, não no lugar deles — os cartões continuam para quem prefere ler. Ponto a resolver antes de implementar: a chave da API não pode ficar no código que roda no navegador, então precisa de uma Edge Function no Supabase servindo de intermediária, com limite de uso por conta.
- **Croqui a partir da planta**: o instalador sobe a planta do apartamento, a IA propõe posições e metragens de linha, e ele confirma. É o caminho mais viável.
- **Medida a partir de fotos do ambiente**, usando a porta como referência. Precisa de prova de conceito antes de prometer; foi chamado de "sonho de consumo" pelo Marco.
- **Assistente de precificação** treinado com o conhecimento do Marco, que dá treinamento de preço pela Daikin.
- **Atendente de IA no WhatsApp** para responder cliente na alta temporada. Depende da API oficial do WhatsApp, que é cobrada por conversa.

## Comercial
- **Canal de fabricante e distribuidor**: TCL, Hisense e outros compram licenças em lote ou distribuem para a rede de instaladores. Só depois de ter usuários e retenção para mostrar.
- **Comissão na venda de equipamento** dentro do app.
