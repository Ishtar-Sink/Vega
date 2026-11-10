# Estilo de código

Define as regras de escrita e qualidade do código TypeScript e CSS da Vega.

[project/code-style-01]: TypeScript sem `any` e sem `@ts-ignore`; ESLint (`strictTypeChecked`, `react-hooks`, `jsx-a11y`) e Prettier (`singleQuote`, `printWidth: 100`) com `--max-warnings 0`.
[project/code-style-02]: Estilos só com tokens do tema: nenhuma cor, raio, espaço, fonte ou duração literal.
[project/code-style-03]: Componentes são funções que estendem as props nativas do elemento (ex.: `ComponentPropsWithRef<'button'>`) e repassam `className`, `style` e `...rest`.
[project/code-style-04]: Funções curtas, com retorno antecipado e um único nível de abstração.
[project/code-style-05]: Sem código morto ou comentado; um `TODO` só existe com o ID da spec ou da tarefa.
[project/code-style-06]: Comentários explicam o porquê, não o quê; props públicas documentadas com JSDoc.
[project/code-style-07]: Componentes agnósticos: tipos de valor, máscaras, formatos e presets são definidos por props no uso, nunca fixos no componente (ex.: os períodos do calendário recebem um inteiro ou uma função que devolve o intervalo, como o mês anterior ou o próximo).
