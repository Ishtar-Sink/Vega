### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md`
- `vostok/work/tasks/SPEC-001/TASK-09/tecnico.md`
- `../atria/packages/ui/src/dialog/dialog.tsx`
- `../atria/packages/ui/src/dialog/dialog.module.css`
- `../atria/packages/ui/src/dialog/dialog.test.tsx`
- `../atria/packages/ui/src/confirm-dialog/confirm-dialog.tsx`
- `../atria/packages/ui/src/confirm-dialog/confirm-dialog.module.css`
- `../atria/packages/ui/src/confirm-dialog/confirm-dialog.test.tsx`
- `../atria/packages/ui/src/toast/toast.tsx`
- `../atria/packages/ui/src/toast/toast.module.css`
- `../atria/packages/ui/src/toast/toast.test.tsx`
- `../atria/packages/ui/src/test/setup.ts`
- `src/button/button.tsx`
- `src/theme/tokens.css`
- `src/test/setup.ts`

### Mudar

- `src/dialog/dialog.tsx` (criar): `Dialog` com `<dialog>` nativo aberto por `showModal()`, props nativas e props camelCase (RF-14, RF-20, RN-05).
- `src/dialog/dialog.module.css` (criar): estilos do `Dialog` só com tokens (RNF-02).
- `src/dialog/dialog.test.tsx` (criar): testes do `Dialog`, com o polyfill local de `showModal`/`close` para o jsdom (CT-09, CT-13).
- `src/confirm-dialog/confirm-dialog.tsx` (criar): `ConfirmDialog` sobre `Dialog` e `Button`, com rótulos padrão em pt-br (RF-14, RF-19, RF-20).
- `src/confirm-dialog/confirm-dialog.module.css` (criar): estilos do `ConfirmDialog` só com tokens (RNF-02).
- `src/confirm-dialog/confirm-dialog.test.tsx` (criar): testes do `ConfirmDialog`, com o mesmo polyfill local (CT-09, CT-12, CT-13).
- `src/toast/toast.tsx` (criar): `Toast` e `ToastRegion` com props nativas, ícone por tom e nome do tom para leitor de tela, com padrão pt-br (RF-14, RF-19, RF-20, RN-04).
- `src/toast/toast.module.css` (criar): estilos do `Toast` só com tokens (RNF-02).
- `src/toast/toast.test.tsx` (criar): testes do `Toast` e do `ToastRegion` (CT-09, CT-12, CT-13).

### Passos

Regras comuns a todos os passos (decididas em `tecnico.md`, seção "Decisões"):

- Copie o arquivo do Atria e aplique só as mudanças listadas no passo e na tabela "O que muda para conformidade em relação ao Atria" do `tecnico.md`.
- CSS: troque cada literal em `px` pelo token de `src/theme/tokens.css` com o mesmo valor; sem token de mesmo valor, use `calc(var(--space) * N)` com N = valor ÷ 4 (`1px` vira `calc(var(--space) / 4)`, `-1px` vira `calc(var(--space) / -4)`). Valores em `em`, `vw` e `%` ficam. Comentários que citam o protótipo passam a explicar o porquê sem citar o produto.
- Pesos, entrelinhas e camadas (tokens criados pela TASK-02, mapeados pelo valor): `font-weight: 600` vira `var(--font-weight-semibold)`, `700` vira `var(--font-weight-bold)`, `800` vira `var(--font-weight-extrabold)`; `line-height: 1.1` vira `var(--line-height-tight)`, `1.6` vira `var(--line-height-relaxed)`; `z-index: 40` vira `var(--z-dropdown)`, `45` vira `var(--z-popover)`, `200` vira `var(--z-toast)`. Nenhum `font-weight`, `line-height` ou `z-index` numérico fica nos `*.module.css`.
- Props que estendem as nativas: estes não são campos; desestruture `className`, `style` e `...rest` (com o `ref`, que no React 19 é prop) e aplique-os no elemento raiz (`className` concatenado com a classe do módulo). JSDoc em pt-br em cada prop pública.
- Polyfill do jsdom (que não implementa `showModal` nem `close` no `HTMLDialogElement`): no topo de `dialog.test.tsx` e de `confirm-dialog.test.tsx`, o mesmo `beforeAll` do teste do Atria (`HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); })` e `close = vi.fn(function (this: HTMLDialogElement) { this.removeAttribute('open'); })`). Não altere `src/test/setup.ts`, que é da TASK-01.

