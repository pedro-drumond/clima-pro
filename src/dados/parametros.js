// Os poucos ajustes que uma conta tem. Tudo que virava mensagem automática saiu:
// o único texto que sobra é o do botão WhatsApp dentro do orçamento, e ele é
// fixo aqui no código — ninguém configura.

export const PARAMETROS_PADRAO = {
  // quantos meses depois da entrega o cliente volta para a lista de limpeza
  limpezaMeses: 6,
  // seguro do equipamento (ideia do Mauro, reunião de 22/09):
  // até o limite é um valor fixo por ano; acima, uma porcentagem do aparelho
  seguroLimite: 8500,
  seguroFixoAno: 96,
  seguroPct: 1.25,
}

export const TEXTO_ENVIO =
  'Olá {pessoa}, aqui é da {empresa}. Segue o orçamento nº {numero}, no valor de {total}. É só abrir e aprovar por aqui: {link}'

export function aplicarTexto(modelo, valores) {
  return Object.keys(valores).reduce(
    (texto, chave) => texto.split('{' + chave + '}').join(valores[chave] ?? ''),
    modelo
  )
}
