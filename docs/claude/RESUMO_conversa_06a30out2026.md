# Resumo da conversa "Clima Pro" (06/10 a 30/10/2026)

Escrito para a próxima conversa do Claude continuar sem perder o fio. A conversa
inteira, palavra por palavra, está em `conversa_06a30out2026_completa.zip`, nesta
mesma pasta. Decisões formais estão em `docs/00_gestao/DECISOES.md` (D27 a D31) e
o diário em `docs/00_gestao/HISTORICO.md`.

## Como o Pedro quer ser tratado (aprendido nesta conversa)
- Ele não sabe os nomes das telas do Claude ("conversa", "sessão", "MCP",
  "conector"). Sempre passo a passo, dizendo onde clicar, com o nome que
  aparece na tela dele.
- Não deixar comando para ele rodar: o Claude faz commit e push. Quando só ele
  pode fazer (painel, senha, SQL sem acesso), dizer na primeira linha.
- Quando ele descreve o que quer com firmeza, fazer e subir; mostrar amostra
  antes só quando a forma ainda está em aberto ("não sei", "talvez").
- Nada de texto de explicação embaixo das coisas na tela.
- Este projeto só pode ter contato com o Supabase do Clima Pro (ver abaixo).

## O que foi feito
1. **Pasta e projeto** (06/10): a conversa começou na pasta do FounderFit e foi
   movida para `Clima Pro`. O projeto já existia (antes "Frizo").
2. **Vídeo promocional V1** (07/10): 31 s, vertical, voz Juliano (ElevenLabs,
   acelerada 1,25x), música "Digital Technology Background Music" (Envato).
   Arquivo: `video_promo/promo_clima_pro_v1.mp4`; roteiro em
   `video_promo/roteiro_v1.md`. Slogan: "Seu serviço em evidência. Orçamentos
   que não esfriam." Fecho com cadastro grátis, link e WhatsApp fictícios.
   Fonte da animação e ferramentas: `~/climapro-video/` (fora do iCloud), com uma
   cópia local do sistema com dados fictícios ("Brisa Norte Climatização").
   **Pendente:** o Pedro ia mandar prints com ajustes de espaçamento (caixas
   coladas, mais respiro entre título e subtítulo) e não mandou ainda.
3. **Concorrente** (13/10): existe o ClimaPro (climaproapp.com.br), app de ordem
   de serviço a R$ 39,90/mês. O Marco ficou de pensar num nome novo.
4. **Reunião de 13/10** com Mauro e Marco: ata em
   `docs/30_reunioes/2026-10-13_reuniao_socios.md`. Feito no mesmo dia: orçamento
   só por preço de venda, biblioteca só com preço, financeiro com perdidos e
   semana a semana, proposta sem desenho de aparelho, filtro "Só atrasados" na
   coluna Enviados, link do "Esqueci a senha" corrigido.
5. **14/10**: lápis para editar o preço ao cliente (sem linha de desconto),
   caixa "Na proposta" em cada item (nasce marcada; desmarcado = some da
   proposta mas soma no total), "Desmarcar todos" embaixo da coluna, lixeira no
   lugar de "Remover", aprovação da proposta com o nome à direita. Migração
   `20261014120000` colada pelo Pedro no SQL Editor.
6. **30/10**: o Pedro pediu que o Claude, neste projeto, não tenha contato com
   nenhum outro Supabase. O conector geral foi bloqueado em
   `.claude/settings.local.json` e criado o servidor `supabase-climapro` no
   `.mcp.json`, preso ao projeto `wmkalrkerjmqzkjiowto`. Precisa de login uma
   vez, com a conta "pedro uol", pela tela que abre ao digitar `/mcp`.

## Pendências
- Login do `supabase-climapro` e a consulta de quem usou o sistema (o Pedro
  perguntou se o Marco criou orçamentos).
- Robôs do GitHub prontos em `.github/workflows/` (backup diário e manter o banco
  acordado), mas não sobem: a chave do GitHub não tem a permissão "workflow".
- Segredo `SUPABASE_DB_URL` no GitHub para o backup.
- Servidor de e-mail (SMTP) no Supabase para o "Esqueci a senha".
- Plano pago do Supabase (acaba com a pausa e libera a proteção de senha vazada).
- Depois: nome novo, cadastro aberto por página de entrada (usuário por e-mail),
  painel de uso, divulgação para os ~2.100 contatos da Febrava.
- Achados no sistema e não pedidos: no celular, a linha "Orçamento nº … válido
  até …" da proposta passa um pouco da largura da tela.
