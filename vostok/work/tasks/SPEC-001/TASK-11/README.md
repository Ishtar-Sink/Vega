# TASK-11: Marca e itens

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** approved
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

- **Título:** Marca e itens
- **Tipo:** historia
- **Descrição:** Migra `Badge` e generaliza `BrandLogo` e `ItemSwatch`, com marca e paleta por prop.
- **Critérios de aceite:**
  - [ ] O `BrandLogo` recebe `name` e `mark` por prop e mostra a marca recebida, sem nenhum desenho do "A" do Atria no componente (RF-16, CT-10).
  - [ ] O `ItemSwatch` usa a paleta recebida por `palette` e, sem ela, uma paleta padrão feita só de variáveis do tema (`--item-palette-*`), sem cor literal e sem `paletteFor` do Atria (RF-17, CT-11, CB-05).
  - [ ] O mesmo id gera o mesmo par de cores que gerava no Atria (RF-17).
  - [ ] O `Badge` mapeia cada tom de estado ao fundo `*Soft` correspondente e à cor cheia do tom no texto, com `primary` como padrão (RF-20, CT-13).
  - [ ] `Badge`, `BrandLogo` e `ItemSwatch` estendem as props nativas do elemento e repassam `className`, `style`, atributos `data-*` e `ref` ao elemento raiz (RF-20, CT-13).
  - [ ] Os três componentes passam no axe e os estilos usam só tokens, sem cor, `px` ou `ms` literal (RF-20, CT-13).
  - [ ] O código passa no typecheck, no ESLint e no Prettier, e o tema da TASK-02 continua igual (RF-20).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02
