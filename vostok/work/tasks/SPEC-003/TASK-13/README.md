# TASK-13: Prose

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
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

- **Título:** Prose
- **Tipo:** historia
- **Descrição:** Cria o `Prose`, que renderiza e sanitiza Markdown, exportado em `@ishtar-sink/vega/prose`.
- **Critérios de aceite:**
  - [x] O `Prose` renderiza o `markdown` recebido em elementos React e, sem ele, estiliza os `children` (RF-22, CT-20).
  - [x] HTML cru, `<script>`, atributos `on*` e URLs `javascript:` do Markdown não são executados nem renderizados (RF-23, CT-21, CB-08).
  - [x] Links externos saem com `rel="noopener noreferrer"` e imagens com `loading="lazy"` (RF-24, CT-20).
  - [x] `components` substitui um elemento e `remarkPlugins` aplica sintaxe extra (RF-25, CT-22).
  - [x] O `Prose` tem os tamanhos `base` e `reading`, a medida de 68 caracteres e a tabela com rolagem horizontal a 360 px (RF-26, CT-23, CB-09).
  - [x] O `Prose` sai só pela entrada `@ishtar-sink/vega/prose`, e o índice principal não carrega o parser (RF-27, CT-24, RNF-06).
  - [x] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal fora das condições de `@media` e os arquivos de produção têm até 200 linhas (RNF-08).
  - [x] O texto aparece correto nos temas claro e escuro e a 360 px (RNF-01).
- **Rótulos:** SPEC-003, julgamento
- **Estimativa:** julgamento
- **Bloqueada por:** TASK-01
