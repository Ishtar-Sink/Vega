### Concluída quando

- [ ] Os estados `offline`, `syncing`, `synced` e `error` aparecem com o ícone do estado, a palavra e o fundo suave do tom (`warning`, `info`, `success`, `danger`), nunca só pela cor (RF-13, CT-10).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovados `renders the offline state with its icon, word and soft background` (um por estado) e `maps each state to its tone and icon`.

- [ ] O estado `online` não renderiza nada na variante `chip` e mostra a palavra `Online` (ou a de `labels`) na variante `detail` (RF-14, CT-10).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovados `renders nothing for online in the chip variant` e `shows the online word in the detail variant`.

- [ ] A região `role="status"` anuncia a troca de estado, e o texto completo (progresso, tempo relativo e fila) fica fora dela, lido na navegação normal e sem ser anunciado a cada item (RF-15, RF-16, CT-11).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovados `announces the state change and keeps the progress out of the status region`, `keeps the full text accessible outside the live region` e `does not touch the status region when only the progress changes`.

- [ ] O progresso aparece no estado `syncing`, e com total zero o texto fica sem progresso (RF-16, CB-06).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovado `uses the text without progress when total is zero`, e no print ver `Sincronizando 2 de 5`.

- [ ] A fila aparece com o texto de `labels.pending`, e a última sincronização aparece como tempo relativo calculado sobre o `now` injetado, com o futuro tratado como agora (RF-16, CT-12, CB-07).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovados `shows the pending count outside the status region`, `shows the relative time of lastSyncedAt from the injected now` e `treats a future lastSyncedAt as now`.

- [ ] A `action` aparece no fim, nas duas variantes (RF-17, CT-12).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovado `renders the action at the end in both variants`.

- [ ] Os cinco estados passam no axe nas duas variantes, e os tons passam em AA nos dois temas (RNF-03, RNF-05, CT-10).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovados `has no axe violations in every state and variant` e `meets AA on every state in both themes`.

- [ ] A troca de estado usa só `--motion-fast` e não há animação contínua (RNF-04).

  > Como comprovar: em `testes-connection-status.txt`, ver aprovado `changes state with --motion-fast only and no animation`.

- [ ] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-07).

  > Como comprovar: a Verificação inteira termina com código 0, e `linhas-connection-status.txt` termina com "OK: arquivos de produção com até 200 linhas".

- [ ] O `ConnectionStatus` aparece correto nos temas claro e escuro e a 360 px, com os cinco estados nas variantes `chip` e `detail` (RF-13, RF-14, RNF-01).

  > Como comprovar: abrir `connection-status-360.png` e conferir os dois painéis, com `online` ausente no `chip`, os quatro estados com ícone e palavra, a fila, o tempo relativo e a ação sem corte.
