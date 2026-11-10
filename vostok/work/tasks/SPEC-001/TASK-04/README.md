# TASK-04: Campos de texto e seleção

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 3
- **Dependências:** TASK-02

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Campos de texto e seleção
- **Tipo:** historia
- **Descrição:** Migra `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete` e `TagField`.
- **Critérios de aceite:**
  - [x] `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete` e `TagField` existem nas próprias pastas, cada um com `.tsx`, `.module.css` e `.test.tsx`, e os testes passam (RF-10).
  - [x] Os seis campos estendem as props nativas e repassam `className`, `style`, `data-*` e `ref` ao controle nativo (RF-20, CT-13).
  - [x] Os seis campos passam no axe, funcionam pelo teclado e mostram o erro com `role="alert"` ligado ao campo por `aria-describedby` (CT-09).
  - [x] Os textos visíveis do `Autocomplete` e do `TagField` são props com padrão em pt-br, e as props ficam em `camelCase` (RF-19, CT-12).
  - [x] Os estilos dos seis campos usam só tokens do tema e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02
