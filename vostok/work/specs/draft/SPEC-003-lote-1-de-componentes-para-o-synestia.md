---
id: SPEC-003
title: "Lote 1 de componentes para o Synestia"
status: refined
author: "Victor Batalha"
created_at: 2026-11-10T17:44:48Z
updated_at: 2026-11-10T17:44:48Z
tags: []
---

# Lote 1 de componentes para o Synestia

Criar na Vega o lote 1 de componentes pedido pelo Synestia no [KT-001](../../../../docs/KT-001-vega-lote-1.md): nove componentes novos (ícones, `Switch`, `RadioGroup`, `TextAreaField`, `Disclosure`/`Accordion`, `Callout`, `BottomSheet`, `Prose` e `AppShell` com `Sidebar`, `BottomNav` e `Topbar`) e extensões de `Button`, `ProgressBar`, `Card` e `PageHeader`, para o Synestia montar as telas só com a Vega.

## Contexto

Recurso novo. O Synestia é a plataforma de estudos do ecossistema (estudo em passos, revisão espaçada, simulados, celular primeiro e offline). A fase 1, de uso pessoal, precisa estar usável por volta de 22/11/2026, antes de uma prova em 06/12. A regra do Synestia é montar a interface só com a Vega, e a da Vega ([project/architecture-05]) é que o que faltar entra nela, não no produto.

O pedido veio do Synestia como documento de transferência de conhecimento, o `docs/KT-001-vega-lote-1.md` (fontes: ESTUDO-002 e ESTUDO-003 do Synestia), com as interfaces propostas, o comportamento, a acessibilidade e os critérios de cada componente. As interfaces são propostas: nomes finais e detalhes ficam para o refinamento, e os itens marcados "a Vega decide" são decididos aqui.

Prazo desejado: o lote inteiro publicado até 15/11/2026, para o Synestia ter uma semana de montagem das telas. Se não der, a ordem de entrega do KT-001 (seção "Ordem e dependências") entrega primeiro o que mais destrava.

Fora do escopo: o lote 2 (`FileField`, `Breadcrumbs`, `Avatar`, `Tooltip`, `DataTable`, `StatTile`, `Timer`, `ConnectionStatus` e extensões de `Toast`, `Tabs`, `EmptyState` e da escala de leitura); os componentes próprios do Synestia (conta armada, escada de dicas, cartão de revisão, grade do simulado), que ficam nele, montados sobre estes; e a troca do Atria para os componentes novos, que vira uma spec no Atria.

## Recursos

