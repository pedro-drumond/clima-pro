# Como trabalhar neste projeto

Regras definidas pelo Pedro em 16/09/2026.

## 1. Documentação agnóstica
- Toda a inteligência do projeto fica nesta pasta. Nada importante pode existir só na memória de uma IA ou numa conversa.
- O material precisa funcionar se for levado para outra IA ou outra pessoa: quem ler o índice e `ONDE_PARAMOS.md` tem de conseguir continuar.
- Documentar **sempre**, durante o trabalho e não só no final.

## 2. O que atualizar a cada sessão
1. `00_gestao/HISTORICO.md`: nova entrada com data, o que foi feito, arquivos criados ou alterados.
2. `00_gestao/ONDE_PARAMOS.md`: reescrever para refletir o estado atual.
3. `00_gestao/DECISOES.md`: toda decisão nova, com o motivo e as alternativas descartadas. Mudança de decisão registra o fato novo que a justificou.
4. `00_INDICE.md`: sempre que um arquivo for criado, renomeado ou removido.

## 3. Execução técnica
- A IA **não executa** nada no banco nem no computador do Pedro. Ela escreve os comandos; o Pedro roda.
  - SQL: o Pedro roda no SQL Editor do Supabase.
  - Terminal: o Pedro roda na máquina dele.
- Todo SQL e todo comando entregue fica salvo em `50_tecnico/` (migrações numeradas, na ordem de execução), com a indicação de se já foi rodado.
- Depois que o Pedro rodar, registrar o resultado no `HISTORICO.md`.

## 4. Convenções
- Português do Brasil.
- Datas no formato DD/MM/AAAA.
- Arquivos em minúsculas, sem acento, com `_`. Reuniões começam pela data (`AAAA-MM-DD_`).
- Fontes originais (PDF, docx, prints) ficam guardadas junto da versão em texto.
