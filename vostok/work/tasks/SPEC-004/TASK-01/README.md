# TASK-01: Timer

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-004
- **Status:** approved
- **Onda:** 1
- **Dependências:** -

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Timer
- **Tipo:** tarefa
- **Descrição:** Cria o `Timer` regressivo e progressivo, com ocultar, avisos, fim e o utilitário `formatDuration`.
- **Critérios de aceite:**
  - [ ] O `Timer` regressivo mostra `endsAt - now()`, o progressivo mostra `now() - startedAt`, ambos em `mm:ss` ou `h:mm:ss`, e o número muda na virada do segundo do `now` (RF-01, RF-02, RF-03, RF-04, CT-01, CT-02, CT-03).
  - [ ] O tempo atual está no nome acessível do `Timer` e o número visível não fica em região viva (RF-05, CT-04).
  - [ ] Cada limite de `warnAt` é anunciado uma única vez na região viva própria, também com o tempo oculto; vários limites cruzados de uma vez anunciam só o menor; os limites já cruzados ao montar não são anunciados; e um `endsAt` maior re-arma os limites (RF-06, CT-05, CB-02, CB-03, CB-04).
  - [ ] A pílula passa ao tom de aviso, com o ícone de relógio e sem piscar, no menor valor de `warnAt` ou, sem ele, a 5 minutos (RF-07).
  - [ ] Ao chegar a zero, o `Timer` mostra `00:00`, anuncia o fim e chama `onExpire` uma única vez, inclusive quando o `endsAt` já passou ao montar, sem anunciar os limites (RF-08, CT-06, CB-01).
  - [ ] O botão de ocultar troca o tempo por `tempo` e volta, pelo teclado, com o nome alternando entre "Esconder o tempo" e "Mostrar o tempo", controlado ou não, e tem 44 px (RF-09, CT-07, RNF-02).
  - [ ] `formatDuration` devolve `00:00` para negativo, `59:59` para 3 599 000 ms e `4:30:00` para 4 h 30 min (RF-18, CT-13, CB-08).
  - [ ] O `Timer` passa no axe, os tons passam em AA nos dois temas, repassa as props nativas e cabe ao lado do `FocusHeader` a 360 px (RNF-01, RNF-03, RNF-05, [project/code-style-03]).
  - [ ] A pasta `src/timer` passa no TypeScript, no ESLint e no Prettier, o CSS só usa tokens e nenhum arquivo de produção passa de 200 linhas (RNF-07, [project/code-style-01], [project/code-style-02], [project/code-style-08]).
- **Rótulos:** SPEC-004, julgamento
- **Estimativa:** julgamento
- **Bloqueada por:** -