- **Ícones:** componente-base interno `Icon` e um componente por ícone, com os caminhos SVG do Lucide copiados para a Vega (24 × 24, `stroke="currentColor"`, `strokeWidth` 2, pontas arredondadas), `aria-hidden="true"` e tamanho padrão 20 (`size?: 16 | 20 | 24`), com a licença ISC em `src/icons/LICENSE-lucide.txt` e citada no README. Primeira leva de 36 ícones nos grupos navegação, setas, ações, estados, conta e estudo (lista no KT-001).
- **`Switch`:** `<button role="switch" aria-checked>` com `label`, `help`, `checked` e `onCheckedChange`; Espaço, Enter e toque no rótulo alternam; área de toque de 44 px; estado visível pela posição, não só pela cor. Padrão existente no Atria (`notification-settings-card.tsx`).
- **`RadioGroup`:** `<fieldset>`/`<legend>` com `<input type="radio">` nativos; opções com `label`, `description`, `marker`, `disabled`, `tone` (`success`, `danger`, `neutral`) e `adornment`; variantes `default` e `card` (o cartão inteiro é o rótulo, com borda `primary`, fundo `primarySoft` e ícone de confere); `readOnly`, `help` e `error`.
- **`TextAreaField`:** mesmo visual e regras do `TextField`, com `autoResize` entre `minRows` e `maxRows` e um `counter` calculado pelo produto, ligado por `aria-describedby` e não anunciado a cada tecla; `line-height` 1,6.
- **`Disclosure` e `Accordion`:** `<details>`/`<summary>` nativos, controlado e não controlado (`open`, `onOpenChange`), `icon` e `tone` (`default`, `accent`, `warning`, `info`); `Accordion` `single` pelo atributo `name` do `<details>` ou `multiple`; seta e altura animadas com `--motion-*`, sem animação com movimento reduzido.
- **`Callout`:** `<aside>` com `tone` (`neutral`, `accent`, `info`, `success`, `warning`, `danger`), fundo `*Soft`, ícone e título na cor cheia do tom, `icon` próprio ou `false`, `action` e `live` (`polite` vira `role="status"`). Fica na página e não some sozinho, diferente do `Toast`.
- **`BottomSheet`:** `<dialog>` nativo com `showModal()`, `title`, `description`, `footer`, `placement` (`auto`, `bottom`, `side`; `auto` troca em 720 px) e `labels.close`; embaixo, até 85% da tela, rolagem interna e `env(safe-area-inset-bottom)`; foco preso, Escape e toque no fundo fecham, foco devolvido a quem abriu; alça só visual.
- **`Prose`:** renderiza e sanitiza Markdown em elementos React, sem HTML injetado; lista do que é permitido (títulos, parágrafos, listas, ênfase, código, citações, tabelas, links e imagens), HTML cru descartado, links externos com `rel="noopener noreferrer"`, imagens com `loading="lazy"`; `size` `base` (16 px) ou `reading` (18 px), no máximo 68 caracteres por linha, tabelas com rolagem horizontal; extensível por `components` e `remarkPlugins` (o Synestia passa a matemática e o KaTeX fica fora da Vega).
- **`AppShell`, `Sidebar`, `BottomNav` e `Topbar`:** peças separadas e um `AppShell` padrão que as compõe; `NavItem` com `id`, `label`, `icon`, `href`, `current` e `badge`; `renderLink` para o roteador do produto (sem ele, `<a>`); `Sidebar` com marca, `<nav>` "Principal" e modo gaveta (foco preso, Escape, `inert`, foco devolvido); `BottomNav` nova, fixa embaixo, 56 px mais a área segura, 3 a 5 destinos com ícone e rótulo sempre visíveis, só abaixo de 720 px; `AppShell` com `mobileNav` (`drawer` ou `bottom`), `hideNavigation` (modo foco) e link "Pular para o conteúdo". Base no `apps/web/src/app/layout/` do Atria, sem roteador, sessão, tradução, tema nem `paletteFor` dentro do componente.
- **Extensões:**
  - `Button`: `size?: 'md' | 'lg'` (`lg` com altura mínima de 48 px) e `block?: boolean` (largura toda), sem mudar o padrão atual.
  - `ProgressBar`: `valueText` (texto visível opcional e `aria-valuetext`) e `indeterminate` (sem `aria-valuenow`, animação com movimento reduzido respeitado).
  - `Card`: variante interativa (link ou botão de verdade), com hover, foco e pressionado, e o cartão inteiro como um alvo só.
  - `PageHeader`: variante `focus` com botão de sair (nome por `labels`), título curto, posição ("3/8") e um `ProgressBar` embaixo, cabendo em 360 px numa linha.

## Detalhes Técnicos

- Fonte do pedido: `docs/KT-001-vega-lote-1.md`, com as interfaces TypeScript propostas de cada componente e a tabela "Como o Synestia vai usar".
- Cada componente em `src/<componente>/`, exportado pelo `src/index.ts` com os tipos ([project/architecture-02], [project/architecture-03]), seguindo [project/code-style-08] (no máximo 200 linhas por arquivo de código e de estilo) e [project/code-style-09] (um contexto por arquivo).
- Regras que mais pesam: [project/architecture-04] e [project/code-style-07] (nada de regra do Synestia no componente; comportamento de estudo por props e slots), [project/code-style-03], [project/language-06], [project/accessibility-03], [project/accessibility-06] (`BottomSheet`), [project/security-03] (`Prose` sem `dangerouslySetInnerHTML`), [project/stack-07] (dependência de runtime nova com justificativa; só o `Prose` deve precisar), [project/theme-06] e [project/theme-07] (estados com fundo `*Soft` e mais de um sinal além da cor; animações com `--motion-*`, até 320 ms, com `prefers-reduced-motion`).
- Todo componente funciona a partir de 360 px de largura, e todo alvo de toque tem pelo menos 44 px no celular.
- Ordem de entrega proposta pelo KT-001: 1) ícones; 2) extensões de `Button` e `ProgressBar`; 3) `Switch`, `RadioGroup` e `TextAreaField`; 4) `Callout` e `Disclosure`; 5) extensões de `Card` e `PageHeader`; 6) `BottomSheet`; 7) `Prose`; 8) `AppShell`. Os itens 3, 4 e 5 podem rodar em paralelo depois do 1.
- Referências no Atria: `apps/web/src/features/reminders/components/notification-settings-card.tsx` (switch), `features/journal/emotion-picker.tsx` (rádio), `features/journal/journal-entry-form-page.tsx` (textarea) e `apps/web/src/app/layout/` (`app-layout.tsx`, `sidebar.tsx`, `topbar.tsx`, com os testes de foco em `app-layout.test.tsx`).
- Dependência proposta para o `Prose`: `react-markdown`, `remark-gfm` e `rehype-sanitize` (MIT, sem `innerHTML`).
- Questões abertas do KT-001 para o refinamento ("a Vega decide"):
  1. Ícones: copiar os caminhos do Lucide (proposta) ou usar `lucide-react` como dependência.
  2. `Prose`: pacote de Markdown e se sai numa entrada separada (`@ishtar-sink/vega/prose`); o Synestia recomenda a entrada separada, pelo orçamento de 170 KB de JavaScript da primeira tela.
  3. `PageHeader` `focus` como prop ou componente próprio (`FocusHeader`); `Card` interativo com `as` polimórfico ou dois componentes.
  4. Versão: o lote como 0.2.0 de uma vez ou em versões menores na ordem de entrega (o Synestia prefere as menores, pelo prazo).

