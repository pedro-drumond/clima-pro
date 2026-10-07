# Plano do MVP funcional

Versão 1 — 16/09/2026. Rascunho para o Pedro validar. Decisões pendentes estão marcadas com **[DECIDIR]**.

## 1. O que a pesquisa de hoje mudou

Ao conferir os concorrentes (16/09/2026), apareceram dois fatos novos:
- **FRIIO PRO** tem bem mais do que a pesquisa de agosto dizia. Tem plano grátis (até 3 PDFs de orçamento por mês), clientes, OS com fotos e assinatura, follow-up de manutenção, calculadora de BTU e códigos de erro. O Gold custa R$ 29,90/mês, com 14 dias grátis. Ou seja, o freemium de "3 orçamentos por mês" sugerido pelo Mauro já existe no mercado, com o mesmo número.
- **Profiz** (da Leveros, segundo a App Store) é grátis e já tem orçamento, OS, checklists, agenda, equipes, PMOC e manuais.
- Existe também o **FrioPro** (friopro.dev.br), de R$ 11,90 a R$ 81,90/mês, com cálculo automático de orçamento por BTU e materiais, Pix e NFS-e.

**Consequência:** um app que seja "orçamento + CRM simples" chega a um mercado que já tem opção grátis e opção de R$ 30. O MVP precisa de um motivo claro para o instalador trocar de ferramenta. Pelo que surgiu na reunião, os candidatos são:
1. **Orçamento de instalação calculado pela metragem**: o instalador informa ambientes e metros de linha e o app monta materiais e mão de obra sozinho. É o que o Marco faz hoje à mão (croqui no Canva + Profiz).
2. **Preços já preenchidos com a referência do Marco**, calibráveis por região. O instalador começa a usar sem cadastrar nada (a dor do Auvo e, em parte, do Profiz).
3. **Agenda de dinheiro parado**: lista diária de quem chamar, com orçamentos em aberto e clientes na época de limpeza, e mensagem de WhatsApp pronta em um toque.
4. **Croqui a partir da planta ou foto com IA** (fase seguinte, ver 4.2).

Confiança nessa leitura: **moderada**. Vem de sites e loja de apps, não de conversa com instaladores. Por isso o MVP precisa ser testado cedo com a rede do Marco.

## 2. Formato e tecnologia **[DECIDIR]**

### Formato: web app mobile (PWA) antes de app de loja
- A favor: um código só, sem aprovação de Apple/Google, atualização instantânea, pode ser instalado na tela inicial, link de proposta abre em qualquer celular.
- Contra: menos "cara de app" na loja; notificação push no iPhone só funciona se o usuário instalar o PWA.
- Recomendação: PWA no MVP e loja depois, se o teste pedir. Confiança alta.

### Como construir — **decidido em 19/09: opção B**

| Opção | A favor | Contra |
|---|---|---|
| **A. Lovable + Supabase** | Tela pronta muito rápido; o Pedro já domina | A lógica fica espalhada nos prompts; documentação agnóstica mais difícil; ajuste fino depois via GitHub |
| **B. Código (React + Vite + Supabase), escrito pela IA; Pedro roda SQL e comandos; deploy na Cloudflare (já usada no v0)** | Tudo versionado e documentado na pasta; qualquer IA continua; é exatamente o fluxo que o Pedro descreveu | Um pouco mais lento no começo; o Pedro roda os comandos |
| C. App nativo (Flutter/React Native) | Loja e push nativos | Mais lento e caro; desnecessário para validar |

Escolhida: **B**. O motivo principal é a regra do projeto de ser agnóstico e documentado. Se a prioridade for demonstrar na Febrava (6 a 8/10), A é mais rápida para tela.

### Custos de infraestrutura na fase de teste
- Supabase grátis: 500 MB de banco, 1 GB de arquivos, 50 mil usuários ativos por mês, 2 projetos. **Pausa após 1 semana sem uso.** Pro: US$ 25/mês por projeto, necessário quando houver clientes pagando.
- Cloudflare Pages: grátis para esse porte.
- WhatsApp por link (`wa.me` com mensagem pronta): custo zero, sem API. O instalador toca e o WhatsApp dele abre com o texto. A API oficial (envio automático, agente de IA) fica para depois e é cobrada por conversa.
- IA: custo por uso, só na fase 4.2. Será medido no teste antes de definir preço.

## 3. Escopo do MVP v1 (funcional, com login e banco)

