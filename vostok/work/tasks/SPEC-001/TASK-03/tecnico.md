<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Foi feita a migração com TDD ([project/development-methodology-01]) de `Button`, `IconButton` e `MenuButton` a partir de `../atria/packages/ui/src/` (commit `139d036`): primeiro os testes do Atria, adaptados e completados até as regras de testes (papel e nome acessível, axe, teclado com `user-event`, props nativas), depois o código. Cada componente ficou em `src/<componente>/` com `.tsx`, `.module.css` e `.test.tsx` ([project/architecture-02]); nenhum tocou `src/index.ts` (TASK-12) nem `package.json`.

## O que muda em relação ao Atria (conformidade)

| Componente | Atria hoje | Na Vega |
|---|---|---|
| `Button` | Já estende `ComponentPropsWithRef<'button'>` e repassa `className`, `style` e `...rest`. | Mantido. O JSDoc de `tint` deixou de citar "raia" (termo do Atria, [project/architecture-04]) e ganhou JSDoc nas props públicas ([project/code-style-06]). |
| `IconButton` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>`: sem `ref` no tipo. `aria-label` já obrigatório. | `Omit<ComponentPropsWithRef<'button'>, 'children' \| 'aria-label'>` com `'aria-label': string` obrigatório ([project/accessibility-03]); teste de tipo com `@ts-expect-error` para a falta do nome e para texto. |
| `MenuButton` | Props próprias, sem props nativas: só `className`; sem `style`, `ref` nem `data-*`. | `Omit<ComponentPropsWithRef<'div'>, 'children'>` no `<div>` raiz, com `className`, `style`, `...rest` e `ref` (RF-20). |
| CSS dos três | `1px`/`2px` em bordas, `outline`, `outline-offset` e `box-shadow`; `font-weight: 600`; `z-index: 45` no menu. | `px` trocado por múltiplos de `--space` (RNF-02); `font-weight` → `--font-weight-semibold` e `z-index` → `--z-popover`. |
| Testes | Sem teclado no `Button` e no `IconButton`; sem CT-13; teste do CSS cita DEC-013 e o protótipo do Atria; `__dirname`. | Teclado, CT-06 e CT-13 acrescentados; referências do Atria tiradas; `import.meta.dirname` (ESM). |

Nenhum dos três tem texto visível fixo: o conteúdo vem de `children`, `trigger`, `label` e `items` (RF-19 não exigiu mudança aqui).

## Decisões

- **Peso de fonte e camada por token (decisão do usuário).** A TASK-02 criou `--font-weight-semibold` (600), `--font-weight-bold` (700), `--font-weight-extrabold` (800), `--line-height-tight` (1.1), `--line-height-relaxed` (1.6), `--z-dropdown` (40), `--z-popover` (45) e `--z-toast` (200); os componentes mapearam pelo valor: `font-weight: 600` → `var(--font-weight-semibold)` e o `z-index: 45` do menu → `var(--z-popover)`. A busca de literais da Verificação passa a pegar `font-weight`, `line-height` e `z-index` numéricos. Alternativa descartada: manter os valores numéricos, que feriam [project/code-style-02].
- **Literais em `px` viraram múltiplos de `--space`.** `1px` → `calc(var(--space) / 4)` e `2px` → `calc(var(--space) / 2)`, com o mesmo valor final (o `--space` vale `4px`), o que mantém a identidade (RN-03) e passa na busca do RNF-02. Alternativa descartada: criar tokens `--border-width`/`--focus-ring` no tema, que é escopo da TASK-02 (o briefing proíbe tarefa de componente criar token). Se a TASK-02 criar esses tokens, a troca fica para uma tarefa de ajuste.
- **`ref` por props (React 19), sem `forwardRef`.** O `ref` chega pelo `...rest` no `Button` e no `IconButton`. No `MenuButton`, que já usa um `ref` interno no `<div>` raiz para o clique fora, o `ref` recebido é ligado com `useImperativeHandle(ref, () => root.current as HTMLDivElement, [])`. Alternativa descartada: um utilitário `mergeRefs` compartilhado, que criaria um arquivo em comum com a TASK-04 (mesma onda) ou uma dependência de runtime nova (RNF-06).
- **`MenuButton` estende as props do `<div>` raiz.** O `className` passou a ser o nativo; `menuClassName` e `triggerClassName` continuaram como estavam (RN-02). Alternativa descartada: estender as props do `<button>` gatilho, que deixaria o raiz, onde ficam o posicionamento e o clique fora, sem `className`/`style`.
- **CT-06 em jsdom.** O jsdom não resolve a cascata de variáveis CSS nem aplica o `.module.css`, então o teste `ct06 ...` comprova a cadeia em três partes: (1) o contêiner tem `--primary` sobrescrito no `style`; (2) o botão `primary` tem a classe `.primary` e não redefine `--primary`; (3) o bloco `.primary` do `button.module.css` pinta `background` e `border-color` com `var(--primary)`, sem valor de reserva e sem redefinição da variável no módulo. Como variáveis CSS herdam pelo DOM, isso garante que o botão usa a cor do contêiner. A cor efetivamente pintada fica na captura `acoes-temas.png` (contêiner com `--primary: #ff5500`), gerada automaticamente (ver pontos de atenção). Alternativa descartada: `getComputedStyle` no jsdom, que devolve vazio para `var()` e daria um teste que não prova nada; um navegador real (Playwright) exigiria dependência e app de demonstração fora do escopo.

