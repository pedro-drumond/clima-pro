# Técnico

## Stack (D08)
React + Vite (JavaScript, sem TypeScript) · Supabase para banco, login e funções
de servidor · publicação na Cloudflare. A IA escreve o código; o Pedro publica.

## Situação em 25/09/2026
Sistema rodando em Supabase. O protótipo com dados no navegador acabou —
`localStorage` saiu do código, e o arquivo de dados de exemplo foi apagado.

## Projeto no Supabase
- Id: `wmkalrkerjmqzkjiowto` · organização "pedro uol" · região São Paulo.
- Endereço: `https://wmkalrkerjmqzkjiowto.supabase.co`
- Chave publicável: `sb_publishable_Qqqrnx3P54cTaY8FPdLedA_Ay_PYICq`
  (pode ficar no código; ela só abre o que as regras do banco permitem).

### Tabelas
`contas` · `perfis` · `pessoas` · `equipamentos` · `itens` · `orcamentos` ·
`orcamento_itens` · `parametros_gerais` · `distribuidores` (criada, ainda sem
tela).

`perfis.id` aponta para o usuário do login. `papel` é `master` ou `dono`.

### Regras de acesso (RLS)
Toda tabela de dado de empresa usa a mesma regra:
`conta_id = conta_atual() ou eh_master()`. As duas funções leem o perfil do
usuário logado.

**Trava do perfil (25/09):** um gatilho impede que quem não é master mude o
próprio `papel` ou `conta_id`. Sem ele, o dono de uma conta se promovia a master
editando a própria linha e passava a ver todas as empresas. Foi achado no teste.

### Proposta pública
`orcamentos.token` é um código sorteado, separado do id. Três funções abertas
para quem não tem login, e nada além delas:

- `proposta_por_token(token)` — devolve a proposta pronta para a tela.
- `aceitar_proposta(token, nome, estilo, aparelho)` — grava o aceite, fecha o
  orçamento e marca a pessoa como cliente. Só funciona uma vez.
- `recusar_proposta(token, motivo)` — idem, para recusa.

Fora dessas funções, quem não está logado não lê nenhuma tabela.

### Funções de servidor (Edge Functions)
- `criar-conta` — cria a empresa, o usuário e o perfil de uma vez.
- `trocar-senha` — troca a senha de um usuário.

As duas conferem se quem chamou é master antes de fazer qualquer coisa.

### Migrações aplicadas
`estrutura_inicial` · `regras_de_acesso` · `proposta_publica` ·
`travar_papel_e_conta_do_perfil` · `travar_papel_liberar_servidor` ·
`fechar_funcoes_de_gatilho`.

## Código

```
src/dados/supabase.js       endereço e chave
src/dados/armazenamento.js  única parte que conversa com o banco
src/dados/acoes.js          tudo que grava
src/dados/agenda.js         quem chamar hoje, cobrança, limpeza
src/dados/parametros.js     prazos e textos padrão (D15)
src/telas/                  uma tela por arquivo
src/componentes/base.jsx    moldura, menu e campos
```

A regra continua valendo: nenhuma tela fala com o banco direto. Lê de `banco()`
e chama uma função de `acoes.js`.

### Gravação com espera
As telas salvam a cada tecla digitada. Isso servia quando o dado ficava no
navegador; com banco seria uma chamada de rede por letra. Agora a tela muda na
hora e a gravação espera meio segundo de silêncio. Quem sai da página ou faz
logout grava o que estava esperando.

Nos itens do orçamento é diferente: a lista inteira é regravada de uma vez, então
o que ele digita fica só na tela e vai para o banco quando sai do campo.

### Conta da margem
`preço = custo ÷ (1 − margem − imposto)`, margem e imposto em porcentagem (D12).
Vale para o modelo "por margem". Nos outros dois o preço é digitado direto, e por
isso eles não entram nas contas de custo e sobra da tela Números.

## Publicar
Pasta `dist/` → Cloudflare → Create deployment → arrastar a pasta.
Gerar o `dist` de novo: `npm install` e `npm run build`.

## Onde o projeto mora no Mac do Pedro
`~/Documents/Claude/Projects/Clima Pro`. A IA grava direto nessa pasta; o Pedro
não baixa nada do chat.

## Limitação do ambiente da IA
A máquina onde a IA roda não alcança o endereço do Supabase — a rede bloqueia.
Por isso o teste de ponta a ponta pelo navegador tem de ser feito no site
publicado, não aqui. O que dá para testar daqui é o banco por dentro, com as
regras ligadas, simulando usuário logado; foi assim que a falha do perfil
apareceu.

## Aviso que ficou em aberto
O verificador de segurança do Supabase aponta que `conta_atual()` e `eh_master()`
podem ser chamadas pela API. Não é risco: cada uma devolve só o dado de quem
chamou (a própria conta, o próprio papel). Tirar isso exige mover as funções para
outro esquema e reescrever todas as regras de acesso; fica para quando houver
motivo melhor. As funções de gatilho, essas sim, foram fechadas.
