# Tema

Define o tema padrão Ishtar Sink, a API de tema própria e as regras de cor, estado e movimento.

[project/theme-01]: O tema padrão é o Ishtar Sink, nos temas claro e escuro, com o claro como padrão.
[project/theme-02]: A API de tema exige o conjunto completo de tokens nos dois temas; o tipo recusa um tema incompleto.
[project/theme-03]: `tokens.ts` é a fonte única dos valores; `tokens.css` os espelha, com um comentário no topo apontando `tokens.ts` como origem.
[project/theme-04]: A camada de marca (`primary`, `primaryHover`, `primaryBright`, `primarySoft`, `primaryOn` e o gradiente `brand`) pode ser sobrescrita em tempo de execução por variáveis CSS, sem rebuild.
[project/theme-05]: As verificações de contraste são exportadas, para que um tema próprio passe pelas mesmas regras nos testes da aplicação.
[project/theme-06]: O fundo de um estado é sempre o token `*Soft` correspondente; `textFaint` nunca é texto de leitura; um estado não depende só do matiz.
[project/theme-07]: Animações só com tokens `--motion-*`, até 320 ms, respeitando `prefers-reduced-motion`.
[project/theme-08]: A Vega é a fonte de verdade da identidade visual do ecossistema: o que é decidido aqui prevalece sobre `Ishtar-Sink/.github` `docs/identidade-ecossistema.md`, e toda mudança de identidade é refletida nesse documento.
