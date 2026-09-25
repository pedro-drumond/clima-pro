// Um lugar só para os critérios das mensagens automáticas e seus textos.
// No app com banco, estes valores viram a tabela de parâmetros: o master muda o padrão
// de todo mundo e cada conta pode ajustar o seu por cima.

export const PARAMETROS_PADRAO = {
  cobrancaDias: [2, 7, 21],
  sugerirPerdaDias: 45,
  limpezaResidencialMeses: 6,
  limpezaComercialMeses: 3,
  clienteParadoMeses: 12,
  // seguro do equipamento (ideia do Mauro, reunião de 22/09):
  // até o limite é um valor fixo por ano; acima, uma porcentagem do aparelho
  seguroLimite: 8500,
  seguroFixoAno: 96,
  seguroPct: 1.25,
  textos: {
    enviarOrcamento:
      'Olá {pessoa}, aqui é da {empresa}. Segue o orçamento nº {numero}, no valor de {total}. É só abrir e aprovar por aqui: {link}',
    cobrarOrcamento:
      'Olá {pessoa}, passando para saber se ficou alguma dúvida no orçamento nº {numero} ({total}). Qualquer coisa eu ajusto. {link}',
    limpeza:
      'Olá {pessoa}, aqui é da {empresa}. Já deu o tempo de fazer a limpeza do seu ar-condicionado. Quer que eu agende?',
    clienteParado:
      'Olá {pessoa}, aqui é da {empresa}. Faz um tempo que não nos falamos. Está tudo certo com o seu ar-condicionado?',
  },
}

export function aplicarTexto(modelo, valores) {
  return Object.keys(valores).reduce(
    (texto, chave) => texto.split('{' + chave + '}').join(valores[chave] ?? ''),
    modelo
  )
}
