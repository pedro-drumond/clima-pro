# Decisões e raciocínio

Status possíveis: **Decidida** · **Aberta** · **Revista** (neste caso, dizer qual fato novo motivou a revisão).

---

### D01 — Público-alvo: pequenas empresas de instalação (1 a 5 pessoas) e instaladores autônomos
- Status: Decidida (pré-avaliação, ago/2026), reforçada na reunião.
- Raciocínio: o Auvo não atende bem o pequeno (parametrização longa, desistência). No solar, até quem trabalha sozinho assina ferramenta, o que sugere que o pequeno paga quando o produto é simples.

### D02 — Entrada por venda direta; fabricante/distribuidor só depois
- Status: Decidida (reunião 16/09).
- Raciocínio: o canal de fabricante só se abre com produto que já tenha tração. A TCL é a candidata mais citada; a Daikin é restritiva.
- Alternativa descartada por ora: começar pelo fabricante.

### D03 — Fase atual: discovery navegável antes de construir de verdade
- Status: Decidida (reunião 16/09).
- Raciocínio: validar com a rede do Marco (que treina de 30 a 100 instaladores por semana) antes de investir. A pré-avaliação já recomendava conversar com 8 a 10 empresas antes de programar.

### D04 — Modelo de preço freemium
- Status: **Aberta.**
- Proposta do Mauro: grátis com limite (por exemplo 3 orçamentos por mês) e depois assinatura. A pré-avaliação sugeria R$ 30 a 50 por mês.
- Fato novo a considerar: o Profiz é **gratuito** e é o que o Marco usa. O valor pago precisa vir do que o Profiz não faz.
- Fato novo (16/09, checagem de sites): o FRIIO PRO já usa exatamente "grátis com 3 PDFs por mês + R$ 29,90". O FrioPro cobra a partir de R$ 11,90. Copiar esse modelo não diferencia. No MVP, o limite fica como flag para teste e a cobrança é manual.

### D05 — Escopo do MVP
- Status: **Aberta.** Será definida no discovery.
- Base: núcleo candidato em `10_contexto/visao_produto.md` (itens 1 a 8). A pré-avaliação recomendava deixar PMOC, estoque e financeiro de fora.
- Em avaliação: se alguma funcionalidade de IA (croqui por foto ou planta, assistente de precificação) entra no MVP como diferencial frente ao Profiz, ou se fica para depois por custo e complexidade.

### D06 — IA para croqui e orçamento a partir de fotos
- Status: **Aberta.** É ideia a avaliar, não compromisso.
- Registro: as anotações do Gemini listam como tarefa do Pedro; na conversa, o Pedro disse que "acha que consegue fazer". O discovery deve estimar a viabilidade (precisão da medida por foto) e o custo.

### D07 — Formato: web app mobile (PWA) no MVP; loja depois
- Status: **Proposta** (Plano MVP v1, 16/09), aguardando o Pedro.
- Raciocínio: um código só, sem aprovação de loja, o link de proposta abre em qualquer celular. Contra: push no iPhone só com o PWA instalado.

### D08 — Como construir
- Status: **Decidida** pelo Pedro em 19/09/2026: **opção B** — React + Supabase, publicado na Cloudflare. A IA escreve o código, o SQL e os comandos; o Pedro roda.
- Alternativas descartadas: Lovable (documentação agnóstica mais difícil) e app nativo (lento e caro para validar).

### D09 — WhatsApp por link (wa.me) no MVP, sem API oficial
- Status: **Proposta.**
- Raciocínio: custo zero e sem burocracia de aprovação da Meta. A API (envio automático, agente de IA) fica para depois do teste.

### D10 — Diferenciais do MVP
- Status: **Revista em 19/09/2026.**
- Proposta original: orçamento por metragem, preços pré-carregados com a tabela do Marco e lista diária "quem chamar hoje".
- Fato novo: o Pedro decidiu não pedir a lista de preços ao Marco agora, porque é grande demais. A biblioteca é do próprio usuário (ver D11); uma biblioteca sugerida fica para depois.
- Diferenciais que ficam de pé no v1: (a) o orçamento sai do custo com margem e impostos, e não de um preço digitado no olho; (b) a lista diária de quem chamar (ver D14). A metragem entra como item do catálogo com unidade em metro, não como cálculo automático.
- Consequência a assumir: sem a biblioteca pronta, o app perde o "começa sem cadastrar nada" como vantagem sobre o Auvo. O primeiro cadastro precisa ser muito rápido, ou o instalador abandona no mesmo ponto em que abandona o Auvo. Confiança: moderada.

