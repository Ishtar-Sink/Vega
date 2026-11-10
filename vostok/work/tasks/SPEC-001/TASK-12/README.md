# TASK-12: Índice público e build

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 5
- **Dependências:** TASK-05, TASK-06, TASK-07, TASK-08, TASK-09, TASK-10, TASK-11

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Índice público e build
- **Tipo:** tarefa
- **Descrição:** Registra todas as exportações no `src/index.ts` e confere o build da biblioteca.
- **Critérios de aceite:**
  - [x] O índice exporta todos os componentes, funções auxiliares, o tema e os tipos das props, e nada além disso (RF-02, CT-02).
  - [x] `paletteFor` e `artPalettes` do Atria não fazem parte do pacote (RF-02).
  - [x] `pnpm build` gera o ESM, os tipos `.d.ts` e o CSS dos módulos em `dist/`, importáveis pelos caminhos do `exports` (RF-01, CT-01).
  - [x] O pacote gerado leva as fontes e as licenças OFL (RF-01).
  - [x] O código gerado não faz requisição de rede nem tem URL externa (RF-01).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-05, TASK-06, TASK-07, TASK-08, TASK-09, TASK-10, TASK-11
