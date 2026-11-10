# TASK-06: RadioGroup

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** done
- **Onda:** 3
- **Dependências:** TASK-02

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** RadioGroup
- **Tipo:** historia
- **Descrição:** Cria o `RadioGroup` nas variantes `default` e `card`, com tons, `readOnly`, ajuda e erro.
- **Critérios de aceite:**
  - [x] O `RadioGroup` usa `<fieldset>`, `<legend>` e rádios nativos, e as setas mudam a seleção (RF-05, CT-05, CB-02).
  - [x] Cada opção aceita descrição, marcador, desabilitado, tom e conteúdo no fim, e o tom tem sinal além da cor (RF-06, RN-03).
  - [x] Na variante `card`, todo o cartão seleciona e a seleção aparece com borda, fundo e ícone de confere (RF-07, CT-07).
  - [x] Com `readOnly`, as opções continuam anunciadas e a seleção não muda (RF-08, CT-08, CB-03).
  - [x] A ajuda e o erro ficam ligados ao grupo, e o erro aparece com `role="alert"` (RF-09, CT-09).
  - [x] As duas variantes passam no axe, os tons passam em AA nos dois temas e o alvo de toque tem pelo menos 44 px (RNF-02, RNF-03, RNF-05).
  - [x] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-04, RNF-08).
  - [x] O `RadioGroup` aparece correto nos temas claro e escuro e a 360 px (RNF-01).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02
