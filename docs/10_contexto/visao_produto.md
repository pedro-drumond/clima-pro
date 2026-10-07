# Visão de produto — ideias levantadas

Lista viva. A fase indicada é **candidata**; a decisão final sai do discovery (ver `00_gestao/DECISOES.md`).
Legenda de origem: [PA] pré-avaliação ago/2026 · [R] reunião 16/09/2026 (com quem falou).

## Núcleo candidato ao MVP
| # | Funcionalidade | Origem | Notas |
|---|---|---|---|
| 1 | Montar proposta/orçamento de forma simples: serviços, materiais, quantidade, valor, condições de pagamento | [PA], [R] Pedro/Marco | Formato de referência: `20_pesquisa/exemplo_orcamento_profiz.md` |
| 2 | Enviar a proposta por link no WhatsApp; cliente vê e aprova | [PA], [R] Pedro | O FRIIO PRO já tem isso, com assinatura digital |
| 3 | Biblioteca de preços do instalador, **já preenchida** com a referência do Marco e ajustável por região | [R] Mauro/Marco | Material por metro linear. Categorias do Profiz: climatização, linha branca, refrigeração |
| 4 | Condições de pagamento: à vista com desconto e parcelado | [R] Marco | Presente no exemplo do Profiz |
| 5 | Cadastro de clientes com equipamentos e histórico | [PA], [R] | |
| 6 | Kanban de propostas: aberta → ganha/perdida, com alerta ("você tem 5 orçamentos em aberto") | [R] Mauro | |
| 7 | Mini CRM de reativação: lembrete para chamar o cliente na época da limpeza/manutenção | [R] Pedro/Marco | Argumento: "só chamar a base já dobra o faturamento" |
| 8 | Freemium (por exemplo 3 orçamentos por mês grátis) e depois assinatura | [PA], [R] Mauro | Decisão em aberto |

## Diferenciais com IA (avaliar custo e viabilidade no discovery)
| # | Funcionalidade | Origem | Notas |
|---|---|---|---|
| 9 | Fotos do ambiente → medidas (usando a porta como referência) → croqui e metragem de tubulação → materiais no orçamento | [R] Pedro/Mauro/Marco | "Sonho de consumo" do Marco. Hoje ele faz à mão sobre a planta |
| 10 | Croqui a partir da planta enviada pelo cliente | [R] Marco | Caminho mais simples que a foto; em SP, todos têm planta |
| 11 | Dimensionamento (BTU por ambiente) | [R] Pedro | |
| 12 | Assistente de precificação treinado com o conhecimento do Marco | [R] Pedro | O Marco dá treinamento de precificação pela Daikin |
| 13 | Agente de IA que atende o WhatsApp do instalador na alta temporada | [R] Pedro/Marco | |

## Fase posterior candidata
| # | Funcionalidade | Origem | Notas |
|---|---|---|---|
| 14 | Proposta aprovada → OS → envio por WhatsApp ao técnico credenciado → check-in → fotos antes/depois → relatório de entrega ao cliente → aceite (ou aceite automático após 2 h sem resposta) → crédito na carteira do técnico com data de pagamento → fluxo de caixa | [R] Marco | Fluxo que Marco e Juliana procuram para a equipe terceirizada |
| 15 | Adesivo com QR code na máquina (data da instalação); o cliente escaneia e cai no instalador | [R] Marco | |
| 16 | Seguro do equipamento como item opcional do orçamento (queima por descarga elétrica não é coberta pela garantia) | [R] Mauro | Receita adicional; Mauro trabalha com seguros |
| 17 | PMOC para clientes comerciais | [PA], [R] Marco | [PA] recomenda deixar fora do MVP |
| 18 | Integração com distribuidor/fabricante para venda de equipamentos (comissão) ou venda de licenças | [PA], [R] | Fase 2, depois de ter tração |
| 19 | Plano de limpeza por assinatura para o cliente final | [R] Pedro/Marco | Risco: abandono após 2 meses |

## Fora do escopo por enquanto
Controle de estoque e financeiro completo ([PA]). O Marco confirma que o setor usa financeiro separado (Conta Azul).
