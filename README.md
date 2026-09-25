# Clima Pro

Sistema para instaladores de ar-condicionado: orçamento, proposta que o cliente
aprova pelo celular e acompanhamento de quem chamar.

Não é mais protótipo. Os dados ficam no Supabase, cada empresa só enxerga os
dados dela, e a proposta que o cliente abre não precisa de login.

## Onde está cada coisa

| Parte | Onde |
|---|---|
| Banco, login e regras de acesso | Supabase, projeto `wmkalrkerjmqzkjiowto` |
| Site | pasta `dist/` — é ela que sobe no Cloudflare |
| Código | pasta `src/` |

Endereço do Supabase e chave pública ficam em `src/dados/supabase.js`. A chave
pode ficar no código: ela só abre o que as regras do banco permitem.

## Publicar uma versão nova

`git push`. O Cloudflare está ligado neste repositório: ele compila e publica
sozinho a cada envio para o `main`. Ninguém arrasta pasta.

O arquivo `wrangler.jsonc` é o que diz ao Cloudflare que o site é a pasta
`dist`. O `dist` não vai para o repositório — quem o gera é o Cloudflare.

Para ver na sua máquina antes de enviar:

```
npm install
npm run dev
```

## Banco

Migrations versionadas em `supabase/migracoes`, e o backup diário em
`.github/workflows`. Ver `supabase/README.md`.

## Quem entra no sistema

Há dois papéis:

- **master** — é o Pedro. Vê a tela de Contas, cria a conta de cada empresa
  cliente, troca senha e define os parâmetros padrão. Não mexe em orçamento.
- **dono** — o instalador. Só enxerga a própria empresa.

O master cria a conta do cliente pela tela **Contas**: nome da empresa,
responsável, e-mail e senha inicial. O cliente entra com esse e-mail e senha e
troca a senha depois em Configurações.

## Estrutura do código

```
src/
  dados/
    supabase.js      endereço e chave do projeto
    armazenamento.js  única parte que conversa com o banco; as telas leem daqui
    acoes.js          tudo que grava
    agenda.js         quem chamar hoje, próxima cobrança, próxima limpeza
    parametros.js     prazos e textos padrão
  telas/              uma tela por arquivo
  componentes/base.jsx  moldura, menu e campos de formulário
```

Quem for mexer: a regra é que nenhuma tela fala com o banco direto. Lê de
`banco()` e chama uma função de `acoes.js`.

## Detalhes que não são óbvios

- **Preço**: a margem é líquida sobre a venda, não markup. A conta é
  `preço = custo ÷ (1 − margem − imposto)`.
- **Três modelos de orçamento**: por margem (entra custo, o sistema calcula o
  preço), por preço de venda (entra o preço final) e itens avulsos (escreve na
  hora, com opção de salvar na biblioteca). Nos modelos 2 e 3 não existe custo,
  então eles ficam de fora das contas de custo e sobra na tela Números.
- **Numeração**: cada empresa começa no 1001, contado pelo banco.
- **Proposta pública**: o link leva um código sorteado (`token`), não o id.
  Quem tem o link vê aquela proposta e nada mais — nem a lista da empresa.
  Aprovar ou recusar só funciona uma vez.
- **Digitação**: as telas salvam a cada tecla, mas a gravação no banco espera
  meio segundo de silêncio. É o que evita uma chamada de rede por letra.
