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
          arraste o cartão para a coluna que quiser, ou use as setas que aparecem no alto dele. Cada passagem guarda a
          data em que aconteceu.
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
    id: 'acompanhamento',
    titulo: 'Acompanhamento',
    resumo: 'Quem chamar hoje e como registrar o contato',
    icone: Icone.telefone,
    texto: (
      <>
        <p>
          Fica dentro de Orçamentos, no botão <strong>Acompanhamento</strong>. O sistema junta ali todo mundo que tem
          alguma coisa vencida, separado por motivo. Entram nesta lista:
        </p>
        <ul>
          <li>quem recebeu orçamento e não respondeu, nos prazos que você definiu;</li>
          <li>quem está na época da limpeza do aparelho, contada desde a última visita registrada;</li>
          <li>cliente antigo que faz muito tempo que não aparece.</li>
        </ul>
        <p>
          Você chama pelo WhatsApp com a mensagem já escrita e depois registra o contato: escolhe o que aconteceu — não
          atendeu, falou e vai pensar, pediu para retornar, vai fechar — e o sistema marca sozinho a data do próximo
          passo. É esse registro que tira a pessoa da lista de hoje; enquanto você não registra, ela continua aparecendo.
        </p>
        <p>
          O que precisa de você também aparece no próprio quadro, como uma tarja na borda do cartão:{' '}
          <strong>laranja</strong> quando está na hora de cobrar, e <strong>vermelho</strong> quando o orçamento passou
          da validade. Cartão sem tarja é cartão que não precisa de ninguém hoje.
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
        <p>Dentro do orçamento existem duas formas de mandar para o cliente, e as duas mostram a mesma proposta.</p>
        <ul>
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
          A aparência da proposta você escolhe em Minha empresa: o modelo de cabeçalho e o desenho de aparelho que
          aparece nele.
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
          escolhe vale para todas: tanto para o link que o cliente abre quanto para o PDF.
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
          Cada opção mostra a proposta de verdade, reduzida. Em <strong>Ver inteiro</strong> ela abre em tamanho real,
          com um orçamento de mentira mas com a sua logo e os seus dados, e dá para imprimir para ver como fica no
          papel antes de escolher.
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
          O resumo do seu movimento: quanto você orçou, quanto fechou, e quanto sobrou depois do custo e do imposto.
          Mostra também por que você está perdendo orçamento, com os motivos que você anotou ao marcar uma proposta como
          perdida.
        </p>
        <p>
          Uma coisa para ter em mente: só os orçamentos feitos por margem têm custo registrado. Os outros dois modelos
          entram no faturamento, mas ficam de fora da conta de sobra, porque neles o sistema não sabe quanto você
          gastou.
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
          Tudo que é ajuste fica aqui, em caixas separadas. O imposto e a margem não ficam mais nesta tela: eles são
          definidos dentro do próprio orçamento por margem.
        </p>
        <ul>
          <li>
            <strong>Dados que saem no orçamento</strong> — nome, documento, telefone, endereço e logo, que aparecem no
            cabeçalho da proposta.
          </li>
          <li>
            <strong>Acompanhamento dos orçamentos</strong> — de quantos em quantos dias cobrar quem não respondeu, e com
            quantos dias o sistema sugere dar a proposta como perdida.
          </li>
          <li>
            <strong>Quando chamar para limpeza</strong> — de quanto em quanto tempo o cliente volta para a lista, e a
            partir de quando ele conta como cliente parado.
          </li>
          <li>
            <strong>Padrão do orçamento</strong> — validade, condições de pagamento e observações que já entram
            preenchidas em todo orçamento novo.
          </li>
          <li>
            <strong>Aparência da proposta</strong> — o desenho de aparelho que sai no cabeçalho. O modelo da proposta
            fica em Orçamentos, no botão Modelos.
          </li>
          <li>
            <strong>Mensagens prontas do WhatsApp</strong> — os textos que o sistema usa ao chamar alguém. O que está
            entre chaves é trocado pelo valor de verdade na hora de enviar.
          </li>
        </ul>
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
