<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Reúne no ponto de entrada da Vega todos os componentes novos do lote, os ícones e os tipos, para que o Synestia importe tudo pelo nome do pacote. O componente de texto formatado fica de fora de propósito, na entrada própria, para não pesar em quem não usa Markdown. Perfil `padrao`; risco baixo, porque um nome divergente aparece como falha do teste. Depende de todos os componentes (TASK-02 a TASK-14) e desbloqueia a publicação da 0.2.0 (TASK-16).

## O que foi feito

O ponto de entrada da Vega agora tem todos os componentes do lote 1: os 36 ícones de interface, os 14 componentes novos (como o interruptor, a escolha única, os avisos, a folha inferior e a navegação do aplicativo) e os tipos de cada um. O Synestia importa tudo pelo nome do pacote, `@ishtar-sink/vega`. O componente de texto formatado continua de fora, de propósito: ele fica em `@ishtar-sink/vega/prose`, para quem não usa Markdown não carregar esse peso. Com tudo junto, a suíte inteira da Vega passa (744 testes) e o pacote gerado não faz nenhuma chamada de rede. A entrega foi verificada com testes automáticos, e as evidências foram conferidas pelo usuário.

## Pontos de atenção

- Esta é a última etapa antes da publicação da versão 0.2.0 (TASK-16).
- Todo nome novo que entrar na Vega precisa ser acrescentado também à lista do teste do índice; sem isso, o teste falha de propósito.
