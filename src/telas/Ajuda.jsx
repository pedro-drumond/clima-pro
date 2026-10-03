import React, { useState } from 'react'
import { Icone } from '../componentes/icones.jsx'

// cada assunto é um cartão na entrada da ajuda; clicando, abre só o texto dele.
// assim a página de entrada cabe numa tela e ninguém precisa rolar atrás do
// que quer saber.
const ASSUNTOS = [
  {
    id: 'orcamentos',
    titulo: 'Orçamentos',
    resumo: 'O quadro de etapas e os três modelos',
    icone: Icone.quadro,
    texto: (
      <>
        <p>
          O quadro com as etapas: em elaboração, enviados, fechados e entregues. Cada cartão é um orçamento, e a coluna
          mostra a soma do que está ali. O botão <strong>Perdidos</strong> mostra os que não deram certo, e cada um deles
          pode voltar ao quadro pelo <strong>Reabrir</strong>.
        </p>
        <p>
          O orçamento anda sozinho de <strong>em elaboração</strong> para <strong>enviados</strong> na primeira vez que
          você copia o link, gera o PDF ou abre o WhatsApp — é isso que agenda a primeira cobrança. Para mover à mão,
          arraste o cartão para a coluna que quiser, ou use as duas setinhas que aparecem no canto de cima dele. Cada
          passagem guarda a data em que aconteceu.
        </p>
        <p>Ao criar um orçamento você escolhe entre três modelos, e essa escolha muda como o preço é calculado:</p>
        <ul>
          <li>
            <strong>Por margem</strong> — você entra com o custo de cada item e o sistema calcula o preço de venda, já
            embutindo o imposto e a margem que você quer ganhar.
          </li>
          <li>
            <strong>Por preço de venda</strong> — você entra com o preço de venda de cada item e o sistema só soma.
          </li>
          <li>
            <strong>Itens avulsos</strong> — você escreve o serviço na hora, com o preço fechado. É o orçamento de uma
            linha só, para responder rápido.
          </li>
        </ul>
        <p>
          Em qualquer modelo você pode puxar itens da biblioteca ou escrever um item novo na hora. O item escrito na hora
          já vem marcado para ser salvo na biblioteca, e você desmarca se for algo que não vai repetir.
        </p>
        <p>
          No orçamento por margem, o bloco <strong>Preço</strong> traz a formação de preço: o imposto e a margem líquida.
          Mudando ali, vale só para aquele orçamento. O botão <strong>Salvar como padrão da empresa</strong> faz os
          próximos orçamentos já nascerem com esses números.
        </p>
      </>
    ),
  },
  {
    id: 'cartao',
    titulo: 'O cartão do quadro',
    resumo: 'Temperatura, o que já aconteceu e quando chamar',
    icone: Icone.telefone,
    texto: (
      <>
        <p>
          Na coluna <strong>Enviados</strong>, o cartão tem três coisas do lado esquerdo e uma do lado direito.
          Do lado esquerdo, de cima para baixo: quem é, o que já aconteceu, quanto vale. Do lado direito, no alto,
          quando você tem que chamar.
        </p>
        <p>
          O desenho antes do nome é a temperatura, e ela vem da última ação registrada — nunca do seu palpite. O{' '}
          <strong>cubo de gelo</strong> é negócio frio, as <strong>ondas de calor</strong> morno, a{' '}
          <strong>chama</strong> quente.
        </p>
        <p>
          A linha do meio mostra as <strong>duas últimas ações</strong>, com a seta apontando da anterior para a mais
          recente: <em>sem resp. → desconto</em> conta uma história que uma lista não contaria. Passando o mouse em
          cima dela você vê todas; abrindo o orçamento, elas aparecem inteiras, com a data de cada uma.
        </p>
        <p>
          No canto de cima à direita fica só a data: cinza é o dia de chamar, <strong>laranja com alerta</strong> é
          esse dia já passado, e <strong>vermelho com alerta</strong> é a validade vencida, quando o link do cliente
          deixa de aceitar aprovação. A tarja na borda esquerda do cartão acompanha. Cartão sem tarja não precisa de
          ninguém hoje.
        </p>
        <p>
          Orçamento que saiu e nunca recebeu nenhuma ação acende sozinho depois de <strong>sete dias</strong>. Esse
          prazo é fixo e não depende do que está em Minha empresa — é a rede de segurança para o orçamento que você
          mandou e esqueceu.
        </p>
      </>
    ),
  },
  {
    id: 'registrar',
    titulo: 'Registrar o que aconteceu',
    resumo: 'O balão do cartão e as frases de cada temperatura',
    icone: Icone.quadro,
    texto: (
      <>
        <p>
          Passando o mouse no cartão aparece um <strong>balão</strong> no rodapé. Ele abre primeiro os três desenhos de
          temperatura; você escolhe um e aí aparecem as frases daquela temperatura.
        </p>
        <ul>
          <li>
            <strong>Frio</strong> — Sem resposta, Achou caro, Sem pressa.
          </li>
          <li>
            <strong>Morno</strong> — Pediu desconto, Pediu revisão, Cotando com outro, Vai pensar, Depende de outro.
          </li>
          <li>
            <strong>Quente</strong> — Gostou, Pediu data, Forma de pagar, Aceitou falta assinar.
          </li>
        </ul>
        <p>
          Todas são coisas que <strong>o cliente fez</strong>. Nenhuma é leitura sua da conversa, e é por isso que a
          temperatura sai sozinha: você registra o fato e o sistema tira a conclusão.
        </p>
        <p>
          Cada frase já vem com o dia de chamar de novo, escrito do lado dela. Um clique na frase e está registrado. Se
          o dia tiver que ser outro — ele viajou, pediu para chamar daqui a três semanas — clique na data e escolha no
          calendário antes.
        </p>
        <p>
          Se nenhuma frase servir, o campo <strong>Outro</strong> aceita o que você quiser escrever, junto com a data.
          No cartão aparece só o começo do texto; o resto fica guardado e você lê abrindo o orçamento. Nas contas do
          Financeiro os textos livres contam todos juntos como "Outro", porque frase escrita à mão não dá para agrupar.
        </p>
        <p>
          No mesmo menu, embaixo, fica o <strong>Perdido</strong>. E quando a validade vence o balão dá lugar a{' '}
          <strong>Renovar</strong>, que empurra o prazo mantendo o preço, e <strong>Perdido</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'proposta',
    titulo: 'A proposta e o PDF',
    resumo: 'Mandar para o cliente e receber a aprovação',
    icone: Icone.documento,
    texto: (
      <>
        <p>Dentro do orçamento existem três formas de mandar para o cliente, e as três mostram a mesma proposta.</p>
        <ul>
          <li>
            <strong>Enviar pelo WhatsApp</strong> — abre a conversa com o cliente, com a mensagem e o link da proposta
            já digitados. É só apertar enviar.
          </li>
          <li>
            <strong>Copiar link</strong> — o cliente abre no celular, vê a proposta e aprova ali mesmo, digitando o nome.
            Fica registrado quem aprovou, a data, a hora e de que aparelho, e o orçamento vai sozinho para a coluna de
            fechados. Se ele recusar, o orçamento vai para os perdidos e você pode reabrir.
          </li>
          <li>
            <strong>Gerar PDF</strong> — abre a proposta pronta para imprimir. Escolhendo "Salvar como PDF" na janela de
            impressão você fica com o arquivo para mandar por e-mail ou anexar onde quiser.
          </li>
        </ul>
        <p>
          Passada a validade, o link para de aceitar aprovação. Para liberar de novo, é só renovar a validade dentro do
          orçamento.
        </p>
        <p>
          A aparência da proposta — o modelo, a cor e o desenho de aparelho do cabeçalho — fica em Orçamentos, no botão{' '}
          <strong>Modelos</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'modelos',
    titulo: 'Modelos de proposta',
    resumo: 'Escolher como o orçamento sai no papel',
    icone: Icone.folha,
    texto: (
      <>
        <p>
          Fica em Orçamentos, no botão <strong>Modelos</strong>. São quatro jeitos de a proposta sair, e o que você
          escolhe vale para todas: tanto para o link que o cliente abre quanto para o PDF. No alto da tela fica também o
          desenho de aparelho que sai no cabeçalho.
        </p>
        <ul>
          <li>
            <strong>Vertical</strong> — logo e dados da empresa centralizados no alto, e o orçamento empilhado abaixo.
          </li>
          <li>
            <strong>Horizontal</strong> — cabeçalho em faixa, com a empresa de um lado e a logo do outro.
          </li>
          <li>
            <strong>Dividido</strong> — uma coluna escura à esquerda com a empresa e os números do orçamento, e a
            proposta à direita.
          </li>
          <li>
            <strong>Enxuto</strong> — sem faixa nem cor, só a empresa num canto e o orçamento logo abaixo.
          </li>
        </ul>
        <p>
          Cada opção mostra a proposta de verdade, reduzida. Em <strong>Ver</strong> ela abre em tamanho real, com um
          orçamento de mentira mas com a sua logo e os seus dados, e dá para imprimir para ver como fica no papel antes
          de escolher. <strong>Usar este</strong> troca o modelo da empresa.
        </p>
        <p>
          As quatro bolinhas de cor embaixo de cada modelo mudam a cor da proposta inteira — azul, verde escuro,
          vermelho escuro ou grafite. A cor é uma só para a empresa: trocando em qualquer modelo, troca em todos.
        </p>
      </>
    ),
  },
  {
    id: 'seguro',
    titulo: 'Seguro do equipamento',
    resumo: 'Incluir um ano de cobertura no orçamento',
    icone: Icone.escudo,
    texto: (
      <>
        <p>
          Dentro do orçamento existe a opção de incluir o seguro do aparelho. Você marca a opção, informa quanto vale o
          equipamento, e o sistema calcula o valor de um ano de cobertura. Ele entra como uma linha do orçamento e o
          cliente vê o preço já com o seguro dentro. O imposto e a margem continuam incidindo só sobre serviço e
          material.
        </p>
      </>
    ),
  },
  {
    id: 'clientes',
    titulo: 'Clientes',
    resumo: 'A ficha da pessoa e os aparelhos instalados',
    icone: Icone.pessoas,
    texto: (
      <>
        <p>
          Todo mundo com quem você já falou fica aqui, mesmo quem ainda não comprou. Para cadastrar bastam o nome e o
          WhatsApp; o resto você preenche quando precisar. Quem fecha o primeiro serviço passa a contar como cliente
          automaticamente.
        </p>
        <p>
          Na ficha de cada pessoa ficam os aparelhos instalados, com ambiente, marca, BTU e a data da última limpeza. É
          isso que faz a pessoa aparecer na lista de quem chamar quando chega a época da manutenção.
        </p>
        <p>
          Em cima da lista fica o filtro <strong>Limpeza vencida</strong>: quem já passou do tempo desde o último
          serviço entregue. O prazo em meses você define em Minha empresa. É só informação — quem fala com o cliente é
          você, pelo WhatsApp, do seu jeito.
        </p>
        <p>
          O relógio da limpeza conta a partir da data em que o orçamento entrou na coluna <strong>Entregues</strong>,
          não do aparelho cadastrado. Então funciona mesmo que você nunca cadastre equipamento nenhum, e todo serviço
          novo entregue reinicia a contagem.
        </p>
      </>
    ),
  },
  {
    id: 'biblioteca',
    titulo: 'Biblioteca',
    resumo: 'Serviços e materiais que você usa sempre',
    icone: Icone.caixa,
    texto: (
      <>
        <p>
          Os serviços, materiais e equipamentos que você usa sempre. Cadastrar uma vez evita digitar tudo de novo a cada
          orçamento. Em cada item você diz se o valor guardado é o <strong>custo</strong> ou o{' '}
          <strong>preço de venda</strong>, e é isso que define onde ele aparece:
        </p>
        <ul>
          <li>item de custo aparece no orçamento por margem;</li>
          <li>item de preço de venda aparece no orçamento por preço de venda;</li>
          <li>no orçamento de itens avulsos aparecem os dois.</li>
        </ul>
        <p>
          A lista tem duas colunas de valor, <strong>Custo</strong> e <strong>Preço de venda</strong>, e cada item preenche
          só a sua; na outra fica um traço. O sistema não sugere por quanto um item de custo sairia, porque isso depende
          da margem que você usar em cada orçamento.
        </p>
        <p>
          Em cima tem busca pelo nome, ordenação por nome ou por valor, e um seletor para ver só os de custo ou só os de
          preço de venda. O botão <strong>Novo item</strong> abre uma janela para cadastrar, e o lápis de cada linha abre a
          mesma janela para corrigir — inclusive o valor, que não se digita direto na lista.
        </p>
      </>
    ),
  },
  {
    id: 'financeiro',
    titulo: 'Financeiro',
    resumo: 'Quanto você orçou, fechou e quanto sobrou',
    icone: Icone.grafico,
    texto: (
      <>
        <p>
          No alto você escolhe o período — este mês, últimos três, este ano ou tudo — e a tela inteira responde a ele.
          Os quatro números são: <strong>orçado</strong>, que é tudo que saiu de Em elaboração no período;{' '}
          <strong>fechado</strong>, o que o cliente aprovou; a <strong>taxa de aprovação</strong>; e o{' '}
          <strong>ticket médio</strong> por serviço fechado.
        </p>
        <p>
          A taxa de aprovação divide os fechados pelos fechados mais os perdidos. Quem recebeu o orçamento e ainda não
          respondeu fica de fora da conta, para não derrubar o número à toa.
        </p>
        <p>
          O gráfico mostra, mês a mês, quanto você orçou e quanto fechou. Passando o mouse em cima de um mês, aparecem
          os dois valores daquele mês. Embaixo ficam os motivos de perda, juntados e ordenados do mais comum para o
          menos.
        </p>
      </>
    ),
  },
  {
    id: 'empresa',
    titulo: 'Minha empresa',
    resumo: 'Seus dados, preço, prazos e mensagens',
    icone: Icone.empresa,
    texto: (
      <>
        <p>
          Sobraram duas caixas. O imposto e a margem são definidos dentro do próprio orçamento por margem; a validade e
          as condições de pagamento também, com o botão <strong>Salvar como padrão da empresa</strong> para os
          próximos já nascerem com elas.
        </p>
        <ul>
          <li>
            <strong>Dados que saem no orçamento</strong> — nome, documento, telefone, endereço e logo, que aparecem no
            cabeçalho da proposta.
          </li>
          <li>
            <strong>Lembrete de limpeza</strong> — quantos meses depois da entrega o cliente volta para a lista.
          </li>
        </ul>
        <p>
          O modelo, a cor e o desenho de aparelho da proposta ficam em Orçamentos, no botão <strong>Modelos</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'margem',
    titulo: 'Como a margem é calculada',
    resumo: 'Por que o preço não é custo mais margem',
    icone: Icone.calculo,
    texto: (
      <>
        <p>
          A margem do Clima Pro é líquida sobre a venda, e não um acréscimo sobre o custo. A diferença muda o preço.
          Somando 30% a um custo de mil reais dá R$ 1.300, mas nesse preço a margem real é de 23%, porque os 30% foram
          calculados sobre o custo. Para sobrarem 30% de verdade, com 6% de imposto, o preço precisa ser R$ 1.562,50.
        </p>
        <p>
          É essa segunda conta que o sistema faz. Você diz quanto quer ganhar e quanto paga de imposto, e o preço sai de
          forma que sobre exatamente o que você pediu.
        </p>
      </>
    ),
  },
]

export default function Ajuda() {
  const [aberto, setAberto] = useState('')
  const assunto = ASSUNTOS.find((a) => a.id === aberto)

  if (assunto) {
    const Desenho = assunto.icone
    return (
      <>
        <div className="cabeca">
          <div>
            <button className="botao texto voltar" onClick={() => setAberto('')}>
              Voltar
            </button>
            <h1>{assunto.titulo}</h1>
          </div>
        </div>

        <div className="ajuda-texto">
          <div className="bloco">
            <div className="ajuda-marca">
              <Desenho />
            </div>
            {assunto.texto}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="cabeca">
        <h1>Ajuda</h1>
      </div>

      <div className="ajuda-cartoes">
        {ASSUNTOS.map((a) => {
          const Desenho = a.icone
          return (
            <button key={a.id} className="ajuda-cartao" onClick={() => setAberto(a.id)}>
              <span className="ajuda-cartao-icone">
                <Desenho />
              </span>
              <span className="ajuda-cartao-titulo">{a.titulo}</span>
              <span className="ajuda-cartao-resumo">{a.resumo}</span>
            </button>
          )
        })}
      </div>

    </>
  )
}
