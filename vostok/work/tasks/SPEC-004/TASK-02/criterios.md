### Concluída quando

- [ ] O `Countdown` de 06/12/2026 a partir de 10/11/2026 mostra "Faltam 26 dias", usa "Falta 1 dia" no singular e não tem região viva (RF-10, CT-08).

  > Como comprovar: em `testes-countdown.txt`, ver aprovados `shows the days until the target`, `uses the singular for one day` e `has no live region`.

- [ ] No dia da data mostra "É hoje" e depois dela mostra "Já passou", com os textos sobrescrevíveis por `labels` (RF-11, CT-09).

  > Como comprovar: em `testes-countdown.txt`, ver aprovados `shows today and past` e `accepts other labels`.

- [ ] O número é formatado no `locale`, a `caption` aparece e os tamanhos `display` (título grande em Outfit, peso 800) e `inline` (tamanho do texto) funcionam (RF-12).

  > Como comprovar: em `testes-countdown.txt`, ver aprovados `formats the number with the locale`, `shows the caption`, `uses the display size by default and inline on request`, `uses the display typography` e `uses the text size inline`; no print `countdown-360.png`, ver o número grande com a legenda e a frase no tamanho do texto.

- [ ] Com `target` ou `today` inválido, o `Countdown` não mostra número e avisa no console só fora de produção (CB-05).

  > Como comprovar: em `testes-countdown.txt`, ver aprovados `renders nothing and warns for an invalid date`, `does not warn in production` e `rejects invalid dates`.

- [ ] `daysBetween` devolve `26` de 10/11/2026 a 06/12/2026, negativo para data anterior, `0` no mesmo dia e acerta viradas de mês e ano bissexto (RF-18, CT-13).

  > Como comprovar: em `testes-countdown.txt`, ver aprovados `counts calendar days until the exam`, `is negative when the target is before`, `is zero on the same day`, `crosses months and leap years` e `ignores daylight saving changes`.

- [ ] O `Countdown` passa no axe, não depende do relógio do sistema, repassa as props nativas ao `p` e cabe em 360 px nos dois temas (RNF-01, RNF-03, RNF-06, [project/code-style-03]).

  > Como comprovar: em `testes-countdown.txt`, ver aprovados `has no axe violations`, `does not depend on the system clock` e `passes className, style, data attributes and ref to the paragraph`; no print `countdown-360.png`, ver os cinco exemplos dentro do painel nos dois temas.

- [ ] A pasta `src/countdown` passa no TypeScript, no ESLint e no Prettier, o CSS só usa tokens e nenhum arquivo de produção passa de 200 linhas (RNF-07, [project/code-style-01], [project/code-style-02], [project/code-style-08]).

  > Como comprovar: rodar a Verificação da tarefa e ver todos os comandos terminarem com código 0, com a linha `OK: arquivos de produção com até 200 linhas`.
