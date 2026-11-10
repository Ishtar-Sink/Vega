# Arquitetura

Define a organização do código, a superfície pública e os limites da Vega.

[project/architecture-01]: Repositório em pnpm workspace com um pacote publicado, `@ishtar-sink/vega`, que exporta componentes e temas.
[project/architecture-02]: Cada componente fica em `src/<componente>/`, com `<componente>.tsx`, `<componente>.module.css` e `<componente>.test.tsx`.
[project/architecture-03]: Toda exportação pública passa pelo `src/index.ts`, junto com os tipos das props; o que não está no índice é interno.
[project/architecture-04]: Componentes genéricos, sem regra de negócio de nenhum produto; um componente que só faz sentido para um produto fica no produto.
[project/architecture-05]: Nenhum produto do ecossistema recria um componente que já existe na Vega; o que faltar entra aqui.
[project/architecture-06]: Nenhum serviço externo em tempo de execução: fontes e ícones vêm no pacote.
[project/architecture-07]: `react` e `react-dom` são peer dependencies, nunca dependências diretas.
