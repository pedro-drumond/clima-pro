Setembro de 2026

# Frizo

Orçamento e acompanhamento de clientes para instalador de
ar-condicionado. Protótipo navegável para o Mauro e o Marco criticarem
antes de a gente construir de verdade.

<div class="destaque">

**Para testar:** frizo.pedro-4f6.workers.dev  
Abre no computador e no celular. O acesso de teste eu mando separado, no
grupo.  
O nome Frizo é provisório. Se alguém tiver ideia melhor, é hora de
falar.

</div>

## Por que este app, e não o que já existe

O Profiz é grátis e o FRIIO PRO custa cerca de R\$ 30 por mês, e os dois
já fazem orçamento. Se a gente entregar só mais um gerador de orçamento,
ninguém troca. Então o Frizo aposta em três coisas que faltam por lá:

- **O preço nasce do custo.** O instalador cadastra quanto ele paga, diz
  quanto quer de margem e quanto paga de imposto, e o app calcula o
  preço de venda. Hoje a maioria chuta o preço final e descobre a margem
  no fim do mês.
- **O app diz quem chamar hoje.** Orçamento parado sem resposta e
  cliente na época da limpeza aparecem numa lista, com a mensagem de
  WhatsApp pronta. É dinheiro que já está na base e ninguém busca.
- **O cliente aprova pelo celular.** Recebe o link, vê o orçamento,
  escreve o nome e aprova. Fica registrado com data, hora e aparelho.

## O que o app faz hoje

### Minha empresa

Os dados que saem no orçamento: nome, CNPJ, telefone, endereço e logo. É
aqui também que se define o imposto, a margem líquida desejada, a
validade do orçamento e os textos padrão de pagamento e de garantia.

### Biblioteca

A lista de serviços, materiais e equipamentos do instalador, cada um com
unidade (unidade, metro, hora) e **custo**. O app mostra ao lado quanto
aquilo sai para o cliente com a margem dele. Quem cadastra é o próprio
instalador; não vem nada pronto por enquanto.

### Pessoas

Uma lista só, com filtro de quem já é cliente e quem ainda não comprou.
Pessoa física ou jurídica, com documento, WhatsApp, endereço,
observações e anexos. Dentro da ficha ficam os equipamentos do cliente
(ambiente, BTU, marca, uso residencial ou comercial, data da última
limpeza) e todo o histórico de orçamentos.

### Orçamento

Escolhe a pessoa, puxa os itens da biblioteca, informa a quantidade, e o
app soma o custo e aplica imposto e margem. Dá para mudar a margem em um
orçamento específico sem mexer no resto. Também define validade,
condições de pagamento e observações, e se o cliente vê o valor item a
item ou só o total.

### A proposta que o cliente recebe

Um link que abre no celular, com a marca do instalador, os itens, o
total, o prazo de validade e as condições. O cliente aprova escrevendo o
nome e escolhendo um estilo de assinatura, ou recusa dizendo o motivo. O
aceite fica guardado com data, hora, endereço de internet e tipo de
aparelho.

Isso é aceite de orçamento, não contrato assinado com certificado
digital. Serve como prova de que a pessoa concordou, não substitui
documento formal.

### Quadro de etapas

Quatro colunas: primeiro contato, orçamento enviado, fechado e
instalado. Cada coluna mostra quantos orçamentos tem e quanto soma em
dinheiro. Orçamento perdido sai do quadro e fica guardado com o motivo.

### Quem chamar hoje

A lista do dia, com botão de WhatsApp em cada linha. Entra aqui:

| Situação               | Quando aparece                                         | Padrão                           |
|------------------------|--------------------------------------------------------|----------------------------------|
| Orçamento sem resposta | Depois de enviado, cobra três vezes                    | 2, 7 e 21 dias                   |
| Passou do prazo        | O app sugere marcar como perdido (nunca marca sozinho) | 45 dias                          |
| Limpeza vencida        | Contando da última limpeza registrada                  | 6 meses residencial, 3 comercial |
| Cliente parado         | Sem nenhum movimento                                   | 12 meses                         |

Esses prazos não são chute fechado: cada instalador muda os dele nas
configurações, e a gente muda o padrão de todo mundo sem publicar versão
nova. Os textos das mensagens também são editáveis.

### Números

Orçamentos enviados, taxa de aprovação, valor fechado, ticket médio,
custo dos serviços fechados e quanto sobrou depois do custo. Mais a
lista de motivos de perda.

### Controle das contas

Existe um acesso nosso que cria a conta de cada instalador e define a
senha inicial. Não tem cadastro aberto: quem entrega o acesso somos nós.
É assim de propósito na fase de teste, para sabermos quem está usando.

<div class="quebra">

</div>

## Como o preço é montado

O instalador informa duas porcentagens: imposto e margem líquida que ele
quer. A conta é a margem sobre a venda, não sobre o custo.

