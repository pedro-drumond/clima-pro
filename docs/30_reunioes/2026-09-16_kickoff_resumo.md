# Reunião de kickoff — 16/09/2026 (Google Meet, cerca de 14h30 a 15h30)

Participantes: Pedro Drumond Jr, Mauro Filho, Marco Souto (Juliana Souto aparece de passagem).
Fontes: anotações do Gemini e transcrição (`2026-09-16_kickoff_transcricao.md`). Os primeiros 20 minutos foram conversa pessoal e sobre seguros, sem relação com o projeto.

## Compromissos

| Quem | Compromisso | Situação |
|---|---|---|
| **Pedro** | Fazer um **discovery navegável** (protótipo com mockups) a partir da transcrição e dos dados. Levantar o que é mais demorado, mais caro e mais simples; propor etapas de lançamento para teste; pensar preço e custo, com e sem IA. | Em andamento |
| Marco | Tirar prints de cerca de 10 telas do Auvo e mandar no grupo | Pendente |
| Marco | Mandar o PDF de um orçamento do Profiz e o link do Profiz | PDF recebido (`20_pesquisa/exemplo_orcamento_profiz.*`); link foi mandado no grupo, mas não está aqui |
| Mauro | Mandar a transcrição no grupo | Feito |
| Marco (+ parceiros) | Criticar o protótipo e testar com instaladores da rede dele | Depois do protótipo |

Observação: as anotações do Gemini colocam como tarefa do Pedro "desenvolver ferramenta com IA para automatizar orçamentos e croquis a partir de fotos". Na conversa, o Pedro disse que *acha que consegue fazer*; não foi um compromisso firme. Está registrado como ideia a avaliar no discovery (ver `DECISOES.md`).

## Decisões da reunião
- **Alinhado:** o Pedro faz o discovery e o mockup navegável para testar e validar com a rede do Marco.
- **Alinhado:** procurar fabricantes (TCL, Hisense e outros) só **depois** de ter os primeiros usuários e assinantes.
- **Em aberto:** modelo freemium (grátis limitado, por exemplo 3 orçamentos por mês, e depois assinatura).

## O que se aprendeu

### A dor
- No solar, até o integrador que trabalha sozinho assina ferramentas avançadas (Greener, SolarZ, Sunhub, Luvik etc.). No ar-condicionado falta cultura de gestão comercial e as ferramentas são poucas (Mauro).
- O instalador de ar sofre para fazer orçamento. O Marco diz que ganha negócio só por entregar um orçamento formal com croqui.
- Instalador perde cliente no verão (não responde ninguém) e fica parado no inverno (não chama a base para limpeza). O Marco já treinou as esposas dos instaladores para responder o WhatsApp.
- Ninguém liga de volta para oferecer limpeza. Exemplo do Pedro: em 3 anos, o técnico dele nunca voltou a ligar, e uma ligação por ano bastaria para vender a limpeza.
- Distribuidores e instaladores quase não fazem pós-venda, por exemplo um adesivo com QR code na máquina.

### Como o Marco orça hoje
- O cliente manda a planta (em São Paulo todos têm). O Marco mede a tubulação à mão sobre uma base pronta no Canva e faz o croqui em cerca de 5 minutos. Sem planta, precisa de visita técnica.
- Monta o orçamento no **Profiz** (grátis) com uma biblioteca de serviços e materiais que ele mesmo cadastrou (material por metro linear) e condições de pagamento (à vista com 5% de desconto ou em até 3x). Gera o PDF.
- Acha o Profiz "até bobo, sem inteligência", mas simples, e usa muito (2 orçamentos numa manhã). Funciona no celular.
- Auvo: difícil demais para o pequeno. São 1 a 2 meses parametrizando, e 4 ou 5 instaladores que o Marco conhece pagaram 1 ou 2 meses e desistiram. Field Control é usado sobretudo para PMOC. O financeiro fica sempre separado (Conta Azul etc.).
- Na opinião do Marco, o instalador **paga** por um app desses.

### Ideias de funcionalidade (detalhes em `10_contexto/visao_produto.md`)
Proposta por link de WhatsApp; montagem simples; dimensionamento; cadastro de clientes com histórico; mini CRM com lembretes de reativação; Kanban ganho/perdido com alertas; biblioteca de preços já preenchida com a referência do Marco e ajustável por região; IA que mede o ambiente por fotos e gera o croqui ("sonho de consumo" do Marco); IA de apoio à precificação; agente de IA para atender no WhatsApp; fluxo de OS com técnico terceirizado e relatório de entrega; seguro como item do orçamento; PMOC; ligação com venda de equipamentos.

### Mercado (dados falados na reunião)
- Cerca de 100 mil instaladores de ar no Brasil, 42 mil deles empresas (número atribuído à Daikin).
- Cerca de 7 milhões de splits esperados em 2026 (Marco); os números dos anos anteriores ficaram confusos na fala.
- R$ 50 bi por ano.
- O multi-split não entra nas estatísticas; é um mercado regional (SP, Rio, BH).

### Canal
- A Daikin é restritiva (o Marco só pode dar treinamento para ela). A TCL está investindo forte no Brasil e é candidata a parceira. A Midea perdeu força. Hisense é outra opção.
- Ideias: fabricante compra licenças e distribui para os instaladores; fabricante compra o produto; ganhar comissão na venda de equipamentos.
- Febrava Rio (6 a 8/10/2026): Mauro terá estande e o Marco vai. É uma chance de mostrar a ideia, mas o Mauro disse que não precisa acelerar por causa disso.

### Planos de assinatura de limpeza (dito de passagem)
Algumas empresas estão testando um "plano de limpeza" por assinatura. O problema é que o cliente paga 2 meses e abandona (Marco).