## Riscos

- **Testes que leem o CSS** (`color-mix` do `success`, `primary` em `aria-busy`, CT-06) dependem do texto exato dos blocos; a troca de literais não reformatou essas linhas além do Prettier.

## Referências da spec

RF-06, RF-09, RF-20, RNF-01, RNF-02, RNF-06, RNF-07, RN-02, RN-03, CT-06, CT-09, CT-13.

## Arquivos em comum com a onda

Onda 3: TASK-04 e TASK-11. Nenhum arquivo em comum: cada tarefa criou só as próprias pastas. A TASK-05 (onda 4) importa `../button/button`.

## O que foi feito

- **Arquivos criados:** nove, em três pastas (`src/button`, `src/icon-button`, `src/menu-button`), cada uma com componente, estilos e testes. Nenhum arquivo existente foi alterado.
- **Testes:** 36 testes em três arquivos, cobrindo papel e nome acessível, axe, teclado, props nativas (CT-13), a cadeia da cor de marca (CT-06) e o `@ts-expect-error` do `IconButton`, que exige `aria-label` e recusa texto como filho. A Verificação terminou sem falhas e sem regressão em relação ao baseline.
- **Estilos:** só tokens. Os `px` viraram múltiplos de `--space`, o peso de fonte e o `z-index` do menu viraram tokens, e o `box-shadow` do foco usa `calc(var(--space) / 2)`. Nenhum valor visual mudou.
- **Dependências:** nenhuma de runtime nova; `package.json` intacto.
- **Ajuste no `MenuButton`:** o reset de `alignStart` foi para o cleanup do `useLayoutEffect`, porque a regra `react-hooks/set-state-in-effect` recusou o `setState` direto no efeito. O comportamento é o mesmo.
- **Ajuste no teste do `IconButton`:** uma linha usa `// prettier-ignore` para manter o `@ts-expect-error` válido, já que o Prettier reformataria a linha e o erro esperado deixaria de estar na linha seguinte.

## Pontos de atenção

- **Captura `acoes-temas.png` automática, não manual.** O print foi gerado por um build temporário em `node_modules` com Chromium headless, sem arquivo novo no projeto. Conferido pelo usuário: mostra o botão do contêiner com `--primary` em laranja.
- **Testes que leem o CSS** continuam acoplados ao texto exato dos blocos (ver Riscos); qualquer reformatação manual deles pode quebrar a verificação.
- **Ponto aberto:** a TASK-02 não criou tokens de borda nem de anel de foco; as larguras ficaram em `calc(var(--space) / n)`. Se esses tokens forem criados depois, os estilos dos botões devem passar a usá-los.
