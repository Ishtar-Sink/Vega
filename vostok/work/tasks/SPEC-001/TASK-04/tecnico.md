<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração com TDD ([project/development-methodology-01]) dos seis campos a partir de `../atria/packages/ui/src/` (commit `139d036`): primeiro os testes do Atria, adaptados e completados (teclado, erro, textos padrão e sobrescritos, props nativas), depois o código. Cada campo fica em `src/<componente>/` com `.tsx`, `.module.css` e `.test.tsx` ([project/architecture-02]); nenhum importa outro componente nem toca `src/index.ts` ou `package.json`.

Na execução inicial, testes e código foram escritos na mesma rodada, sem confirmar que os testes falhavam antes do código. Essa falha de processo está registrada em Pontos de atenção; a correção posterior seguiu o TDD completo.

## O que muda em relação ao Atria (conformidade)

| Componente | Atria hoje | Na Vega |
|---|---|---|
| `TextField` | `Omit<InputHTMLAttributes, 'id'>`; `className` no `<div>`, o resto no `<input>`; sem `ref` no tipo; `aria-describedby` recebido é sobrescrito. | `ComponentPropsWithRef<'input'>`; `className`, `style`, `...rest` e `ref` no `<input>`; `aria-describedby` recebido somado à ajuda e ao erro. |
| `Checkbox` | `Omit<InputHTMLAttributes, 'type' \| 'id'>`; `className` no `<div>`. | `Omit<ComponentPropsWithRef<'input'>, 'type'>`; tudo no `<input>`. |
| `SegmentedField` | Props próprias, só `className`. | `Omit<ComponentPropsWithRef<'fieldset'>, 'onChange' \| 'onBlur' \| 'children'>` no `<fieldset>` raiz. |
| `SelectField` | Props próprias, só `className`; sem `ref`. | `Omit<ComponentPropsWithRef<'button'>, 'value' \| 'onChange' \| 'onBlur' \| 'children' \| 'type'>` no gatilho; `ref` por `useImperativeHandle`; `font-size: 15px` vira `--font-size-base`. |
| `Autocomplete` | Props próprias; `empty_text`, `list_label` e `remove_label` obrigatórios e em `snake_case`. | Props nativas do `<input>`; `emptyText`, `listLabel` e `removeLabel` opcionais, em `camelCase` ([project/naming-convention-09]) e com padrão em pt-br ([project/language-06]); `listLabel`/`removeLabel` vão para a base. |
| `TagField` | Props próprias; `list_label` e `remove_label` obrigatórios em `snake_case`. | Props nativas do `<input>`; `listLabel` e `removeLabel` opcionais com padrão em pt-br. |
| CSS dos seis | `1px`, `2px`, `letter-spacing: 1px`, `15px`; `font-weight: 600`; `z-index: 40` nas listas. | `px` em múltiplos de `--space` ou token de fonte (RNF-02); `font-weight` → `--font-weight-semibold`; `z-index` → `--z-dropdown`. |
| Testes | Nomes com IDs da spec do Atria (`ct16`, `cb10`); testes que citam o protótipo; sem CT-13 nem CT-12. | Prefixos tirados; CT-12 e CT-13 acrescentados; `scrollIntoView` mockado no próprio teste. |

Erros de campo: todos os que têm `error` já usam `role="alert"` ligado por `aria-describedby` ([project/accessibility-04]); o `Checkbox` não tem `error` no Atria e continua sem (sem escopo novo, approve-plan-05).

Textos padrão: `Nenhuma opção encontrada`, `{label} escolhidas`, `Remover {opção}` (`Autocomplete`) e `{label} adicionadas`, `Remover {etiqueta}` (`TagField`). Os campos desta tarefa não formatam datas nem números, então o `locale` do CT-12 não se aplica aqui (fica na TASK-06 e na TASK-07).

## Decisões

- **Peso de fonte e camada por token (decisão do usuário).** A TASK-02 cria `--font-weight-*`, `--line-height-*` e `--z-*`; aqui, `font-weight: 600` → `var(--font-weight-semibold)` e o `z-index: 40` das listas do `SelectField` e do `Autocomplete` → `var(--z-dropdown)`, mapeados pelo valor. A busca de literais da Verificação pega `font-weight`, `line-height` e `z-index` numéricos. Alternativa descartada: manter os números.
- **Props nativas no controle, não no `<div>` de fora.** O RF-20 e a [project/code-style-03] pedem que o componente estenda as props nativas "do elemento" e repasse `className`, `style` e `...rest`; num campo, o elemento cujas props fazem sentido (valor, `name`, `onChange`, `ref` do `register` de formulários) é o controle. Então `className`, `style`, `...rest` e `ref` vão juntos ao `<input>` (`TextField`, `Checkbox`, `Autocomplete`, `TagField`), ao `<button>` gatilho (`SelectField`) ou ao `<fieldset>` (`SegmentedField`, que é o próprio raiz), e o CT-13 confere esse elemento. Alternativas descartadas: (a) estender as props do `<div>` de fora e criar `inputProps`, que quebra o uso com `{...register('campo')}` do Atria; (b) `className`/`style` no `<div>` e `...rest` no controle (o Atria hoje), que divide os três do CT-13 entre dois elementos. Consequência: quem posicionava o campo pelo `className` passa a envolvê-lo num elemento próprio (nenhum uso no Atria hoje); registrar no `CHANGELOG.md` (TASK-14). **Esta regra precisa valer igual nos campos da TASK-05, TASK-06, TASK-07 e no `Toolbar` da TASK-08.**
- **`ref` por props (React 19) e `useImperativeHandle` quando há `ref` interno** (`SelectField`, `Autocomplete`, `TagField`). Alternativa descartada: um `mergeRefs` compartilhado, que criaria arquivo em comum com a TASK-03 na mesma onda ou dependência nova (RNF-06).
- **Textos opcionais com padrão, em vez de obrigatórios.** [project/language-06] pede padrão em pt-br; nomes em `camelCase` mudam a API do Atria (RN-02 permite pela conformidade) e entram no `CHANGELOG.md`. Alternativa descartada: manter os nomes em `snake_case` como apelidos, que deixaria duas formas da mesma prop.
- **Literais em `px` viram múltiplos de `--space`** (`/ 4` = 1px, `/ 2` = 2px), mesmo valor final (RN-03). `15px` não tem token: vai para `--font-size-base` (16px), o mesmo tamanho do texto do controle; a diferença de 1px na opção da lista é a menor entre os tokens existentes. Alternativa descartada: criar tokens no tema (escopo da TASK-02).
- **Mocks do jsdom no próprio teste** (`scrollIntoView`). Alternativa descartada: depender do `src/test/setup.ts` da TASK-01, que pode não ter o mock e não está em "Mudar".

