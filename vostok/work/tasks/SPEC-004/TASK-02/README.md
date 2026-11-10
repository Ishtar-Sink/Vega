# TASK-02: Countdown

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-004
- **Status:** done
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

- **Título:** Countdown
- **Tipo:** tarefa
- **Descrição:** Cria o `Countdown` em dias de calendário, com os tamanhos `display` e `inline` e o utilitário `daysBetween`.
- **Critérios de aceite:**
  - [x] O `Countdown` de 06/12/2026 a partir de 10/11/2026 mostra "Faltam 26 dias", usa "Falta 1 dia" no singular e não tem região viva (RF-10, CT-08).
  - [x] No dia da data mostra "É hoje" e depois dela mostra "Já passou", com os textos sobrescrevíveis por `labels` (RF-11, CT-09).
  - [x] O número é formatado no `locale`, a `caption` aparece e os tamanhos `display` (título grande em Outfit, peso 800) e `inline` (tamanho do texto) funcionam (RF-12).
  - [x] Com `target` ou `today` inválido, o `Countdown` não mostra número e avisa no console só fora de produção (CB-05).
  - [x] `daysBetween` devolve `26` de 10/11/2026 a 06/12/2026, negativo para data anterior, `0` no mesmo dia e acerta viradas de mês e ano bissexto (RF-18, CT-13).
  - [x] O `Countdown` passa no axe, não depende do relógio do sistema, repassa as props nativas ao `p` e cabe em 360 px nos dois temas (RNF-01, RNF-03, RNF-06, [project/code-style-03]).
  - [x] A pasta `src/countdown` passa no TypeScript, no ESLint e no Prettier, o CSS só usa tokens e nenhum arquivo de produção passa de 200 linhas (RNF-07, [project/code-style-01], [project/code-style-02], [project/code-style-08]).
- **Rótulos:** SPEC-004, padrao
- **Estimativa:** padrao
- **Bloqueada por:** -
