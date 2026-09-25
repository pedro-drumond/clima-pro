# Clima Pro — protótipo navegável

Orçamento e acompanhamento para instalador de ar-condicionado. Esta versão guarda tudo no
navegador de quem usa: nada sai do aparelho e nada é compartilhado entre pessoas.
Serve para os sócios navegarem e criticarem antes de a gente ligar o banco de dados.

## Rodar na sua máquina

```
npm install
npm run dev
```

## Gerar a versão publicável

```
npm run build
```

Os arquivos ficam em `dist/`. É essa pasta que sobe para a Cloudflare Pages.

## Contas de teste

- Instalador: `marco@exemplo.com` / `123456`
- Master (cria contas de cliente): `master@climapro.app` / `master`

O botão "Recomeçar do zero" na tela de entrada apaga tudo e volta aos dados de demonstração.

## Onde fica cada coisa

- `src/dados/armazenamento.js` — o único arquivo que conhece onde os dados moram. Quando o app
  passar a usar Supabase, só ele muda.
- `src/dados/parametros.js` — prazos de cobrança, periodicidade de limpeza e textos do WhatsApp.
  Um lugar só, como combinado.
- `src/dados/agenda.js` — a regra do "quem chamar hoje".
- `src/dados/acoes.js` — tudo que altera dado.
- `src/telas/` — uma tela por arquivo.
- `src/estilo.css` — cores e espaçamento.

## O que ainda não existe aqui

PDF do orçamento, recuperação de senha, equipe e parceiros, ordem de serviço com fotos,
importação por planilha e qualquer coisa com inteligência artificial.