1. `src/dialog/dialog.test.tsx` (criar): copie o teste do Atria, troque `close_on_backdrop` por `closeOnBackdrop` e `described_by="x"` por `aria-describedby="x"`, e acrescente: `it('opens with the native showModal')` (depois de abrir, `screen.getByRole('dialog').tagName` é `'DIALOG'` e `HTMLDialogElement.prototype.showModal` foi chamado); `it('closes the native dialog on unmount')` (ao fechar pelo `onClose`, `HTMLDialogElement.prototype.close` foi chamado e o diálogo some); `it('passes className, style and data attributes to the dialog')` (`className="extra"`, `style={{ marginTop: '4px' }}`, `data-testid="raiz"`: `screen.getByTestId('raiz')` é o `dialog`, com a classe `extra` e o estilo); `it('forwards the ref to the dialog element')` (um `createRef<HTMLDialogElement>()` aponta para o `dialog` aberto). Confira: `pnpm vitest run src/dialog` falha porque `./dialog` não existe.
2. `src/dialog/dialog.module.css` (criar): copie e troque os literais pela regra comum (o teste do Atria que lê `padding: var(--s6)`, `calc(var(--space) * 120)` e `calc(var(--space) * 140)` continua valendo). `src/dialog/dialog.tsx` (criar): `export interface DialogProps extends Omit<ComponentPropsWithRef<'dialog'>, 'title' | 'open' | 'onClose' | 'role' | 'children'>` com `open`, `title`, `onClose`, `children`, `actions`, `role?`, `size?` e `closeOnBackdrop?` (padrão `false`); `described_by` sai e o chamador usa o `aria-describedby` nativo: desestruture `'aria-describedby': describedBy` e aplique `describedBy ?? (role === 'alertdialog' ? <id do corpo> : undefined)`. O `ref` interno `dialogRef` continua no `dialog` e o `ref` recebido é ligado a ele com `useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement, [])` (sem utilitário de mesclar refs). O resto do comportamento (abrir com `showModal()` no efeito, foco inicial, Tab preso, Esc e `cancel` entregues ao `onClose`, foco de volta ao gatilho) fica igual. Confira: `pnpm vitest run src/dialog`.
3. `src/confirm-dialog/confirm-dialog.test.tsx` (criar): copie o teste do Atria, acrescente o `beforeAll` do polyfill e tire `confirmLabel` e `cancelLabel` do `Harness` (passam a ter padrão). Acrescente: `it('uses Confirmar and Cancelar by default')`; `it('accepts overridden labels')` (`confirmLabel="Excluir"` e `cancelLabel="Voltar"`: botões com esses nomes); `it('confirms with the keyboard')` (abre, `user.tab()` vai a `Confirmar`, `{Enter}` chama `onConfirm` uma vez); `it('passes className, style and data attributes to the dialog')`. Confira: `pnpm vitest run src/confirm-dialog` falha porque `./confirm-dialog` não existe.
4. `src/confirm-dialog/confirm-dialog.module.css` (criar): copie (não tem literal em `px`). `src/confirm-dialog/confirm-dialog.tsx` (criar): `export interface ConfirmDialogProps extends Omit<DialogProps, 'children' | 'actions' | 'role' | 'onClose'>` com `description: string`, `confirmLabel?` (padrão `'Confirmar'`), `cancelLabel?` (padrão `'Cancelar'`), `onConfirm` e `onCancel`; o `...rest` (com `className`, `style` e `ref`) vai ao `Dialog`. Imports por `../button/button` e `../dialog/dialog`. Confira: `pnpm vitest run src/confirm-dialog`.
5. `src/toast/toast.test.tsx` (criar): copie o teste do Atria e acrescente: `it('marks the tone with an icon and a hidden name, not only the color')` (para cada tom, o `Toast` tem um `svg` com `aria-hidden="true"` e o texto acessível começa pelo nome padrão do tom: `info` `Informação`, `success` `Sucesso`, `warning` `Atenção`, `danger` `Erro`; ex.: `toHaveTextContent('Sucesso: Salvo')`); `it('accepts another tone name')` (`toneLabel="Done"` dá `Done: Salvo`); `it('passes className, style and data attributes to the root')` para `Toast` e para `ToastRegion` (o `ToastRegion` mantém `aria-live="polite"` mesmo com outro valor passado). Confira: `pnpm vitest run src/toast` falha porque `./toast` não existe.
6. `src/toast/toast.module.css` (criar): copie, acrescente em `.root` `display: flex`, `align-items: flex-start` e `gap: var(--s2)`, uma classe `.icon` com `flex: none` e uma classe `.srOnly` com o padrão visualmente oculto (`position: absolute`, `width` e `height` `calc(var(--space) / 4)`, `margin: calc(var(--space) / -4)`, `padding: 0`, `overflow: hidden`, `clip-path: inset(50%)`, `white-space: nowrap`, `border: 0`). `src/toast/toast.tsx` (criar): `ToastRegion` com `ComponentPropsWithRef<'div'>` e `aria-live="polite"` depois do `...rest`; `export interface ToastProps extends ComponentPropsWithRef<'div'>` com `tone?: ToastTone` (padrão `'info'`) e `toneLabel?: string` (padrão por tom em `DEFAULT_TONE_LABELS = { info: 'Informação', success: 'Sucesso', warning: 'Atenção', danger: 'Erro' }`); o `Toast` renderiza o ícone do tom (SVG 16×16, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `fill="none"`, `aria-hidden="true"`, `focusable="false"`: `info` círculo `r=9` com `M12 11v5M12 8h.01`; `success` círculo com `M8 12l3 3 5-6`; `warning` `M12 3l9 16H3z` com `M12 10v4M12 17h.01`; `danger` círculo com `M9 9l6 6M15 9l-6 6`), depois `<span className={styles.srOnly}>{`${toneLabel}: `}</span>` e depois `<span>{children}</span>`. Confira: `pnpm vitest run src/toast`.
7. Pastas da tarefa (sem arquivo novo): rode `pnpm exec prettier --write src/dialog src/confirm-dialog src/toast` e depois a Verificação inteira. Confira: todos os comandos da Verificação terminam com código 0.