### D11 — Biblioteca de itens e formação de preço
- Status: **Decidida** pelo Pedro em 19/09/2026.
- O usuário cadastra a própria biblioteca de serviços, materiais e equipamentos: item, unidade e custo.
- Sobre o custo do orçamento incidem margem líquida e impostos, configurados pelo usuário. O sistema monta o preço final.
- Biblioteca sugerida (tabela do Marco ou de fábrica) fica para uma fase posterior.
- **[PERGUNTAR]** duas coisas em aberto: como a margem é aplicada (ver D12) e se o v1 aceita importar planilha além do cadastro manual.

### D12 — Conta da margem
- Duas formas, e elas dão números diferentes:
  - **Markup sobre o custo**: preço = custo × (1 + margem). Margem de 30% sobre custo de R$ 100 dá R$ 130, mas a margem sobre a venda é de 23%.
  - **Margem sobre a venda (líquida)**: preço = custo ÷ (1 − margem − impostos). Com 30% de margem e 10% de imposto, custo de R$ 100 vira R$ 166,67, e sobram de fato 30%.
- **Decidido pelo Pedro em 19/09/2026: margem líquida sobre a venda.** Na tela são dois campos simples em porcentagem: imposto e margem líquida desejada. O app aplica `preço = custo ÷ (1 − margem − imposto)`.
- Seja qual for, o orçamento guarda custo, margem, imposto e preço, para dar para mostrar a margem de cada proposta depois.

### D13 — Interface sem cara de IA
- Status: **Decidida** pelo Pedro em 19/09/2026. Regras em `10_contexto/padroes_de_interface.md`.
- Resumo: sem subtítulo explicativo em cinza, sem texto de apoio não pedido, ambiente clean.
- Cor padrão: azul-escuro (quase marinho) como marca, verde só nos botões de WhatsApp. Aprovada pelo Pedro em 19/09/2026.

### D14 — Critério do "quem chamar hoje" 
- Problema levantado pelo Pedro: não adianta uma lista sem regra. Qual o prazo de follow-up e quem entra na lista.
- Proposta da IA, com padrões que o usuário pode mudar nas configurações:
  - **Orçamento enviado e sem resposta**: cobrar em 2 dias, depois em 7, depois em 21. Sem resposta em 45 dias, o app sugere marcar como perdida (nunca marca sozinho).
  - **Limpeza/manutenção**: residencial a cada 6 meses, comercial a cada 3, contados da última visita registrada.
  - **Cliente parado**: sem nenhum contato há 12 meses.
- Mecânica: cada cliente ou proposta carrega uma data de próximo contato. A lista do dia mostra o que venceu. As ações são "chamei" (reagenda sozinho), "adiar" e, no caso da proposta, "ganhou" ou "perdeu". Assim o CRM é uma data e uma lista, sem funil complicado.
- **Decidido pelo Pedro em 19/09/2026:** proposta aceita como ponto de partida, com a condição da D15.

### D15 — Parâmetros das mensagens automáticas ficam configuráveis
- Status: **Decidida** pelo Pedro em 19/09/2026.
- Todos os critérios de automação (prazos de cobrança de orçamento, periodicidade de limpeza, prazo de cliente parado, textos das mensagens) vivem **num lugar só** do sistema, nunca espalhados pelo código.
- Dois níveis: valores padrão, que o **usuário master** (nós) muda para todo mundo sem publicar versão nova; e ajuste por empresa, que o instalador faz nas configurações dele. O da empresa vence o padrão.
- Motivo: os números de hoje são chute e vão mudar depois do teste com instaladores.

