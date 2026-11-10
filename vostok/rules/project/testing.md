# Testes

Define o que é testado, com quais ferramentas e com quais critérios na Vega.

[project/testing-01]: Todo componente tem teste com Vitest e Testing Library, consultando os elementos por papel e nome acessível.
[project/testing-02]: Todo componente passa no axe sem violações.
[project/testing-03]: Todo componente interativo tem a navegação por teclado testada com `user-event`.
[project/testing-04]: O contraste dos tokens é testado nos dois temas: 4,5:1 para texto e 3:1 para `textFaint`.
[project/testing-05]: Um teste confere que `tokens.css` e `tokens.ts` têm os mesmos valores.
[project/testing-06]: Testes determinísticos: nos componentes de data, o relógio é injetável e nada depende da data atual.
[project/testing-07]: Todo bug corrigido ganha um teste de regressão.