|                                   |                  |
|-----------------------------------|------------------|
| Custo dos itens do orçamento      | R\$ 1.000,00     |
| Imposto informado                 | 6%               |
| Margem líquida desejada           | 28%              |
| **Preço que vai para o cliente**  | **R\$ 1.515,15** |
| Do preço: imposto                 | R\$ 90,91        |
| Do preço: sobra para o instalador | R\$ 424,24       |

A diferença importa. Se fosse "custo mais 28%", o preço sairia por R\$
1.280 e, depois de pagar o imposto, sobrariam R\$ 203, ou seja, 16% da
venda em vez de 28%. É o erro mais comum de precificação do setor, e o
app já entrega a conta certa.

## O que este protótipo ainda não faz

- **Os dados ficam no aparelho de cada um.** O que o Marco cadastrar no
  celular não aparece no computador dele nem no do Mauro. Cada pessoa
  começa com os mesmos dados de exemplo. Isso acaba quando ligarmos o
  banco de dados.
- Não tem PDF do orçamento para baixar. Por enquanto só o link.
- Não tem recuperação de senha, nem convite para a equipe do instalador.
- Não tem ordem de serviço, nem relatório de entrega com fotos.
- O anexo na ficha da pessoa guarda só o nome do arquivo.

## O que precisamos decidir, principalmente com o Marco

A pergunta central é o que entra na primeira versão de verdade e o que
fica para depois. Pontos concretos:

- <span class="pergunta">Os prazos estão certos?</span> Cobrar em 2, 7 e
  21 dias faz sentido no dia a dia? Limpeza de 6 meses no residencial e
  3 no comercial bate com o que você orienta nos treinamentos?
- <span class="pergunta">Falta algum campo no orçamento?</span> Olhando
  o que você faz hoje no Profiz, o que você sentiu falta e o que sobrou.
- <span class="pergunta">A biblioteca vazia atrapalha?</span> Hoje o
  instalador cadastra os itens dele do zero. Se isso for motivo de
  desistência, a gente precisa de uma lista sugerida já na primeira
  versão.
- <span class="pergunta">Metragem de tubulação.</span> Hoje entra como
  item medido à mão, em metros. Vale construir uma tela que pergunte os
  ambientes e calcule os materiais sozinha?
- <span class="pergunta">Ordem de serviço.</span> Aquele fluxo que você
  descreveu (orçamento aprovado vira OS, vai para o técnico credenciado,
  fotos antes e depois, relatório para o cliente, crédito na carteira do
  técnico) está fora da primeira versão. Concorda em deixar para a
  segunda, ou sem isso o app não serve para a sua operação?
- <span class="pergunta">Preço.</span> Quanto um instalador desses
  pagaria por mês, sabendo que o Profiz é grátis?
- <span class="pergunta">Quem testa.</span> Cinco a dez instaladores da
  sua rede, para usarem por três ou quatro semanas.

## O que vem depois

Ordem provável, ainda sem prazo. Tudo aqui depende do que o teste
mostrar.

### Logo em seguida

- PDF do orçamento para baixar e mandar por e-mail.
- Importar a biblioteca por planilha: baixa um modelo, preenche no Excel
  e sobe.
- Lista sugerida de serviços, materiais e equipamentos, para começar sem
  digitar nada.
- Equipe: o dono convida os instaladores dele, que veem os mesmos
  clientes.

### Módulos novos

- Ordem de serviço completa: técnico recebe pelo WhatsApp, faz check-in,
  manda fotos de antes e depois, o cliente recebe o relatório de entrega
  e dá o aceite, e aquilo vira crédito a pagar para o técnico.
- PMOC para cliente comercial.
- Seguro do equipamento como item opcional do orçamento.
- Adesivo com QR code na máquina: o cliente escaneia e cai direto no
  instalador.
- Assinatura cobrada automaticamente.

### Com inteligência artificial

- Croqui a partir da planta que o cliente manda: a IA propõe as posições
  e a metragem das linhas, o instalador confirma.
- Medida a partir de fotos do ambiente, usando a porta como referência.
  Precisa de um teste antes de virar promessa.
- Assistente de precificação com o conhecimento do Marco.
- Atendente no WhatsApp para responder cliente na alta temporada.

### Comercial

- Conversa com fabricante e distribuidor (TCL, Hisense e outros) para
  licenças em lote, depois de termos usuários e retenção para mostrar.

## Como testar

- Abra o link no celular. No iPhone, dá para adicionar à tela de início
  pelo botão de compartilhar; no Android, pelo menu dos três pontinhos.
- Entre com o acesso que mandei no grupo. Já tem uma empresa de exemplo
  com clientes, itens e orçamentos.
- Faça um orçamento do começo ao fim: escolha a pessoa, puxe os itens,
  mande pelo WhatsApp e depois abra o link como se fosse o cliente e
  aprove.
- Passe pela tela "Quem chamar hoje" e use os botões de já chamei,
  adiar, fechou e perdeu.
- Anote o que incomodou. Crítica de tela e de palavra também vale: se um
  nome estiver errado para o setor, é melhor arrumar agora.

Documento de trabalho, feito para os sócios do projeto. O protótipo é
para avaliação: não use com cliente de verdade ainda.