### D16 — Biblioteca: só cadastro manual no início
- Status: **Decidida** pelo Pedro em 19/09/2026.
- O v1 tem apenas o cadastro manual dos itens.
- Para depois, na lista de melhorias: baixar um modelo de planilha e subir preenchido, e uma lista sugerida de equipamentos e materiais.
- O Pedro considera que a falta da biblioteca pronta não é problema nesta fase; a D10 fica registrada como risco observado, sem ação.

### D17 — Nome do produto
- Critérios do Pedro: português, uma ou duas palavras, e o usuário mais leigo consegue repetir.
- Critério acrescentado pela IA: fugir da raiz "frio", já usada por FRIIO PRO, FrioPro e Profiz, e de acento ou ç, que atrapalham na hora de digitar o endereço.
- Nomes propostos e recusados pelo Pedro: Ar Certo, Pinguim, Orçaí, Brisa, Iglu, Zero Grau, Polar, Neve, Gelu, Ventu, Climo, Sereno, Pingo.
- **Provisório, decidido em 19/09/2026: Frizo** (com z).
- **Trocado em 22/09/2026 para Clima Pro**, decisão da reunião com o Mauro e o Marco. É o nome inicial; pode mudar de novo.
- Ressalva registrada pela IA: "Frizo" fica perto de FRIIO PRO, FrioPro e Profiz. Enquanto for provisório, tudo bem; antes de gastar com marca, domínio ou material de feira, vale rever.
- Consequência prática: o nome aparece num lugar só do código (configuração da marca), para trocar depois sem mexer em tela.

### D18 — Estrutura da conta: individual na tela, empresa por baixo
- Status: **Decidida.** Proposta da IA em 19/09/2026, implementada no banco em 25/09/2026.
- Pedro definiu que no MVP é individual: cada pessoa tem sua conta, sendo empresa ou não, com uma tela de cadastro (CNPJ, razão social, telefone, logo) para sair no orçamento. Parceiros e equipe ficam para outra versão.
- Proposta: os dados pertencerem a uma conta desde já, e o usuário ficar ligado a ela. É a mesma ficha de cadastro que ele já quer, usada como dona dos clientes, itens e orçamentos.
- Custo agora: uma tabela a mais e uma coluna de conta nas demais, com as regras de acesso escritas em cima dela. Nada disso aparece na tela; não há convite nem permissão no v1.
- Custo de deixar para depois: migrar todos os registros de pessoa para conta e reescrever as regras de acesso, com risco de um usuário ver dados de outro no meio do caminho.
- Confiança: alta. **Confirmada na prática:** a regra de acesso por conta foi testada em 25/09 e a empresa A não enxerga nada da empresa B.

### D19 — Antes de trabalhar em outro projeto, perguntar
- Status: **Decidida** pelo Pedro em 19/09/2026.
- Se a mensagem tratar de um assunto diferente do app de ar-condicionado (por exemplo o RH Tracker), a IA pergunta antes de fazer qualquer coisa — inclusive antes de pedir acesso a pasta, abrir arquivo ou rodar comando. Pode ter sido mensagem mandada na conversa errada.

### D20 — Infraestrutura e acesso (19/09/2026)
- **Decidido:** publicar num endereço grátis da Cloudflare (conta que o Pedro já tem); domínio comprado depois. Repositório privado no GitHub e projeto novo no Supabase, só deste app. O Pedro cria os dois seguindo o passo a passo que a IA mandar.
- **Decidido:** a proposta chega ao cliente por link; PDF fica para depois.
- **Decidido:** não há cadastro aberto. Existe um **usuário master** (o Pedro) que cria a conta de cada cliente e define e-mail e senha. Recuperação de senha o Pedro quer deixar para melhorias.
  - **Ajuste aceito pelo Pedro em 19/09:** o "esqueci a senha" padrão do Supabase fica ligado no v1, porque não dá trabalho e evita perder instalador no meio do teste.

### D21 — Aceite com assinatura no link da proposta
- Status: **Proposta pelo Pedro em 19/09/2026**, a IA concorda.
- O cliente abre o link, toca em aprovar, digita o nome e escolhe entre dois ou três estilos (cursivo, rubrica, selo). Sem certificado e sem criptografia; é aceite de orçamento, não contrato.
- Acréscimo da IA, **aceito pelo Pedro em 19/09**: o que dá valor de prova não é o desenho, é o registro — nome digitado, data e hora, endereço de IP e aparelho. Guardar isso junto do aceite e mostrar no orçamento. E não chamar de "assinatura digital" na tela, para não prometer validade que não existe.

