# Clima Pro

Gerador de orçamento + mini CRM para instaladores de ar-condicionado. React + Vite,
Supabase, publicado na Cloudflare Workers. Sócios: Pedro Drumond Jr, Mauro Filho e
Marco Souto.

---

## Como trabalhar com o Pedro

**Ele não é programador.** Nunca escreva "rode o build", "faça o commit" ou "dê um
push" como instrução. Escreva o bloco de Terminal pronto para copiar e colar, e
**na primeira linha da resposta**, nunca no fim:

```
cd ~/Documents/Claude/Projects/Clima\ Pro
git push origin main
```

Você mesmo edita os arquivos, roda o build e faz o commit na máquina dele. Só o
`push` é ele que roda.

**Resposta curta.** Mensagem longa custa dez minutos de leitura e mata a troca.
Resuma e deixe ele perguntar.

**Avalie antes de concordar.** Ele quer crítica, não validação. Nunca mude de
posição sem nomear o fato novo que justificou a mudança. Em decisão importante,
apresente prós e contras antes da recomendação, e declare o grau de confiança.
Quando ele criticar algo seu, avalie se a crítica procede — defenda o que merece
defesa.

**"O que você acha?" é pergunta, não aprovação.** Dê a opinião e pare. Implemente
só quando ele disser "pode fazer". E ele quer **ver na tela antes**: para mudança
visual, monte uma amostra e mande a imagem, não o código pronto.

**Pedido para um lugar vale só naquele lugar.** Se o mesmo componente ou texto
aparece em outra tela, mude só onde ele pediu e PERGUNTE sobre as outras,
nomeando onde estão.

**Nunca escreva subtítulo explicando o que a funcionalidade faz.** Ele não quer.
Quando precisar, ele pede.

**Texto justificado** em parágrafo corrido (`text-align: justify`).

**Nada de badge grande e colorido.** Marcação discreta.

**Português do Brasil natural.** Sem três frases seguidas com a mesma forma, sem
frase que só anuncia a explicação que vem depois, sem antítese do tipo "X, mas
não Y".

**Banco:** você aplica migração direto pelo Supabase, mas **pergunta antes de
qualquer coisa destrutiva** — apagar coluna, apagar linha, alterar em massa.

---

## Onde as coisas estão

```
src/dados/        vocabulario.js   as frases de ação, temperaturas, prazos
                  agenda.js        estadoDoCartao: tudo que o cartão mostra
                  acoes.js         gravação no Supabase
                  armazenamento.js leitura, cache e conversão banco ↔ app
                  parametros.js    os poucos ajustes de conta
src/telas/        uma tela por arquivo
src/componentes/  base.jsx (campos, Janela, topo), icones.jsx, proposta.jsx
src/estilo.css    tudo; sem CSS-in-JS
site/             site de marketing, Worker separado
docs/             os documentos do projeto (contexto, decisões, reuniões)
```

Build: `npm run build`. O deploy é automático pelo Cloudflare Workers Builds
quando o `main` recebe push.

Supabase: projeto `wmkalrkerjmqzkjiowto`, região São Paulo.

---

## Decisões que não dá para deduzir do código

**Margem é líquida sobre a venda**, não markup sobre o custo:
`preço = custo ÷ (1 − margem − imposto)`. Somar 30% a um custo de mil dá margem
real de 23%; a conta certa dá R$ 1.562,50 com 6% de imposto.

**O cartão do quadro tem três coisas na esquerda e uma na direita.** Nome; as
duas últimas ações com uma seta apontando da anterior para a mais recente; o
valor. No alto à direita, só a data do próximo passo. Altura fixa de 96px para a
coluna nunca dançar.

**São três relógios e eles não se misturam:**
1. O dia de chamar de novo — vem da ação registrada, cada frase tem seu prazo.
2. Orçamento enviado sem nenhuma ação registrada — sete dias corridos, fixo.
3. A validade do orçamento — quando vence, o link para de aceitar aprovação.

Tarja laranja na borda = você está atrasado para ligar. Tarja vermelha = a
validade venceu. O canto de cima **sempre** mostra o próximo passo; a validade só
ocupa esse canto enquanto não existe nenhuma ação registrada.

**A temperatura vem da ação, nunca de palpite.** O usuário escolhe primeiro a
temperatura (gelo / ondas de calor / chama) e depois a frase. Todas as frases são
coisas que **o cliente fez**. As frases e os prazos estão em
`src/dados/vocabulario.js`.

**Ação repetida em seguida vira contagem** — `cotando (2)` em vez de
`cotando → cotando`. Alternado não junta. A contagem é feita antes de cortar nas
duas últimas.

**Alinhamento de desenho ao lado de texto** (`src/componentes/icones.jsx`): cada
ícone foi empurrado dentro da própria caixa até o **centro de massa da tinta**
cair em 12, não o centro da caixa. A chama é bicuda em cima e gorda embaixo:
centrando a caixa, ela parece afundada. Os números vieram de medição no
navegador. Não mexa neles sem medir de novo. E a seta entre as ações é um SVG,
não um caractere de texto, porque caractere depende da fonte do sistema.

**A limpeza conta da entrega**, não do aparelho cadastrado. Antes dependia do
equipamento ter data da última limpeza, e ninguém preenchia — a lista vivia
vazia. Hoje conta da data em que o orçamento entrou em Entregues, e cada serviço
entregue reinicia o relógio.

**Não existe mais automação de WhatsApp.** Decisão do Pedro em 06/10: tentar
automatizar demais piora. Sobrou só o botão "Enviar pelo WhatsApp" dentro do
orçamento, com texto fixo em `parametros.js`. As listas são informação; quem fala
com o cliente é o instalador, do jeito dele.

**O link da proposta usa um token sorteado**, não o id do orçamento, para ninguém
chutar o link do orçamento seguinte. Visitante sem login não lê nenhuma tabela:
só as três funções da proposta (ver, aprovar, recusar).

**Trava de papel no perfil:** um gatilho no banco recusa mudança de papel ou de
conta feita por quem não é master. Existe porque o teste de 25/09 mostrou que o
dono de uma empresa conseguia se tornar master e enxergar todas as contas. Se
alguém reescrever as regras de acesso sem saber disso, a falha volta.

**As telas gravam com meio segundo de espera** depois da última tecla. Botão
"salvar" foi descartado: é um clique a mais em todo lugar.

---

## Armadilha conhecida

`device_commit_files` não faz nada quando o `stagedPath` se repete, e mesmo assim
responde sucesso — o arquivo no Mac fica velho. Sempre prepare cada entrega num
caminho novo.

---

## Pendente

- **Backup do banco não existe.** É a única coisa que, se der errado, não tem
  como desfazer. O arquivo `backup-do-banco.yml.guardado` está na pasta; falta
  criar o workflow pelo site do GitHub e o segredo `SUPABASE_DB_URL`.
- **Proteção de senha vazada** desligada no Supabase (Authentication → Passwords).
  Um clique.
- **Domínio climapro.com.br**: o Pedro precisa apontar os nameservers no
  Registro.br. Depois: `app.climapro.com.br` para o Worker do app, o site na
  raiz, e o Email Routing para `contato@`.
- Colunas órfãs no banco, da faxina de outubro: `uso` e `ultima_limpeza` em
  `equipamentos`, `cobrancas` em `orcamentos`. Só apagar com backup feito e
  autorização dele.
