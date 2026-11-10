<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Publica a versão 0.2.0 da Vega no npm, com o lote de componentes que o Synestia precisa para montar as telas da fase 1. A publicação continua só pelo GitHub, com o selo público de origem. Também registra no histórico o que entrou e atualiza o README com os ícones e o componente de texto formatado. Perfil `julgamento`; risco alto pelo prazo do Synestia e pela dependência dos passos manuais do usuário (tag e acompanhamento). Depende do índice público (TASK-15) e fecha a SPEC-003.

## O que foi feito

A versão 0.2.0 da Vega está publicada no npm como a versão atual (`latest`), com o selo público de origem (provenance) e a mesma licença da 0.1.0. A publicação foi feita só pelo GitHub, a partir da tag `v0.2.0` criada pelo usuário, e o npm liberou a versão cerca de quatro minutos depois. O histórico de mudanças (CHANGELOG) lista tudo o que entrou no lote, e o README passou a explicar os ícones, a navegação e o componente de texto formatado. Com isso, o Synestia já pode instalar a Vega e começar a montar as telas da fase 1. A entrega foi verificada com testes automáticos, e as evidências foram conferidas pelo usuário.

## Pontos de atenção

- Dois tipos de textos padrão (`BottomSheetLabels` e `FocusHeaderLabels`) ficaram de fora do ponto de entrada, por decisão do usuário. Eles entram numa versão 0.2.1.
- O token de publicação no npm precisa migrar para a publicação confiável (Trusted Publishing) antes de janeiro de 2027.
