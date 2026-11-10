### Baseline

- `pnpm vitest run src/button src/icon-button --reporter=verbose 2>&1 | grep -E '^\s+(✓|×)' | sed -E 's/ [0-9]+ms$//' | sort`
- `pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/button/|src/icon-button/)' | sort`
- `pnpm exec eslint src/button src/icon-button --max-warnings 0`

### Verificação

```bash
# evidência: testes-data-hora.txt
pnpm vitest run src/calendar src/date-field src/time-field src/date-time-field src/period-field --reporter=verbose
test -z "$(pnpm exec tsc --noEmit 2>&1 | grep -E '^(src/calendar/|src/date-field/|src/time-field/|src/date-time-field/|src/period-field/)')"
pnpm exec eslint src/calendar src/date-field src/time-field src/date-time-field src/period-field --max-warnings 0
pnpm exec prettier --check src/calendar src/date-field src/time-field src/date-time-field src/period-field
test -z "$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+(px|ms)\b|font-weight: *[0-9]|line-height: *[0-9]|z-index: *[0-9]' src/calendar/*.module.css src/date-field/*.module.css src/time-field/*.module.css src/date-time-field/*.module.css src/period-field/*.module.css | grep -v '@media')"
```

### Evidências

- `testes-data-hora.txt` (automática, da verificação)
  - Título: Testes dos campos de data e hora passam
  - Prova: os cinco componentes e as funções `parseTime`, `maskTime` e `resolvePeriod` passam nos testes de papel e nome acessível, axe, teclado, props nativas, textos sobrescritos, locale `en-US` e relógio do sistema falso (RF-11, RF-19, RF-20, CT-09, CT-12, CT-13, CT-16, CB-03).
  - Trecho: as linhas `✓` de `formats in the received locale and keeps the pt-BR texts`, `marks today from the injected date, not the system clock`, `passes className, style and data attributes to the control` (e `... to the root` no `Calendar`), `forwards the ref to ...`, `has no axe violations` e o resumo `Tests  N passed` sem `failed`.
  - Falha: linhas com `×`, `FAIL` ou `Tests  N failed`.
  - Requer: `src/calendar/calendar.test.tsx`, `src/date-field/date-field.test.tsx`, `src/time-field/time-field.test.tsx`, `src/date-time-field/date-time-field.test.tsx`, `src/period-field/period-field.test.tsx`
- `datas-outro-fuso.txt` (automática): `TZ=Pacific/Kiritimati pnpm vitest run src/calendar src/date-field src/date-time-field src/period-field --reporter=verbose`
  - Título: Datas iguais em outro fuso horário
  - Prova: com o processo num fuso de UTC+14, os mesmos testes de data passam, mostrando que o resultado não depende do relógio nem do fuso da máquina (CT-16, RF-11).
  - Trecho: as mesmas linhas `✓` de `testes-data-hora.txt` para as quatro pastas e o resumo sem `failed`.
  - Falha: algum `×` em teste de dia atual, grade do mês ou campos ocultos do período.
  - Requer: `src/calendar/calendar.test.tsx`, `src/date-field/date-field.test.tsx`, `src/date-time-field/date-time-field.test.tsx`, `src/period-field/period-field.test.tsx`
- `data-hora-temas.png` (manual): print anexado pelo usuário de uma página de teste local qualquer (fora do repositório) com, lado a lado nos temas claro (`data-theme="light"`) e escuro (`data-theme="dark"`): o `DateField` aberto com o dia atual marcado e um dia escolhido, o `TimeField` com `09:30`, o `DateTimeField` preenchido e o `PeriodField` aberto com um intervalo personalizado destacado e um campo com erro.
  - Título: Campos de data e hora nos temas claro e escuro
  - Prova: os componentes usam as cores do tema nos dois modos, com foco visível, dia atual, intervalo e erro distinguíveis sem depender só da cor (RF-11, CT-09).
  - Trecho: o anel de foco no dia focado, a borda do dia atual, o fundo `primary-soft` do intervalo e a mensagem de erro com texto.
  - Falha: cores fixas que não mudam entre os temas, texto ilegível no tema escuro ou foco invisível.
