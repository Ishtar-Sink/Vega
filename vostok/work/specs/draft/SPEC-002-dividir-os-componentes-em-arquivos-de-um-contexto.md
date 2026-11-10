---
id: SPEC-002
title: "Dividir os componentes em arquivos de um contexto"
status: draft
author: "Victor Batalha"
created_at: 2026-11-10T17:19:14Z
updated_at: 2026-11-10T17:19:14Z
tags: []
---

# Dividir os componentes em arquivos de um contexto

Refatorar os componentes atuais da Vega para seguir as regras [project/code-style-08] (no máximo 200 linhas por arquivo de código e de estilo) e [project/code-style-09] (um contexto por arquivo), e passar a garantir o limite pelo ESLint.

## Contexto

Melhoria de estrutura do código, sem mudar comportamento. Hoje os componentes estão muito grandes e misturam muitos contextos num único arquivo: funções, tipos, o próprio componente e outros. As regras [project/code-style-08] e [project/code-style-09] foram criadas para corrigir isso, e os componentes que já existem precisam ser adequados a elas.

## Recursos

- Dividir cada componente por papel, na própria pasta: `<nome>.tsx` só com o componente, `<nome>.types.ts` com os tipos e as props, `use-<nome>.ts` com os hooks, `<nome>.utils.ts` com as funções puras e `<nome>.constants.ts` com os textos padrão e as constantes.
- Dividir em subcomponentes quando só o JSX passar de 200 linhas (ex.: `autocomplete-list.tsx`), cada um com os próprios tipos.
- Deixar todo arquivo `.ts`, `.tsx` e `.css` de produção com no máximo 200 linhas; os testes ficam fora do limite.
- Ligar a regra `max-lines` (200) do ESLint para os `.ts` e `.tsx` de produção, para o CI barrar arquivos acima do limite.

## Detalhes Técnicos

- Arquivos de produção acima de 200 linhas em 2026-11-10 (`wc -l`): `src/autocomplete/autocomplete.tsx` (416), `src/period-field/period-field.tsx` (321), `src/color-field/color-picker.tsx` (311), `src/select-field/select-field.tsx` (288), `src/calendar/calendar.tsx` (245), `src/date-field/date-field.tsx` (243), `src/menu-button/menu-button.tsx` (209) e `src/color-field/color-field.module.css` (209).
- O limite do ESLint entra em `eslint.config.js`, com `max-lines` em 200 só para os arquivos de produção.
- Regras: [project/code-style-08] e [project/code-style-09].

## Roteiro de Testes

_Se aplicável e/ou conhecido, insira o roteiro de testes. Não preencher fará o agente inferir com base no restante das informações. Pode ser ajustado posteriormente._

## Critérios de Aceite
- [ ] Nenhum arquivo `.ts`, `.tsx` ou `.css` de produção em `src/` passa de 200 linhas.
- [ ] Cada arquivo tem um único contexto, conforme [project/code-style-09].
- [ ] O ESLint aplica `max-lines` (200) aos `.ts` e `.tsx` de produção, e o CI barra um arquivo acima do limite.
- [ ] O comportamento dos componentes não muda.
