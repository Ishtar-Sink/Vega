# TASK-05: Campo de cor

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-001
- **Status:** approved
- **Onda:** 4
- **Dependências:** TASK-03

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Campo de cor
- **Tipo:** historia
- **Descrição:** Migra `ColorField`, `ColorPicker` e as funções de cor.
- **Critérios de aceite:**
  - [ ] `ColorField`, `ColorPicker` e as funções `hexToRgb`, `rgbToHex`, `hslToRgb` e `rgbToHsl` existem em `src/color-field/`, e os testes passam (RF-10).
  - [ ] O `ColorField` e o `ColorPicker` estendem as props nativas e repassam `className`, `style`, `data-*` e `ref` (RF-20, CT-13).
  - [ ] Todos os textos do campo e do seletor são props com padrão em pt-br, inclusive o valor da roda lido pelo leitor de tela (RF-19, CT-12).
  - [ ] O campo de cor passa no axe, abre e aplica pelo teclado e mostra o erro com `role="alert"` ligado ao gatilho (CT-09).
  - [ ] O estilo usa só tokens do tema, o `Button` da TASK-03 continua passando e nenhuma dependência de runtime foi acrescentada (RF-20, RNF-02, RNF-06).
- **Rótulos:** SPEC-001, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-03
