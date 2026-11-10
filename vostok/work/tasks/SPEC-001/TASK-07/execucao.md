### Ler

- `vostok/work/specs/refined/SPEC-001-extrair-os-componentes-do-atria-para-a-vega.md`: RF-12, RF-19, RF-20, RNF-01, RNF-02, RNF-06, RN-01, RN-02, CB-03, CT-09, CT-12 e CT-13.
- `vostok/work/tasks/SPEC-001/TASK-07/tecnico.md`: decisões desta tarefa (`valueCents`, locale e moeda, estilo próprio).
- `vostok/work/tasks/SPEC-001/TASK-04/tecnico.md`: decisão "Props nativas no controle", que o `MoneyField` herda do `TextField`.
- `vostok/rules/project/code-style.md`, `vostok/rules/project/language.md`, `vostok/rules/project/testing.md`, `vostok/rules/project/accessibility.md` e `vostok/rules/project/naming-convention.md`.
- `../atria/packages/ui/src/money-field/money-field.tsx`, `money-mask.ts`, `money-field.test.tsx` e `money-mask.test.ts`: origem (somente leitura).
- `src/text-field/text-field.tsx` (criado pela TASK-04): `TextField` e `TextFieldProps`, que o `MoneyField` estende e renderiza.
- `src/theme/tokens.css` (criado pela TASK-02) e `src/test/setup.ts` (criado pela TASK-01).

### Mudar

- `src/money-field/money-mask.test.ts` (criar): testes da máscara trazidos do Atria e completados com outros locales (RF-12, RF-19, CB-03, CT-12).
- `src/money-field/money-mask.ts` (criar): `maskMoneyInput`, `parseMoneyInput` e `formatCents` em centavos, com `Intl` no locale recebido (RF-12, RF-19).
- `src/money-field/money-field.test.tsx` (criar): testes do `MoneyField` trazidos do Atria e completados (RF-12, RF-19, RF-20, CB-03, CT-09, CT-12, CT-13).
- `src/money-field/money-field.module.css` (criar): estilo próprio do campo, só com propriedades sem literal (RNF-02, [project/architecture-02]).
- `src/money-field/money-field.tsx` (criar): `MoneyField` com as props do `TextField`, `valueCents` e `locale`/`currency` (RF-12, RF-19, RF-20).

### Passos

1. `src/money-field/money-mask.test.ts` (criar): copie `../atria/packages/ui/src/money-field/money-mask.test.ts` e acrescente, calculando prefixos e sufixos com `Intl` no próprio teste (como o `prefix` do BRL), para não depender da versão do ICU:
   - `const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }); const usdPrefix = usd.format(0).replace(/0\.00$/, '');` e `const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }); const eurSuffix = eur.format(0).replace(/^0,00/, '');`;
   - `it('cb03 masks and parses in en-US with USD')`: `maskMoneyInput('14500.5', 'en-US', 'USD')` é `` `${usdPrefix}14,500.5` ``; `parseMoneyInput(\`${usdPrefix}14,500.50\`, 'en-US', 'USD')` é `1450050`; `formatCents(1450050, 'en-US', 'USD')` é `usd.format(14500.5)`;
   - `it('cb03 masks and parses a currency with suffix in de-DE')`: `maskMoneyInput('14500,5', 'de-DE', 'EUR')` é `` `14.500,5${eurSuffix}` ``; `parseMoneyInput(\`14.500,50${eurSuffix}\`, 'de-DE', 'EUR')` é `1450050`; `formatCents(1450050, 'de-DE', 'EUR')` é `eur.format(14500.5)`;
   - `it('refuses a value beyond the safe integer of cents')`: `parseMoneyInput('9'.repeat(20), 'pt-BR', 'BRL')` é `null`.
   Rode `pnpm vitest run src/money-field/money-mask.test.ts` e confira que falha.
