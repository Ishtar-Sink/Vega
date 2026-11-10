# TASK-03: Componentes de ações

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

- **Título:** Componentes de ações
- **Tipo:** historia
- **Descrição:** Migra `Button`, `IconButton` e `MenuButton` em conformidade com as regras.
- **Critérios de aceite:**
  - [x] `Button`, `IconButton` e `MenuButton` existem em `src/button/`, `src/icon-button/` e `src/menu-button/`, cada um com `.tsx`, `.module.css` e `.test.tsx`, e os testes passam (RF-09).
  - [x] Os três componentes estendem as props nativas e repassam `className`, `style`, `data-*` e `ref` ao elemento raiz (RF-20, CT-13).
  - [x] O `IconButton` exige `aria-label` no tipo das props e não aceita texto (CT-09).
  - [x] Os três componentes passam no axe e funcionam pelo teclado (CT-09).
  - [x] O `Button` usa a cor de `--primary` sobrescrita num contêiner, sem rebuild (CT-06).
  - [x] Os estilos dos três componentes usam só tokens do tema e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02
