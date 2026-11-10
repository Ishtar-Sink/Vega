### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-36, CT-33, "Contratos e interfaces": `ButtonProps`)
- `vostok/work/tasks/SPEC-003/TASK-03/tecnico.md`
- `src/button/button.tsx`
- `src/button/button.module.css`
- `src/button/button.test.tsx` (testes `renders the variant class`, `ct13 forwards className, style, data attributes and ref to the button`)
- `src/text-field/text-field.test.tsx` (teste `keeps the full-width control inside its container with box-sizing border-box`, modelo da regressão que lê o CSS)

### Mudar

- `src/button/button.test.tsx` (alterar): testes de `size` e `block`, e a regressão de `box-sizing` do `block` (RF-36, CT-33).
- `src/button/button.tsx` (alterar): props `size` (`md` padrão, `lg`) e `block`, com JSDoc em pt-br (RF-36).
- `src/button/button.module.css` (alterar): classes `.lg` (altura mínima de 48 px) e `.block` (largura total com `box-sizing: border-box`) (RF-36).

### Passos

1. `src/button/button.test.tsx` (alterar): acrescente, no `describe` existente, os testes:
   - `it('keeps the md size by default without lg or block classes')`: `<Button>Salvar</Button>`; o botão não tem as classes que contêm `lg` nem `block` (`expect(button.className).not.toMatch(/\blg\b|block/)`).
   - `it('applies the lg size')`: `<Button size="lg">Salvar</Button>`; `className` casa com `/lg/`.
   - `it('fills the width with block')`: `<Button block>Salvar</Button>`; `className` casa com `/block/`.
   - `it('uses a 48px minimum height in the lg size')`: lê `button.module.css` com `readFileSync(join(import.meta.dirname, 'button.module.css'), 'utf8')`, extrai o bloco `/\.lg\s*\{([^}]*)\}/` e espera `min-height:\s*calc\(var\(--space\) \* 12\)`.
   - `it('keeps the block button inside its container with box-sizing border-box')`: extrai `/\.block\s*\{([^}]*)\}/` e espera `width:\s*100%` e `box-sizing:\s*border-box`.
   Confira: `pnpm vitest run src/button` falha nos testes novos e passa nos antigos.
2. `src/button/button.tsx` (alterar): em `ButtonProps`, acrescente `/** \`lg\`: altura mínima de 48 px. Padrão: \`md\`. */ size?: 'md' | 'lg';` e `/** Ocupa a largura toda do contêiner. */ block?: boolean;`. Desestruture `size = 'md'` e `block = false` e acrescente ao array de classes `size === 'lg' ? styles.lg : ''` e `block ? styles.block : ''`, antes de `className`. O padrão (`md`, sem `block`) não acrescenta classe. Confira: o arquivo continua com menos de 200 linhas.
3. `src/button/button.module.css` (alterar): depois de `.root`, acrescente `.lg { min-height: calc(var(--space) * 12); padding: calc(var(--space) * 3) calc(var(--space) * 5); font-size: var(--font-size-base); }` e `.block { box-sizing: border-box; display: flex; width: 100%; }`. Nenhum literal em `px`. Confira: `pnpm vitest run src/button` passa inteiro.
4. Rode `pnpm exec prettier --write src/button` e depois a Verificação inteira. Confira: todos os comandos terminam com código 0.
