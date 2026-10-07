# Histórico

Diário cronológico. Só se acrescenta; nada se apaga. A entrada mais recente fica no fim.

---

## Agosto/2026 — antes do grupo
- O Pedro, com apoio de IA, produziu a pré-avaliação de mercado e o resumo de concorrência (RH Renováveis).
- Criou o protótipo v0 "ClimaFácil" (HTML navegável, dados simulados), publicado em https://red-lake-30ba.pedro-4f6.workers.dev/

## 16/09/2026 — kickoff
- Por volta das 14h30: reunião no Meet com Pedro, Mauro e Marco. Resumo em `30_reunioes/2026-09-16_kickoff_resumo.md`.
- 16h59: Mauro cria o grupo de WhatsApp "Gerador de proposta - Ar condicionado" (Mauro, Juliana, Marco, Pedro) e explica a ideia: app mobile first, simples, com gerador de proposta e CRM simplificado com follow-up. Cita o solar como referência (SunHub, Greener, SolarZ, Solarview, Solar Market, Luvik).
- 17h06: Mauro encaminha ao grupo o protótipo v0 e o resumo de concorrência do Pedro.
- Marco envia o PDF de um orçamento do Profiz (nº 10451).

## 16/09/2026 — sessão de organização (Pedro + Claude)
- O Pedro definiu as regras do projeto: documentação agnóstica, índice, onde paramos, histórico do raciocínio; SQL e terminal rodados por ele (ver `COMO_TRABALHAR.md`).
- Arquivos lidos e salvos: protótipo v0, pré-avaliação, resumo de concorrência (as 3 cópias recebidas têm conteúdo idêntico, então ficou só uma), orçamento do Profiz, anotações e transcrição do Gemini, print do grupo.
- Criados: índice, onde paramos, histórico, decisões, como trabalhar, pessoas, glossário, visão de produto, mercado e concorrência, resumo da reunião, transcrição (trecho do projeto) e README do protótipo e do técnico.
- Achados ao revisar o protótipo v0: "Enviar por WhatsApp" só simula e "Baixar PDF" não faz nada; uma proposta para cliente novo é gravada no nome do primeiro cliente da lista.
- Recorte da transcrição: os primeiros 20 minutos (assuntos pessoais e de seguros) ficaram de fora por não tratarem do projeto.

## 16/09/2026 — plano do MVP
- O Pedro reenviou os mesmos 3 arquivos (checksums idênticos aos anteriores); nada novo foi salvo.
- O Pedro pediu um plano para um MVP funcional com base na concorrência e no sistema do Marco. O protótipo v0 é só exemplo e não precisa ser reaproveitado.
- Checagem de concorrentes na web: FRIIO PRO mais completo do que se pensava (freemium de 3 PDFs); Profiz grátis com OS e PMOC; encontrado o FrioPro (R$ 11,90 a 81,90). Checagem de limites do Supabase grátis.
- Raciocínio: com o espaço básico ocupado, o MVP precisa de diferencial (metragem → orçamento, preços pré-carregados, "quem chamar hoje").
- Criado `00_gestao/PLANO_MVP.md`. Atualizados: DECISOES (D04 e D07 a D10), mercado e concorrência, ONDE_PARAMOS, índice.

## 19/09/2026 — decisões de arquitetura e produto
- O Pedro escolheu a opção B: React + Supabase + Cloudflare, com ele rodando SQL e comandos (D08).
- Definiu que a biblioteca de itens é cadastrada pelo próprio usuário (item, unidade, custo), com margem líquida e impostos configuráveis formando o preço final. Não vai pedir a lista de preços ao Marco agora, porque é grande demais; biblioteca sugerida fica para depois (D11).
- Levantou que o "quem chamar hoje" precisa de critério definido. Proposta de regras registrada na D14.
- Definiu a regra de interface: nada de subtítulo explicativo em cinza, nada de cara de IA, ambiente clean. Criado `10_contexto/padroes_de_interface.md` (D13).
- Ficaram em aberto: conta da margem (D12), cor padrão (D13), importação de planilha na biblioteca.
- Raciocínio registrado: sem a biblioteca pré-carregada, o app perde a vantagem do "começa sem cadastrar nada" sobre o Auvo, então o cadastro inicial precisa ser rápido (ver D10).

