# Onde paramos

Atualizado em: 25/09/2026
(seção de 03/10 no fim — o resto deste documento está velho)

## Fase
**Sistema real, não mais protótipo.** Banco, login e regras de acesso prontos e
testados. Falta o Pedro subir o `dist` no Cloudflare e testar pelo navegador.

## Onde estamos
O protótipo virou sistema. O que mudou desde 22/09:

- Projeto no Supabase: `wmkalrkerjmqzkjiowto` (região São Paulo).
- Tabelas, regras de acesso por empresa, numeração automática dos orçamentos e
  as três funções da proposta pública.
- Duas funções de servidor: criar conta de cliente e trocar senha — as duas só
  aceitam chamada do master.
- Todo o código das telas ligado no Supabase. Saiu o arquivo de dados de
  exemplo; não existe mais nada em localStorage.
- Usuário master criado: **pedro@rhrenovaveis.com.br**, senha inicial
  **ClimaPro2026!** (trocar no primeiro acesso).
- Pasta `~/Documents/Claude/Projects/Clima Pro` atualizada com o código novo e
  o `dist` novo. O `dist` velho foi apagado.

## Falha de segurança achada e corrigida (25/09)
No teste das regras de acesso, o dono de uma conta conseguia editar a própria
linha de perfil e se tornar master — e com isso enxergaria todas as empresas. A
regra permitia `id = auth.uid()`, sem olhar quais campos mudavam. Corrigido com
uma trava no banco: quem não é master não muda papel nem conta, só o próprio
nome. Testado depois da correção: bloqueia a escalada e continua deixando o
usuário trocar o próprio nome.

## O que foi testado (25/09)
Testado por dentro do banco, com as regras de acesso ligadas, simulando usuário
logado. Não deu para testar pelo navegador daqui: a rede desta máquina bloqueia
o endereço do Supabase.

- Criar cliente, orçamento e item; numeração começando em 1001. Passou.
- Proposta pública pelo token: abre com os dados certos. Passou.
- Visitante sem login não lê nenhuma tabela direto. Passou.
- Aprovar a proposta: grava nome, data e aparelho, fecha o orçamento e marca a
  pessoa como cliente. Passou.
- Aprovar duas vezes, ou token inventado: recusado. Passou.
- Empresa A não enxerga nada da empresa B. Passou.
- Dono não cria conta nem vira master. Passou (depois da correção).

## Pendências
- Ligar a proteção de senha vazada no Supabase (Authentication → Passwords).
  Um clique; impede senha que já apareceu em vazamento conhecido.
- Backup do banco: ainda não existe. O arquivo `backup-do-banco.yml.guardado`
  está na pasta; falta criar o workflow pelo site do GitHub e o segredo
  `SUPABASE_DB_URL`.
- Domínio climapro.com.br: Pedro precisa apontar os nameservers no Registro.br.
- Marco: prints de cerca de 10 telas do Auvo; instaladores para o teste.

---

# 03/10/2026 — cartão do quadro e registro de ações

## Decidido
- O cartão tem três coisas na coluna da esquerda: nome com a bolinha de
  temperatura, a linha cinza das ações, e o valor. No alto à direita fica só a
  data do próximo passo (cinza em dia, laranja atrasado, vermelho com ⚠ quando
  a validade venceu). Data sempre curta: `3/out`.
- A linha do meio mostra as **duas últimas ações**, lado a lado, com uma seta
  grande apontando da anterior para a mais recente. Passando o mouse, abre uma
  caixa com **todas** as ações na ordem em que foram feitas.
- Renovar e Perdido só aparecem no hover, na linha do valor.
- A temperatura vem da ação registrada, nunca de um palpite. Pedro gostou
  especificamente disso.
- Cada ação carrega um prazo fixo, e é esse prazo que vira a data de alerta no
  alto à direita.
- Termos fechados até agora: **Sem resp.**, **Desconto**, **Revisar**.
  Faltam dois: o genérico de "pediu tempo" e o que mostra negócio quente.
  Descartados: "Vai avaliar", "Achou caro" (é motivo de perda, não ação),
  "Comparando", "Adiou" (é perda), "Vai fechar", "Quer agendar".

## A fazer — alerta de orçamento parado
Pedido do Pedro, ainda não implementado. Um orçamento pode ser criado, ter o
PDF gerado e o link enviado, e **nunca receber nenhuma ação registrada**. Hoje
nada avisa. Regra combinada:

- Sete dias corridos sem nenhuma ação registrada → o cartão ganha um alerta
  simples de atrasado.
- O prazo é sempre de uma semana, independente do que estiver configurado em
  Minha empresa.

## Pergunta em aberto
Os prazos de cada ação estão fixos no código e não conversam com a 1ª/2ª/3ª
cobrança de Minha empresa (2/7/21 dias). São dois controles para a mesma coisa.
Pedro ainda não decidiu se unifica.

## Observação sobre a comunicação
O Pedro lê o chat, não os documentos. O que precisa ser decidido tem de aparecer
na resposta.
