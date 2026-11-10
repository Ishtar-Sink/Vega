# TASK-08: Componentes de estrutura

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 4
- **Dependências:** TASK-03, TASK-04

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Componentes de estrutura
- **Tipo:** historia
- **Descrição:** Migra `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid`, `FormActions` e os ícones de visualização.
- **Critérios de aceite:**
  - [x] `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid` e `FormActions` existem nas próprias pastas e passam nos testes (RF-13).
  - [x] Os ícones `ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon` e `TimelineIcon` existem em `src/icons`, são SVG decorativos com `aria-hidden` e aceitam outro tamanho (RF-18).
  - [x] Cada componente passa no axe, e os interativos funcionam por teclado: setas, Home e End nas abas, Tab, Enter e espaço na troca de visualização, na busca e nas ações do formulário (CT-09).
  - [x] Os textos visíveis próprios dos componentes têm padrão em pt-br e podem ser trocados: `Buscar` na busca, `Cancelar` e `Salvar` nas ações (RF-19).
  - [x] Todo componente estende as props nativas do elemento raiz e repassa `className`, `style` e atributos `data-*` (RF-20, CT-13).
  - [x] O código passa no lint, no Prettier e na checagem de tipos, e os estilos não têm cor, medida, duração, peso de fonte, entrelinha nem camada (`z-index`) literal fora das condições de `@media` (RF-13, RF-20).
  - [x] Os componentes aparecem corretos nos temas claro e escuro e em tela estreita, com foco visível e estados ativos distinguíveis (RF-13, CT-09).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-03, TASK-04