2. `src/money-field/money-mask.ts` (criar): copie `../atria/packages/ui/src/money-field/money-mask.ts` e troque o comentário do topo por `// Dinheiro é sempre inteiro em centavos; esta máscara é só de exibição: o texto formatado nunca é o valor, só os centavos que `parseMoneyInput` extrai dele. Os separadores, o símbolo e a posição dele vêm do `Intl` no locale recebido.` (sai a referência `RN-09` do Atria). Mantenha os nomes `maskMoneyInput`, `parseMoneyInput` e `formatCents`, os parâmetros `locale` e `currency` obrigatórios e o `cache`. Acrescente JSDoc nas três funções (`/** Formata o texto digitado, sem completar os decimais. */`, `/** Centavos inteiros do texto, ou `null` se vazio ou fora do inteiro seguro. */`, `/** Valor em centavos formatado com duas casas no locale e na moeda. */`). Rode `pnpm vitest run src/money-field/money-mask.test.ts` até passar.
3. `src/money-field/money-field.test.tsx` (criar): copie `../atria/packages/ui/src/money-field/money-field.test.tsx`, troque `value_cents={value}` por `valueCents={value}` no `Harness` e aceite no `Harness` as props opcionais `locale?: string` e `currency?: string`, repassadas ao `MoneyField`. Acrescente:
   - `it('cb03 formats and stores cents in en-US with USD')`: `Harness` com `locale="en-US"` e `currency="USD"`; `user.type(input, '14500.5')` dá o valor `` `${usdPrefix}14,500.5` `` e a última chamada `1450050`; `user.tab()` dá `usd.format(14500.5)` (declare `usd` e `usdPrefix` como no passo 1);
   - `it('ct12 keeps the label and error texts it receives in another locale')`: `Harness` com `locale="en-US"`, `currency="USD"`, rótulo `Amount` (acrescente `label?: string` ao `Harness`, padrão `Valor`) e `error="Enter the amount."`: o campo é `getByLabelText('Amount')` e o alerta tem `Enter the amount.`;
   - `it('reaches the field with Tab and types with the keyboard')`: `user.tab()` foca o campo `Valor`, `user.keyboard('25')` dá `` `${prefix}25` `` e a última chamada `2500`;
   - `it('updates the text when the value changes from outside')`: `rerender` com outro `valueCents` (`1000` → `250000`) mostra `brl.format(2500)` (crie um `Harness` controlado por prop para isso);
   - `it('ct13 forwards className, style, data attributes and ref to the input')`: `createRef<HTMLInputElement>()`; `<MoneyField label="Valor" valueCents={null} onChange={vi.fn()} className="extra" style={{ marginTop: 'var(--s2)' }} data-kind="money" ref={ref} />`; o `<input>` tem a classe `extra` e a classe que casa com `/root/` (do `money-field.module.css`), `marginTop` `var(--s2)`, `data-kind="money"` e é o `ref.current`; tem também `inputMode="decimal"` e `autoComplete="off"`.
   Rode `pnpm vitest run src/money-field/money-field.test.tsx` e confira que falha.
4. `src/money-field/money-field.module.css` (criar), com o comentário `/* Algarismos de largura fixa: os valores ficam alinhados enquanto se digita e numa coluna de formulário. */` e o bloco `.root { font-variant-numeric: tabular-nums; }` (nenhum literal de cor, tamanho ou duração).
5. `src/money-field/money-field.tsx` (criar): copie `../atria/packages/ui/src/money-field/money-field.tsx` e mude:
   - `export interface MoneyFieldProps extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode'>` (de `../text-field/text-field`), com `/** Valor em centavos inteiros; `null` quando vazio. */ valueCents: number | null;`, `/** Recebe os centavos inteiros a cada digitação, ou `null` quando vazio. */ onChange: (cents: number | null) => void;`, `/** Locale dos separadores e do símbolo, no formato BCP 47. Padrão: `pt-BR`. */ locale?: string;` e `/** Moeda ISO 4217. Padrão: `BRL`. */ currency?: string;` (`label`, `help`, `error`, `id`, `name`, `disabled`, `onBlur`, `className`, `style` e `ref` vêm do `TextFieldProps`);
   - troque `value_cents` por `valueCents` em todo o arquivo, inclusive no estado `seen`;
   - a função desestrutura `valueCents`, `onChange`, `locale = 'pt-BR'`, `currency = 'BRL'`, `onBlur`, `className` e `...rest`, e renderiza `<TextField {...rest} className={[styles.root, className].filter(Boolean).join(' ')} inputMode="decimal" autoComplete="off" value={text} onChange={...} onBlur={(event) => { ...; onBlur?.(event); }} />`, importando `styles` de `./money-field.module.css`;
   - mantenha o JSDoc da função e o ajuste do texto durante a renderização quando o valor, o locale ou a moeda mudam de fora.
   Rode `pnpm vitest run src/money-field` até passar.
6. Rode `pnpm exec prettier --write src/money-field` e a Verificação inteira; corrija até todos os comandos terminarem em 0.
