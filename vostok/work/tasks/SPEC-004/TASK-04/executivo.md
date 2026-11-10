<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Reúne no ponto de entrada da Vega o cronômetro, a contagem de dias, o indicador de conexão, os dois cálculos de apoio e os tipos, para que o Synestia importe tudo pelo nome do pacote. Também roda a suíte inteira e o build com os três componentes juntos. Perfil `padrao`; risco baixo, porque um nome divergente aparece como falha do teste. Depende dos três componentes (TASK-01 a TASK-03) e desbloqueia a publicação da 0.3.0 (TASK-05).

## O que foi feito

O ponto de entrada da Vega agora oferece o cronômetro (`Timer`), a contagem de dias (`Countdown`), o indicador de conexão (`ConnectionStatus`) e os dois cálculos de apoio: a duração formatada e os dias entre duas datas. O Synestia importa tudo isso pelo nome do pacote, com os tipos. O pacote gerado foi conferido. Ele tem 127 exportações e os dois cálculos funcionam: 65 segundos aparecem como `01:05`, e de 10 a 17 de novembro dá 7 dias. O pacote também não faz nenhuma requisição de rede.

A tarefa também corrigiu a checagem de formatação do projeto. Os documentos HTML gerados ao finalizar a SPEC-003 não seguiam essa checagem, e por isso a integração contínua da `main` estava falhando. Esses documentos agora ficam fora da checagem. Sem a correção, a publicação da 0.3.0 também falharia.
