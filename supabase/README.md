# Banco

Projeto no Supabase: `wmkalrkerjmqzkjiowto` (região São Paulo).

## Migrations

Cada arquivo em `migracoes/` é uma mudança já aplicada no banco, na ordem do
nome. Eles são a história do banco: com eles dá para recriar tudo do zero.

Quem aplica é a IA, pelo acesso direto ao Supabase. A regra combinada:
**antes de qualquer comando que apague ou altere dado em massa, ela pergunta.**
Mudança de estrutura (coluna nova, tabela nova, regra nova) ela avisa e aplica.

Depois de aplicar, o arquivo correspondente entra aqui e vai junto no commit.

## Backup

O plano grátis do Supabase **não faz backup nenhum** — nem diário, nem por data.
O próprio Supabase recomenda que quem está no grátis exporte o banco por conta.

Por isso existe `.github/workflows/backup-do-banco.yml`: todo dia de madrugada
ele gera uma cópia do banco inteiro e guarda no GitHub por 30 dias.

Para funcionar, o repositório precisa de um segredo chamado **SUPABASE_DB_URL**:

1. Supabase → Project Settings → Database → Connection string (modo URI)
2. GitHub → o repositório → Settings → Secrets and variables → Actions
3. New repository secret, nome `SUPABASE_DB_URL`, e cola a string

Quando entrar cliente pagante, vale trocar pelo plano Pro do Supabase
(US$ 25/mês, 7 dias de backup diário feito por eles). Recuperação por data
(PITR) é outro adicional, de cerca de US$ 100/mês — não compensa agora.

## Funções de servidor

`criar-conta` e `trocar-senha` rodam como Edge Function e só aceitam chamada de
quem é master. Elas não estão versionadas aqui ainda.
