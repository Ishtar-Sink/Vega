# TASK-01: Estrutura do pacote

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 1
- **Dependências:** -

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Estrutura do pacote
- **Tipo:** tarefa
- **Descrição:** Cria o manifesto, o workspace, TypeScript, ESLint, Prettier, Vitest e o build Vite do pacote.
- **Critérios de aceite:**
  - [x] O build da biblioteca está configurado para gerar ESM, os tipos `.d.ts` e o CSS dos módulos (RF-01).
  - [x] O tema é publicado como `dist/tokens.css`, com as URLs das fontes válidas a partir de `dist/` (RF-01).
  - [x] O Vitest roda com jsdom, jest-dom e `vitest-axe` pelo setup do pacote (RF-01).
  - [x] Lint, Prettier e TypeScript estrito passam sem avisos (RF-01).
  - [x] O pacote não tem dependências de runtime e `react`/`react-dom` são peer dependencies (RF-01).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** -