## Riscos

- **`--font-size-base` no lugar de `15px`** muda em 1px o texto das opções do `SelectField`. A evidência visual (`campos-temas.png`) foi conferida pelo usuário.
- **Tipos do `Autocomplete`:** as sobrecargas e a união das props com o `Omit` das props nativas são o ponto mais sensível do `tsc`; a regra do passo 15 lista exatamente o que não pode chegar ao `<input>` (`multiple` viraria atributo HTML).

## Referências da spec

RF-10, RF-19, RF-20, RNF-01, RNF-02, RNF-06, RN-01, RN-02, RN-03, CT-09, CT-12, CT-13.

## Arquivos em comum com a onda

Onda 3: TASK-03 e TASK-11. Nenhum arquivo em comum. A TASK-07 (onda 4) importa `../text-field/text-field`, e a TASK-08 também usa o `TextField`.

## O que foi feito

**Criado:** seis pastas em `src/` (`text-field`, `select-field`, `checkbox`, `segmented-field`, `autocomplete`, `tag-field`), cada uma com o componente, a folha de estilos do módulo e o arquivo de testes. Os componentes foram trazidos do Atria e adaptados conforme a tabela de conformidade acima.

**Como:** a adaptação seguiu os passos da execução: testes trazidos do Atria e completados, troca dos literais de CSS por tokens, props nativas no controle, textos padrão em pt-br e nomes em `camelCase`. A Verificação inteira passou sem falhas, com a regressão igual ao baseline e as três evidências (`campos-testes.txt`, `campos-textos-padrao.txt` e `campos-temas.png`) conferidas pelo usuário. A saída da verificação está em `validation/tests.out`.

**Print automático:** o print manual virou automático, gerado com um build temporário em `node_modules` e Chromium headless, sem arquivo novo no projeto (ajuste 1 do histórico).

**Correção do box-sizing (print rejeitado):** o primeiro `campos-temas.png` mostrou `TextField` e `TagField` passando da borda do contêiner. O input tinha `width: 100%` com `padding` sem `box-sizing: border-box`, e no Atria havia um reset global do app que resolvia isso; a Vega não pode depender disso. A correção seguiu TDD: quatro testes de regressão escritos antes e vistos falhando, depois `box-sizing: border-box` no `.control` de `TextField`, `TagField` e `SelectField` e no `.group` de `SegmentedField` (no `SelectField` e no `SegmentedField`, de forma preventiva, pela mesma causa). Resultado: 58 testes passando e novo print aceito pelo usuário.

**Mudança de API:** `className`, `style`, `ref` e `data-*` agora vão ao controle, não ao `<div>` de fora. Os nomes `emptyText`, `listLabel` e `removeLabel` substituem `empty_text`, `list_label` e `remove_label`, e ficam opcionais com padrão em pt-br. Ambas as mudanças precisam entrar no `CHANGELOG.md` na TASK-14.

**Autocomplete:** `value` e `onChange` saem do `...rest` com duas diretivas `eslint-disable` de `no-unused-vars`, porque são desestruturados só para não chegar ao `<input>`.

## Pontos de atenção

- **Processo de TDD não seguido na primeira rodada:** testes e código foram escritos juntos e a falha dos testes não foi confirmada antes do código. A correção do box-sizing foi feita com o ciclo completo (testes vistos falhando antes).
- **Duas diretivas `eslint-disable`** no `Autocomplete` (`no-unused-vars`) para `value` e `onChange`; é a parte do código que merece revisão futura.
- **Tipos do `Autocomplete`** continuam sendo o ponto mais sensível do `tsc` (ver Riscos).
- **Quem posicionava o campo pelo `className`** precisa envolvê-lo num elemento próprio; a mudança está prevista para o `CHANGELOG.md` (TASK-14).
- **Regra para as tarefas seguintes:** as TASK-05, TASK-06, TASK-07 e o `Toolbar` da TASK-08 devem seguir a mesma regra de props no controle e o mesmo padrão de `box-sizing`.
