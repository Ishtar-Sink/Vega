# TASK-07: Campo de dinheiro

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** approved
- **Onda:** 4
- **Dependências:** TASK-04

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Campo de dinheiro
- **Tipo:** historia
- **Descrição:** Migra `MoneyField` e as funções de máscara em centavos, com `Intl` no locale recebido.
- **Critérios de aceite:**
  - [ ] `MoneyField`, `maskMoneyInput`, `parseMoneyInput` e `formatCents` existem em `src/money-field/` e trabalham sempre com centavos inteiros, e os testes passam (RF-12).
  - [ ] Com outro locale e outra moeda, os valores seguem o `Intl` desse locale e os textos recebidos continuam os passados (RF-19, CB-03, CT-12).
  - [ ] O `MoneyField` estende as props do `TextField`, usa `valueCents` em `camelCase` e repassa `className`, `style`, `data-*` e `ref` ao `<input>` (RF-20, CT-13).
  - [ ] O campo passa no axe, funciona pelo teclado e mostra o erro com `role="alert"` (CT-09).
  - [ ] O estilo usa só propriedades sem literal, o `TextField` da TASK-04 continua passando e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-04
