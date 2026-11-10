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
