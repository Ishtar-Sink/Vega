<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Extensão com TDD do `Button` existente: os testes de `size` e `block` entram em `src/button/button.test.tsx` antes do código, com a altura e a largura conferidas no `.module.css` (o jsdom não calcula layout). O padrão não muda: sem as props, nenhuma classe nova é aplicada, e os testes atuais seguem como regressão.

## Decisões

| # | Decisão | Alternativa descartada | Motivo |
|---|---|---|---|
| D-01 | `size?: 'md' \| 'lg'`, com `md` sem classe e `lg` com `.lg` (`min-height: calc(var(--space) * 12)`, 48 px). | Classe `.md` explícita. | O padrão atual fica intocado, e o teste `keeps the md size by default` garante. |
| D-02 | `block` com `display: flex; width: 100%; box-sizing: border-box`. | `width: 100%` sem `box-sizing`. | O botão tem `padding` e borda; sem `box-sizing`, passaria da borda (mesma regressão dos campos na SPEC-001). |
| D-03 | Medidas com `calc(var(--space) * N)`, sem tokens novos. | Criar token de altura. | Decisão da spec (inferência D da SPEC-003). |
| D-04 | Só `button.tsx`, `.module.css` e o teste mudam; os tipos ficam no arquivo, que segue abaixo de 200 linhas. | Extrair `button.types.ts` agora. | A divisão completa dos componentes existentes é da SPEC-002 (inferência B da SPEC-003). |

## Riscos

- Alguém já passava `size` como atributo HTML ao `Button`: `size` não é atributo de `<button>`, então não há colisão com as props nativas.
- O `block` em `inline-flex` não ocuparia a largura: por isso `.block` troca para `display: flex`.

## Referências da spec

RF-36, CT-33; RNF-08; regras [project/code-style-02], [project/code-style-03], [project/code-style-08].

## Arquivos em comum com a onda

Nenhum. Na onda 1, as TASK-01, TASK-04, TASK-05, TASK-07 e TASK-10 não mudam `src/button/`.

## O que foi feito

- `src/button/button.test.tsx`: 5 testes novos no `describe` existente: o padrão não recebe classes de `lg` nem de `block`; `size="lg"` aplica a classe `lg`; `block` aplica a classe `block`; a classe `.lg` do CSS define `min-height: calc(var(--space) * 12)`, ou seja, 48 px; a classe `.block` define `width: 100%` e `box-sizing: border-box`. Os dois últimos leem `button.module.css`, porque o jsdom não calcula layout. Com os testes antigos, são 22 testes passando.
- `src/button/button.tsx`: `ButtonProps` ganhou `size?: 'md' | 'lg'` (padrão `md`) e `block?: boolean` (padrão `false`), com JSDoc em pt-br. As classes `lg` e `block` são acrescentadas só quando as props pedem; no padrão, nenhuma classe nova é aplicada. O arquivo segue abaixo de 200 linhas.
- `src/button/button.module.css`: `.lg` com `min-height: calc(var(--space) * 12)`, padding próprio e `font-size: var(--font-size-base)`; `.block` com `box-sizing: border-box`, `display: flex` e `width: 100%`. Não há literal em `px`.

Verificação:

- Baseline coletado antes da mudança: 3 comandos, todos com código de saída 0.
- `pnpm vitest run src/button` passa inteiro; Prettier sobre `src/button` e a Verificação inteira terminaram com código 0.
- Evidências `testes-button.txt` e `button-tamanhos.png` foram conferidas pelo usuário. A Verificação passou sem falhas; a regressão teve 2 comandos iguais ao baseline e 1 com acréscimo (os testes novos).

## Pontos de atenção

- O TDD não foi seguido à risca: o subagente escreveu os testes junto com o código e não os viu falhar antes da implementação. O passo que pedia a falha inicial não tem registro de saída.
- O jsdom não renderiza layout: a altura de 48 px e a largura de 100% são conferidas pelo texto do CSS. O comportamento visual real depende do print `button-tamanhos.png`.
- `size="lg"` também muda a fonte (`--font-size-base`, em vez de `--font-size-md`). Quem usar o tamanho grande recebe as duas mudanças juntas.
- `.block` troca `inline-flex` por `flex`: sem essa troca, o botão não ocuparia a largura do contêiner.
- `size` não é atributo HTML de `<button>`, então não colide com as props nativas.
- Os tipos ficam no próprio `button.tsx`; a divisão em arquivo de tipos é da SPEC-002.