### D22 — CRM com etapas
- Ideia do Pedro: base de contatos (pessoa física ou jurídica, com dados e documentos opcionais), e um quadro com etapas: primeiro contato (nome provisório "leads"), orçamento, fechado e aguardando instalação, instalado. No fim, um relatório de entrega parecido com o orçamento.
- **Decidido em 19/09/2026: o Pedro concordou com toda a opinião abaixo.**
- Opinião da IA, registrada em 19/09: manter **uma única base de pessoas**, com marcador de virou cliente quando fecha o primeiro serviço, em vez de duas tabelas (contatos e clientes) que se duplicam; a etapa ser só um campo de situação no orçamento, mostrado como quadro no computador e como lista no celular, porque quadro com colunas arrastáveis é ruim de usar em tela pequena; a etapa "fechado → instalado" é barata (situação e data); o relatório de entrega com fotos é um módulo próprio e é a porta de entrada da OS do Marco, que estava na fase seguinte. Incluir agora aumenta o prazo.
- Situações do orçamento no v1: primeiro contato, orçamento enviado, fechado, instalado (com data). O relatório de entrega com fotos vai para as melhorias futuras.

### D23 — Três modelos de orçamento
- Status: **Decidida** pelo Pedro em 24/09/2026, depois da reunião de 22/09. Já implementado no protótipo.
- Ao criar um orçamento, o usuário escolhe entre três modelos, cada um com uma linha discreta de explicação na própria caixa:
  1. **Por margem** — define margem líquida e imposto, entra com o custo unitário, e o sistema calcula o preço de venda. É o modelo que já existia.
  2. **Por preço de venda** — entra com o preço final de cada item, puxado da biblioteca, e o sistema só soma.
  3. **Itens avulsos** — escreve os itens na hora com o preço final, e marca item a item se quer salvar na biblioteca.
- Consequência assumida: nos modelos 2 e 3 não existe cálculo de margem, então esses orçamentos não entram nas contas de custo e sobra da tela Números. Ponto levantado pela IA e aceito.
- O orçamento simplificado que o Marco pediu é o modelo 3 com uma linha só.

### D24 — Link da proposta usa código sorteado, não o id do orçamento
- Status: **Decidida** pela IA em 25/09/2026, ao ligar o banco.
- Cada orçamento ganha um `token` sorteado pelo banco, e é ele que vai no link.
  Quem recebe o link não consegue chutar o link do orçamento seguinte, nem
  descobrir quantos orçamentos a empresa tem.
- O visitante sem login não lê nenhuma tabela: só as três funções da proposta
  (ver, aprovar, recusar), e cada uma responde só por aquele token. Aprovar ou
  recusar funciona uma vez só.
- Confiança: alta. Testado em 25/09.

### D25 — Trava de papel no perfil
- Status: **Decidida** pela IA em 25/09/2026, corrigindo falha encontrada no teste.
- Fato que motivou: a regra de acesso deixava o usuário editar a própria linha de
  perfil sem olhar quais campos mudavam. Na prática, o dono de uma empresa
  conseguia se tornar master — e master enxerga todas as contas.
- Correção: um gatilho no banco recusa mudança de papel ou de conta feita por
  quem não é master. O usuário continua podendo trocar o próprio nome.
- Registrado aqui porque é o tipo de coisa que volta a acontecer se alguém
  reescrever as regras de acesso sem saber por que essa trava existe.

### D26 — Gravação com espera (meio segundo)
- Status: **Decidida** pela IA em 25/09/2026, ao ligar o banco.
- As telas salvam a cada tecla digitada. Isso não custava nada quando o dado
  ficava no navegador; com banco seria uma chamada de rede por letra digitada.
- Agora a tela muda na hora e a gravação espera meio segundo de silêncio. Sair da
  página ou fazer logout grava o que estava esperando.
- Alternativa descartada: botão "salvar" em cada tela. Custa um clique a mais em
  todo lugar e é exatamente o tipo de atrito que faz o instalador abandonar.
