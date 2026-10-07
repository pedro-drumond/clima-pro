# Padrões de interface

Regras do Pedro (19/09/2026). Valem para todo protótipo e para o app.

## O que não fazer
- **Nada de subtítulo explicativo em cinza embaixo de cada campo, botão ou card.** Nada de "clique aqui para ver o resumo do mês". Se um texto de apoio for necessário, o Pedro pede.
- Nada de texto de boas-vindas, frase motivacional, dica do dia ou card vazio com parágrafo explicando o que aparecerá ali.
- Nada de ícone decorativo sem função e nada de emoji.
- Nada de rótulo repetido: se o campo já se chama "Valor", não escrever "informe o valor do serviço".

## O que fazer
- Tela limpa: título curto, conteúdo, ação. O nome do campo basta.
- Uma ação principal por tela, visível sem rolagem no celular.
- Números grandes e legíveis; o app é usado em obra, no sol, com a mão suja.
- Estado vazio em uma linha, sem parágrafo.
- Linguagem do instalador: "orçamento", "cliente", "metros de linha", "limpeza". Nunca "dashboard", "lead", "pipeline", "onboarding".

## Cor (aprovada em 19/09/2026)
- Marca: azul-escuro (petróleo/marinho). Frio combina com o setor, tem bom contraste sob o sol e não compete com o verde do WhatsApp.
- Verde só nos botões de enviar pelo WhatsApp, porque é a cor daquela ação e o app vive ao lado dele.
- Status: cinza para aberta, verde para aprovada, vermelho discreto para perdida. Fora isso, branco, cinza e o azul da marca.

## O que dá "cara de IA" (proibido na primeira versão e nas seguintes)
Regra do Pedro, 19/09/2026. A primeira versão costuma sair com a mesma cara de todo projeto feito por IA. Nada disso aqui:
- Fundo com degradê azul para roxo, em tela, cartão, cabeçalho ou botão. Fundo é branco ou cinza bem claro, e ponto.
- Subtítulo em cinza embaixo de cada título, campo ou cartão, explicando o óbvio.
- Emoji em título, botão, menu ou mensagem. Nem no app, nem no texto que vai para o cliente.
- Cartão com ícone colorido dentro de um quadradinho arredondado, em fileira de três, um do lado do outro.
- Sombra grande e borda arredondada demais; ícone decorativo em tudo; "brilho" e vidro fosco.
- Frase de efeito no topo da tela ("Gerencie seus orçamentos com facilidade").

O jeito certo aqui: fundo claro, uma cor de marca só, texto preto legível, espaço em branco, número grande onde o número importa. Uma fonte só, sem fonte decorativa.

## Bibliotecas prontas
- Vale usar peça pronta e pequena para coisa específica: máscara de CNPJ e telefone, campo de assinatura, geração de PDF, tabela.
- Não vale pegar tema ou painel administrativo pronto do GitHub. É exatamente de onde vem a cara genérica, e depois dá mais trabalho tirar o estilo do que ter feito do zero.
- O visual sai da regra acima, não do padrão que a biblioteca trouxer.

## Respiro e tamanho (19/09/2026, depois de ver a v1 no ar)
- Entrelinha 1,5 a 1,6. Espaço generoso entre título e conteúdo, entre linhas de lista e entre blocos.
- Botão de ação é pequeno: texto de 14px, altura baixa. O que separa um do outro é o espaço, não o tamanho.
- Caixa de número tem largura limitada (por volta de 200px). Caixa larga só quando o conteúdo é texto longo ou tabela. Espaço demais dentro de caixa vazia fica exagerado.
- Botão principal não ocupa a largura toda no computador; no celular, sim.
- "Voltar" fica acima do título, com espaço entre os dois.
- Quadro de etapas: cartões com espaço entre si, coluna rola por dentro quando enche, e o cabeçalho tem ordenação (mais recente, mais antigo, maior valor, menor valor, nome).
- Em lista, o texto quebra em mais de uma linha em vez de espremer.
- Na tela de entrada não aparece usuário nem senha de teste. Quem entrega o acesso é o master.

## Paleta e respiro (24/09/2026)
- Fundo azul bem claro, caixas brancas, contorno das caixas em azul mais escuro que o fundo. Nada de cinza chapado.
- Entrelinha 1,7. Espaçamento padronizado em quatro medidas (8, 16, 24 e 32 px) usadas no app inteiro: dentro da caixa, entre caixas, entre campos e entre título e conteúdo.
- Caixa discreta: quando tem texto longo dentro, o texto é justificado à esquerda, pequeno e em cinza-azulado; a caixa não cresce à toa.
- Explicação só onde o Pedro pediu. No momento, a única linha explicativa do app é a que descreve cada modelo de orçamento.