## Roteiro de Testes

1. Para cada componente novo: teste por papel e nome acessível, axe sem violações nos dois temas e teclado com `user-event` ([project/testing-01] a [project/testing-03]).
2. Ícones: um teste percorre todos os ícones exportados e confere `aria-hidden`, a `ref` e que não há `fill` nem `stroke` fixo além de `currentColor`.
3. `Prose`: Markdown com HTML cru e link `javascript:` não executa nem renderiza nada; `components` substitui um elemento; tabela rola a 360 px.
4. `BottomSheet` e `Sidebar` em gaveta: os mesmos testes de foco do `Dialog` e do `app-layout.test.tsx` do Atria (foco preso, Escape, foco devolvido).
5. Troca de layout em 720 px (`BottomSheet` `auto` e `AppShell` `drawer`/`bottom`).
6. Animações: sem animação com `prefers-reduced-motion` (`Disclosure`, `BottomSheet`, `ProgressBar` indeterminado).
7. Contraste AA dos tons novos (`Callout`, `RadioGroup` `tone`) nos dois temas.

## Critérios de Aceite
- [ ] Todos os ícones da primeira leva são exportados pelo índice, com `aria-hidden`, `ref` repassada e só `currentColor`, e a licença ISC do Lucide vai junto.
- [ ] `Switch`: papel `switch` com nome vindo do `label`; alterna pelo teclado e pelo rótulo; desabilitado não alterna.
- [ ] `RadioGroup`: as duas variantes passam no axe; as setas mudam a seleção; o `tone` tem sinal além da cor; na variante `card`, toda a área do cartão seleciona.
- [ ] `TextAreaField`: o `autoResize` respeita o `maxRows`; o contador é lido junto do campo; o erro aparece com `role="alert"`.
- [ ] `Disclosure` e `Accordion`: funcionam controlados e não controlados; abrem por Enter e Espaço; o `single` fecha os outros; sem animação com movimento reduzido.
- [ ] `Callout`: todos os tons passam em AA nos dois temas; o ícone padrão muda com o tom; `live` liga e desliga o `role="status"`.
- [ ] `BottomSheet`: passa nos testes de foco do `Dialog`; troca de posição em 720 px; o rodapé fica fixo e o conteúdo rola.
- [ ] `Prose`: HTML e `javascript:` no Markdown não são executados nem renderizados; as tabelas rolam a 360 px; `components` substitui um elemento; nenhum `dangerouslySetInnerHTML`.
- [ ] `AppShell`: funciona com `renderLink` e com `<a>` simples; a troca entre `drawer` e `bottom` acontece em 720 px; a gaveta passa nos testes de foco do Atria; `hideNavigation` remove a navegação sem perder o `<main>`.
- [ ] `Button` `lg` com 48 px e `block` com 100%, sem mudar o padrão atual.
- [ ] `ProgressBar` com `aria-valuetext` quando informado; o modo indeterminado não anuncia valor.
- [ ] `Card` interativo: foco visível, o cartão inteiro como um alvo só, elemento `<a>` ou `<button>` de verdade.
- [ ] `PageHeader` `focus`: o sair tem nome acessível vindo de `labels`, e a variante cabe em 360 px numa linha.
- [ ] Todos os componentes funcionam a partir de 360 px e têm alvos de toque de pelo menos 44 px no celular.
