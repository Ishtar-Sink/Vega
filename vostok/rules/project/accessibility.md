# Acessibilidade

Define os requisitos de acessibilidade que todo componente da Vega cumpre.

[project/accessibility-01]: Todo componente atende ao WCAG AA.
[project/accessibility-02]: Tudo navegável por teclado, com foco visível e HTML semântico.
[project/accessibility-03]: Ícones em SVG inline com `aria-hidden="true"`; botão só com ícone exige `aria-label` no tipo das props.
[project/accessibility-04]: Erro de campo aparece com `role="alert"`, ligado ao campo por `aria-describedby`.
[project/accessibility-05]: Estado de carregamento anunciado com `aria-busy`.
[project/accessibility-06]: Diálogos usam o `<dialog>` nativo, aberto com `showModal()`.
