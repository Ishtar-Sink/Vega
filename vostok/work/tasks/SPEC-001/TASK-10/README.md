# TASK-10: Componentes de estado

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 4
- **Dependências:** TASK-03

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Componentes de estado
- **Tipo:** historia
- **Descrição:** Migra `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState` e `ProgressBar`.
- **Critérios de aceite:**
  - [x] `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState` e `ProgressBar` existem em `src/empty-state`, `src/loading-state`, `src/error-state` e `src/progress-bar` e passam nos testes (RF-15).
  - [x] O carregamento é anunciado com `aria-busy` e um texto para leitor de tela, e o esqueleto fica oculto da tecnologia assistiva (RF-15).
  - [x] Cada componente passa no axe, e a nova tentativa do erro funciona por teclado (CT-09).
  - [x] Os textos próprios têm padrão em pt-br e podem ser trocados: `Carregando` no carregamento e o título e o botão `Tentar de novo` do erro (RF-19).
  - [x] Todo componente estende as props nativas do elemento raiz e repassa `className`, `style` e atributos `data-*` (RF-20, CT-13).
  - [x] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal (RF-15, RF-20).
  - [x] Os estados aparecem corretos nos temas claro e escuro (RF-15, CT-09).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-03
