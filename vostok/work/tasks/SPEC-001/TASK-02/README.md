# TASK-02: Tema Ishtar Sink

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** done
- **Onda:** 2
- **Dependências:** TASK-01

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Tema Ishtar Sink
- **Tipo:** historia
- **Descrição:** Migra tokens, `tokens.css`, contraste, fontes e cria a API de tema com tipo completo e a camada de marca sobrescrevível.
- **Critérios de aceite:**
  - [x] Os tokens `light` e `dark` e as escalas da Vega têm os mesmos valores do Atria, e o tema padrão `ishtarSinkTheme` usa o claro como padrão (RF-03, CT-03).
  - [x] Um tema sem algum token, no claro ou no escuro, ou sem um dos dois temas, não compila (RF-04, CT-04, CB-01).
  - [x] O `tokens.css` espelha todos os valores de `tokens.ts` nos dois temas e nas escalas, com o comentário no topo apontando `tokens.ts` como origem (RF-05, CT-05).
  - [x] A camada de marca (`--primary`, `--primary-hover`, `--primary-bright`, `--primary-soft`, `--primary-on` e `--brand-gradient`) é sobrescrita por variável CSS num contêiner, nos dois temas, sem rebuild (RF-06).
  - [x] `checkThemeContrast` está exportada, não aponta violação no tema Ishtar Sink e aponta a violação de um tema próprio com marca de contraste baixo, com 4,5:1 para texto e 3:1 para `textFaint` (RF-07, CT-07, CB-02).
  - [x] As fontes Inter e Outfit variáveis e as licenças `fonts/OFL-Inter.txt` e `fonts/OFL-Outfit.txt` estão no pacote, iguais às do Atria, e o `fonts.css` aponta só para esses arquivos locais (RF-08, CT-08).
  - [x] Os tokens novos `fontWeights`, `lineHeights` e `zIndices` existem em `tokens.ts` com os valores do Atria e estão espelhados em `--font-weight-*`, `--line-height-*` e `--z-*` no `tokens.css` (RF-05, CT-05).
  - [x] As durações de movimento não passam de 320 ms e vão a 0 ms com `prefers-reduced-motion: reduce` (CB-04).
  - [x] O código do tema passa no typecheck, no ESLint e no Prettier, sem alterar `package.json` nem os arquivos da TASK-01 (RF-03, RF-04).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-01