## 19/09/2026 — definições (continuação)
- Margem líquida sobre a venda, com dois campos em porcentagem: imposto e margem desejada (D12).
- Critérios de follow-up aceitos, com a exigência de ficarem configuráveis em um lugar só e editáveis pelo usuário master e por empresa (D14 e D15).
- Cor: azul-escuro aprovado; verde só no botão de WhatsApp (D13).
- Biblioteca: só cadastro manual no v1; planilha com modelo para baixar e lista sugerida vão para melhorias futuras (D16).
- O Pedro tirou do caminho a preocupação com a biblioteca pré-carregada.
- Aberto: nome do produto (D17).

## 19/09/2026 — nome provisório
- Pedro recusou todos os nomes propostos e escolheu **Frizo** como provisório, para não travar o início. Nome definitivo fica para depois (D17).

## 19/09/2026 — conta e regra de contexto
- Pedro: no MVP a conta é individual, com ficha de cadastro (CNPJ, razão social) para sair no orçamento; parceiros e equipe ficam para outra versão. Perguntou se vale já construir a estrutura pensando no futuro (D18).
- Uma mensagem sobre o RH Tracker chegou nesta conversa por engano. A IA pediu acesso à pasta do outro projeto e rodou uma listagem antes de perguntar; nada foi alterado. Daí a regra D19.

## 19/09/2026 — infraestrutura, aceite e CRM
- Fechado: Cloudflare para publicar, GitHub privado, projeto novo no Supabase, proposta por link, contas criadas por usuário master (D20).
- Pedro propôs o aceite com assinatura simples no link da proposta (D21) e um CRM com etapas, base de contatos e relatório de entrega (D22).
- A IA deu opinião sobre o CRM (uma base só de pessoas, etapa como situação do orçamento, quadro no computador e lista no celular, relatório de entrega como módulo separado) e sobre o esqueci-a-senha. Nada implementado; aguardando o Pedro.
- Pedro concordou com as quatro opiniões: registro do aceite em vez de peso na assinatura desenhada, esqueci-a-senha ligado, base única de pessoas e etapa como situação do orçamento, com o relatório de entrega fora do v1.
- Criado `00_gestao/MELHORIAS_FUTURAS.md` para guardar o que ficou para depois.
- Pedro avisou que lê só o chat, não os documentos: o resumo do que importa tem de estar na resposta.

## 19/09/2026 — protótipo navegável pronto
- Decidido fazer protótipo antes do app com banco: as telas já são as de verdade (React), com os dados no navegador, e depois só a camada de dados é trocada por Supabase. Nada de trabalho jogado fora.
- Construído e testado em navegador (desktop e celular), sem erro de execução. Telas: entrar, início, quem chamar hoje, quadro de etapas, ficha do orçamento, proposta pública com aceite assinado, pessoas com equipamentos, biblioteca, números, minha empresa, configurações e área do master.
- Entregue ao Pedro: `frizo-prototipo-codigo.zip` e `frizo-prototipo-site.zip`. Detalhes em `50_tecnico/README.md`.
- Protótipo publicado pelo Pedro na Cloudflare em 19/09/2026: **https://frizo.pedro-4f6.workers.dev** (Workers com arquivos estáticos, upload direto da pasta `dist`). Atualizar depois é "New deployment" no mesmo projeto, subindo a `dist` nova.
- 19/09/2026, ajustes visuais pedidos pelo Pedro depois de ver a v1 no ar: mais respiro em tudo, botões menores e mais espaçados, caixas de número menores, "Motivos de perda" ao lado de "Por situação", quadro com ordenação e rolagem por coluna, "Voltar" separado do título, e a tela de entrada sem as contas de teste. Regras em `10_contexto/padroes_de_interface.md`.
- 19/09/2026: escrito o resumo para os sócios (PDF entregue ao Pedro e salvo em `~/Documents/Claude/Projects/Frizo/`). Conteúdo em `30_reunioes/2026-09-19_resumo_para_socios.md`: por que o app se diferencia, o que faz hoje tela por tela, a conta do preço com exemplo, o que o protótipo não faz, as perguntas para o Marco decidir o escopo e a fila de melhorias futuras.

## 22/09/2026 — reunião com Mauro e Marco
- O Marco testou o protótipo ao vivo. Saiu uma lista de mudanças: `30_reunioes/2026-09-22_reuniao_lista_de_mudancas.md`.
- **Nome mudou para Clima Pro.** Trocado no app (tela de entrada, topo, título da página, README) e a pasta no Mac virou `~/Documents/Claude/Projects/Clima Pro`. O endereço na Cloudflare continua frizo.pedro-4f6.workers.dev até criarmos outro.
- Escopo da primeira versão confirmado pelos três: gerador de propostas, Kanban e calendário.
- Prazo combinado: atualizações no grupo até quinta, versão fechada na sexta. Febrava de 6 a 8/10.

