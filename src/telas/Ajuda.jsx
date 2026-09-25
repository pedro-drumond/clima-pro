import React from 'react'

export default function Ajuda() {
  return (
    <>
      <div className="cabeca">
        <h1>Ajuda</h1>
      </div>

      <div className="ajuda">
        <div className="bloco">
          <h2>Início</h2>
          <p>
            É a tela que abre quando você entra. Ela responde três coisas de uma vez: quantas pessoas você precisa
            chamar hoje, quantos orçamentos estão esperando resposta, e quanto dinheiro está parado nesses orçamentos.
            O botão de novo orçamento fica logo abaixo, porque é o que você mais faz no dia.
          </p>
        </div>

        <div className="bloco">
          <h2>Quem chamar</h2>
          <p>
            A lista do dia. O sistema junta aqui todo mundo que tem alguma coisa vencida e mostra o motivo de cada um.
            Você chama pelo WhatsApp com a mensagem já escrita, e depois marca o que aconteceu. Entram nesta lista:
          </p>
          <ul>
            <li>quem recebeu orçamento e não respondeu, nos prazos que você definiu;</li>
            <li>quem está na época da limpeza do aparelho, contada desde a última visita registrada;</li>
            <li>cliente antigo que faz muito tempo que não aparece.</li>
          </ul>
          <p>
            Ao chamar alguém, você pode marcar que já falou, adiar para outro dia, ou, no caso de orçamento, dizer se
            ganhou ou perdeu. O sistema reagenda sozinho a próxima vez.
          </p>
        </div>

        <div className="bloco">
          <h2>Orçamentos</h2>
          <p>
            O quadro com as etapas: primeiro contato, enviado, fechado e instalado. Cada cartão é um orçamento, e a
            coluna mostra a soma do que está ali. No seletor <strong>Ver</strong> você troca entre o quadro e a lista de
            perdidos, e no <strong>Ordenar por</strong> muda a ordem dos cartões.
          </p>
          <p>Ao criar um orçamento você escolhe entre três modelos, e essa escolha muda como o preço é calculado:</p>
          <ul>
            <li>
              <strong>Por margem</strong> — você entra com o custo de cada item e o sistema calcula o preço de venda,
              já embutindo o imposto e a margem que você quer ganhar.
            </li>
            <li>
              <strong>Por preço de venda</strong> — você entra com o preço final de cada item e o sistema só soma.
            </li>
            <li>
              <strong>Itens avulsos</strong> — você escreve o serviço na hora, com o preço fechado. É o orçamento de uma
              linha só, para responder rápido.
            </li>
          </ul>
          <p>
            Em qualquer modelo você pode puxar itens da biblioteca ou escrever um item novo na hora. O item escrito na
            hora já vem marcado para ser salvo na biblioteca, e você desmarca se for algo que não vai repetir.
          </p>
        </div>

        <div className="bloco">
          <h2>A proposta e o PDF</h2>
          <p>
            Dentro do orçamento existem duas formas de mandar para o cliente, e as duas mostram a mesma proposta.
          </p>
          <ul>
            <li>
              <strong>Copiar link</strong> — o cliente abre no celular, vê a proposta e aprova ali mesmo, digitando o
              nome. Fica registrado quem aprovou, a data, a hora e de que aparelho, e o orçamento vai sozinho para a
              coluna de fechados.
            </li>
            <li>
              <strong>Gerar PDF</strong> — abre a proposta pronta para imprimir. Escolhendo "Salvar como PDF" na janela
              de impressão você fica com o arquivo para mandar por e-mail ou anexar onde quiser.
            </li>
          </ul>
          <p>
            A aparência da proposta você escolhe em Minha empresa: o modelo de cabeçalho e o desenho de aparelho que
            aparece nele.
          </p>
        </div>

        <div className="bloco">
          <h2>Seguro do equipamento</h2>
          <p>
            Dentro do orçamento existe a opção de incluir o seguro do aparelho. Você marca a opção, informa quanto vale
            o equipamento, e o sistema calcula o valor de um ano de cobertura. Ele entra como uma linha do orçamento e o
            cliente vê o preço já com o seguro dentro. O imposto e a margem continuam incidindo só sobre serviço e
            material.
          </p>
        </div>

        <div className="bloco">
          <h2>Clientes</h2>
          <p>
            Todo mundo com quem você já falou fica aqui, mesmo quem ainda não comprou. Para cadastrar bastam o nome e o
            WhatsApp; o resto você preenche quando precisar. Quem fecha o primeiro serviço passa a contar como cliente
            automaticamente.
          </p>
          <p>
            Na ficha de cada pessoa ficam os aparelhos instalados, com ambiente, marca, BTU e a data da última limpeza.
            É isso que faz a pessoa aparecer na lista de quem chamar quando chega a época da manutenção.
          </p>
        </div>

        <div className="bloco">
          <h2>Biblioteca</h2>
          <p>
            Os serviços, materiais e equipamentos que você usa sempre. Cadastrar uma vez evita digitar tudo de novo a
            cada orçamento. Em cada item você diz se o valor guardado é o <strong>custo</strong> ou o{' '}
            <strong>preço de venda</strong>, e é isso que define onde ele aparece:
          </p>
          <ul>
            <li>item de custo aparece no orçamento por margem;</li>
            <li>item de preço de venda aparece no orçamento por preço de venda;</li>
            <li>no orçamento de itens avulsos aparecem os dois.</li>
          </ul>
        </div>

        <div className="bloco">
          <h2>Financeiro</h2>
          <p>
            O resumo do seu movimento: quanto você orçou, quanto fechou, e quanto sobrou depois do custo e do imposto.
            Mostra também por que você está perdendo orçamento, com os motivos que você anotou ao marcar uma proposta
            como perdida.
          </p>
          <p>
            Uma coisa para ter em mente: só os orçamentos feitos por margem têm custo registrado. Os outros dois modelos
            entram no faturamento, mas ficam de fora da conta de sobra, porque neles o sistema não sabe quanto você
            gastou.
          </p>
        </div>

        <div className="bloco">
          <h2>Minha empresa</h2>
          <p>
            Tudo que é ajuste fica aqui, em caixas separadas:
          </p>
          <ul>
            <li>
              <strong>Dados que saem no orçamento</strong> — nome, documento, telefone, endereço e logo, que aparecem no
              cabeçalho da proposta.
            </li>
            <li>
              <strong>Formação de preço</strong> — o imposto e a margem líquida que você quer ganhar. O exemplo abaixo
              dos campos mostra na hora quanto ficaria um custo de mil reais.
            </li>
            <li>
              <strong>Acompanhamento dos orçamentos</strong> — de quantos em quantos dias cobrar quem não respondeu, e
              com quantos dias o sistema sugere dar a proposta como perdida.
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
              <strong>Aparência da proposta</strong> — o modelo de cabeçalho e o desenho de aparelho.
            </li>
            <li>
              <strong>Mensagens prontas do WhatsApp</strong> — os textos que o sistema usa ao chamar alguém. O que está
              entre chaves é trocado pelo valor de verdade na hora de enviar.
            </li>
          </ul>
        </div>

        <div className="bloco">
          <h2>Como a margem é calculada</h2>
          <p>
            A margem do Clima Pro é líquida sobre a venda, e não um acréscimo sobre o custo. A diferença muda o preço.
            Somando 30% a um custo de mil reais dá R$ 1.300, mas nesse preço a margem real é de 23%, porque os 30% foram
            calculados sobre o custo. Para sobrarem 30% de verdade, com 6% de imposto, o preço precisa ser R$ 1.562,50.
          </p>
          <p>
            É essa segunda conta que o sistema faz. Você diz quanto quer ganhar e quanto paga de imposto, e o preço sai
            de forma que sobre exatamente o que você pediu.
          </p>
        </div>
      </div>
    </>
  )
}
