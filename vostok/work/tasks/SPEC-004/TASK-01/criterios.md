### Concluída quando

- [x] O `Timer` regressivo mostra `endsAt - now()`, o progressivo mostra `now() - startedAt`, ambos em `mm:ss` ou `h:mm:ss`, e o número muda na virada do segundo do `now` (RF-01, RF-02, RF-03, RF-04, CT-01, CT-02, CT-03).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `shows endsAt minus now and updates on the next second`, `ticks once per second aligned to the turn of the second`, `derives the time from the clock, not from a counter`, `shows hours as h:mm:ss` e `counts up from startedAt without warnings or end`.

- [x] O tempo atual está no nome acessível do `Timer` e o número visível não fica em região viva (RF-05, CT-04).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `names the timer with the remaining time` e `keeps the visible time out of any live region`.

- [x] Cada limite de `warnAt` é anunciado uma única vez na região viva própria, também com o tempo oculto; vários limites cruzados de uma vez anunciam só o menor; os limites já cruzados ao montar não são anunciados; e um `endsAt` maior re-arma os limites (RF-06, CT-05, CB-02, CB-03, CB-04).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `announces each warnAt limit once`, `still announces while the time is hidden`, `announces only the smallest limit when several are crossed at once`, `does not announce limits already crossed on mount`, `re-arms the limits when endsAt moves forward` e `sorts and dedupes warnAt`.

- [x] A pílula passa ao tom de aviso, com o ícone de relógio e sem piscar, no menor valor de `warnAt` ou, sem ele, a 5 minutos (RF-07).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `turns to warning at the smallest warnAt`, `turns to warning at 5 minutes without warnAt` e `changes tone with --motion-fast and no animation`; no print `timer-360.png`, ver o `04:10` em âmbar com o relógio.

- [x] Ao chegar a zero, o `Timer` mostra `00:00`, anuncia o fim e chama `onExpire` uma única vez, inclusive quando o `endsAt` já passou ao montar, sem anunciar os limites (RF-08, CT-06, CB-01).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `shows 00:00, announces the end and calls onExpire once` e `expires on mount without announcing the limits`.

- [x] O botão de ocultar troca o tempo por `tempo` e volta, pelo teclado, com o nome alternando entre "Esconder o tempo" e "Mostrar o tempo", controlado ou não, e tem 44 px (RF-09, CT-07, RNF-02).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `hides and shows the time with the keyboard`, `works as a controlled component`, `has no toggle when hideable is false` e `keeps a 44px toggle target`.

- [x] `formatDuration` devolve `00:00` para negativo, `59:59` para 3 599 000 ms e `4:30:00` para 4 h 30 min (RF-18, CT-13, CB-08).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `formats under one hour as mm:ss`, `formats from one hour as h:mm:ss` e `turns a negative value into 00:00`.

- [x] O `Timer` passa no axe, os tons passam em AA nos dois temas, repassa as props nativas e cabe ao lado do `FocusHeader` a 360 px (RNF-01, RNF-03, RNF-05, [project/code-style-03]).

  > Como comprovar: em `testes-timer.txt`, ver aprovados `has no axe violations`, `passes AA for the warning and normal tones in both themes` e `passes className, style, data attributes and ref to the root`; no print `timer-360.png`, ver o `Timer` na mesma linha do `FocusHeader` nos dois temas.

- [x] A pasta `src/timer` passa no TypeScript, no ESLint e no Prettier, o CSS só usa tokens e nenhum arquivo de produção passa de 200 linhas (RNF-07, [project/code-style-01], [project/code-style-02], [project/code-style-08]).

  > Como comprovar: rodar a Verificação da tarefa e ver todos os comandos terminarem com código 0, com a linha `OK: arquivos de produção com até 200 linhas`.