## 24/09/2026 — três modelos de orçamento
- Implementados os modelos por margem, por preço de venda e itens avulsos (D23), com escolha na criação do orçamento e uma linha discreta de explicação em cada caixa.
- A proposta que o cliente vê e a tela Números passaram a respeitar o modelo: sem margem, o orçamento não entra nas contas de custo e sobra.
- Paleta clareada (fundo azul bem claro, contorno azul mais escuro) e espaçamento padronizado em quatro medidas, com entrelinha 1,7.
- Testado no navegador sem erro. Versão entregue como `clima-pro-site-v3.zip` e `clima-pro-codigo-v3.zip`; o Mac estava fora do ar na hora de gravar na pasta.
- Próximo passo combinado: criar o projeto no Supabase e o repositório, e ligar o banco.

## 24/09/2026 — projeto no Supabase criado sem perguntar
- A IA criou o projeto no Supabase por conta própria. O Pedro cobrou: a escolha da
  conta de e-mail é dele, e o plano grátis tem limite de projetos ativos.
- Situação real na conta: dois projetos ativos e um pausado (Med Help Psicologia),
  dentro do limite. A IA não apaga projeto; pausar, só com aval dele.
- Regra assumida: criar, apagar ou pausar projeto no Supabase, só com o "pode fazer".
- O Pedro autorizou seguir com o projeto já criado.

## 25/09/2026 — o protótipo virou sistema
- Ligado o Supabase de ponta a ponta. Projeto `wmkalrkerjmqzkjiowto`, região São Paulo.
- Banco: contas, perfis, pessoas, equipamentos, itens, orçamentos, itens do
  orçamento, parâmetros gerais e distribuidores. Regra de acesso por empresa em
  todas. Numeração dos orçamentos começando em 1001 por empresa, feita pelo banco.
- Proposta pública com código sorteado no link (D24), e três funções abertas para
  quem não tem login: ver, aprovar e recusar — nada além disso.
- Duas funções de servidor, as duas só aceitando chamada do master: criar conta de
  cliente e trocar senha.
- Todas as telas reescritas para falar com o banco. Saiu o arquivo de dados de
  exemplo; `localStorage` não existe mais no código.
- Gravação com espera de meio segundo, para não virar uma chamada de rede por
  letra digitada (D26).
- Tirado o bloco "Arquivos" da ficha da pessoa: não havia onde guardar arquivo de
  verdade, e o protótipo só guardava o nome do arquivo.
- Criado o usuário master do Pedro (pedro@rhrenovaveis.com.br).

## 25/09/2026 — falha de segurança encontrada no teste
- Testando as regras de acesso por dentro do banco, apareceu o seguinte: o dono de
  uma conta conseguia editar a própria linha de perfil e virar master. Como master
  enxerga todas as empresas, era vazamento de dado entre clientes.
- Causa: a regra deixava o usuário editar a própria linha sem olhar quais campos
  mudavam.
- Corrigido com trava no banco (D25) e testado de novo: a escalada é recusada e o
  usuário continua podendo trocar o próprio nome.
- Também fechadas as duas funções de gatilho, que apareciam como rota da API sem
  motivo.
- Ficou em aberto, sem risco prático: `conta_atual()` e `eh_master()` continuam
  chamáveis pela API. Cada uma devolve só o dado de quem chamou.

## 25/09/2026 — o que deu para testar e o que não deu
- Testado por dentro do banco, com as regras ligadas, simulando usuário logado:
  criação de cliente e orçamento, numeração, proposta pública pelo token, visitante
  sem login não lendo tabela nenhuma, aprovação gravando nome/data/aparelho e
  fechando o orçamento, aprovação repetida recusada, token inventado recusado,
  empresa A sem enxergar a empresa B, e dono sem conseguir criar conta ou virar
  master. Tudo passou.
- **Não deu para testar pelo navegador daqui:** a rede da máquina onde a IA roda
  bloqueia o endereço do Supabase (e o da Cloudflare). O teste de tela tem de ser
  feito no site publicado.
- Dados de teste apagados depois; ficou só o usuário master.
- Pasta do Mac atualizada com o código e o `dist` novos, e o `dist` velho removido.
- Erro da IA nesse passo: junto com os arquivos velhos, apagou também o
  `Frizo-resumo-para-socios.pdf`, que o Pedro não pediu para apagar. Restaurado no
  mesmo minuto. Regra reforçada: apagar só o que foi combinado, nunca "de quebra".