| # | Módulo | O que entrega |
|---|---|---|
| 1 | Conta e empresa | Login (e-mail; Google se for simples), dados da empresa, logo, CNPJ, telefone, texto padrão de observações e garantia |
| 2 | Biblioteca do usuário | Serviços, materiais e equipamentos cadastrados pelo próprio instalador: item, unidade, custo. Configuração de margem líquida e impostos; o app monta o preço final (D11 e D12). A tabela do Marco fica para depois |
| 3 | Clientes | Nome, WhatsApp, endereço, tipo (residencial/comercial); equipamentos (ambiente, BTU, marca, data de instalação) e histórico |
| 4 | Orçamento | Itens escolhidos da biblioteca, com quantidade (metro, unidade, hora). O app soma o custo e aplica margem e impostos. Condições de pagamento (à vista com desconto, parcelado), validade, observações |
| 5 | Envio e aprovação | PDF bonito com a marca do instalador; **link público** da proposta, em que o cliente vê e toca em "Aprovar" ou "Recusar"; botão de enviar pelo WhatsApp |
| 6 | Funil (Kanban) | Aberta → Aprovada → Perdida (com motivo). Contador de orçamentos em aberto e valor total parado |
| 7 | Quem chamar hoje | Lista diária, com as regras de prazo da D14. Cada linha tem mensagem de WhatsApp pronta e as ações "chamei", "adiar", "ganhou" e "perdeu" |
| 8 | Limite grátis (flag) | Contagem de orçamentos por mês, para testar o freemium. A cobrança fica manual (Pix) até validar |

**Fora do v1:** OS com técnico, relatório de entrega, carteira do técnico, PMOC, estoque, financeiro, nota fiscal, agente de WhatsApp, IA de croqui.

### Modelo de dados (resumo, detalhes virão em `50_tecnico/`)
`empresas` (inclui margem e impostos padrão) · `membros` (usuário ↔ empresa) · `itens` (serviço, material ou equipamento: unidade e custo) · `clientes` · `equipamentos` · `propostas` (status, token público, validade, condições, custo, margem, imposto, total, próximo contato, enviada/decidida em, motivo de perda) · `proposta_itens` (guarda custo e preço do momento) · `lembretes`.
Segurança por empresa (RLS do Supabase). A página pública da proposta lê só pelo token.

## 4. Fases

### 4.1 Etapas até o teste
| Etapa | Conteúdo | Estimativa (moderada) |
|---|---|---|
| E0 | Coletar com o Marco: tabela de preços de referência, kit de materiais por metro, modelo de croqui, periodicidade de limpeza, prints do Auvo, 5 a 10 instaladores para teste | depende do Marco |
| E1 | Discovery navegável v1 (protótipo novo, sem banco, já com modo instalação, funil e "quem chamar hoje") para o Marco e o Mauro criticarem | 2 a 3 dias |
| E2 | Base técnica: projeto Supabase, tabelas, login, empresa, catálogo | 3 a 5 dias |
| E3 | Clientes, orçamento (dois modos), PDF, link de aprovação, WhatsApp | 5 a 7 dias |
| E4 | Funil, "quem chamar hoje", limite grátis, ajustes de celular | 3 a 4 dias |
| E5 | Teste com 5 a 10 instaladores da rede do Marco, por 3 a 4 semanas | — |

As estimativas pressupõem desenvolvimento assistido por IA com o Pedro dedicando parte do dia. Febrava (6 a 8/10): chegar com **E1 pronto** é seguro; chegar com E3 funcionando é possível, mas apertado.

### 4.2 Depois do teste (se validar)
- **IA de croqui a partir da planta**: o instalador envia a planta, a IA propõe posições e metragens e o instalador confirma. É o caminho mais viável primeiro.
- **IA de medida por foto** (usando a porta como referência): fazer uma prova de conceito antes de prometer. A precisão é incerta.
- Assistente de precificação com o conhecimento do Marco.
- OS com técnico terceirizado → fotos antes/depois → relatório de entrega → carteira do técnico (fluxo do Marco).
- QR code na máquina; seguro como item do orçamento (Mauro); PMOC.
- Cobrança automática (assinatura).

### 4.3 Fase de canal
Com usuários e retenção para mostrar: conversar com a TCL, a Hisense e distribuidores (licenças em lote e comissão na venda de equipamento).

## 5. Como saber se deu certo (teste E5)
- Instaladores que mandam pelo menos 3 orçamentos por semana a partir da 2ª semana.
- Quantos continuam usando na 4ª semana.
- Taxa de aprovação das propostas pelo link.
- Quantos dizem que pagariam, e quanto. Perguntar diretamente e, se possível, cobrar um valor simbólico.
- O que fez o instalador trocar (ou não) do Profiz ou do FRIIO.

## Fontes da checagem de 16/09/2026
- App Profiz na App Store: https://apps.apple.com/br/app/profiz/id1534493326
- FRIIO PRO: https://friiopro.com/
- FrioPro: https://www.friopro.dev.br/
- Preços do Supabase: https://uibakery.io/blog/supabase-pricing

## Atualização de 19/09/2026
- Construção: opção B (React + Supabase + Cloudflare), decidida pelo Pedro.
- Biblioteca de itens é do próprio usuário; a tabela do Marco não será pedida agora (D11).
- O preço sai do custo com margem e impostos. A conta da margem está em aberto (D12).
- Interface sem subtítulo explicativo e sem cara de IA (D13 e `10_contexto/padroes_de_interface.md`).
- Regras de follow-up propostas na D14, aguardando o Pedro.
