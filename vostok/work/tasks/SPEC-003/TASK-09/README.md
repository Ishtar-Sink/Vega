# TASK-09: Callout

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** approved
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

- **Título:** Callout
- **Tipo:** historia
- **Descrição:** Cria o `Callout` com os seis tons, ícone por tom, ação e região viva opcional.
- **Critérios de aceite:**
  - [ ] O `Callout` é um `<aside>` com os seis tons, fundo `*Soft`, ícone e título na cor do tom (RF-16, CT-16).
  - [ ] O ícone padrão muda com o tom, pode ser trocado ou removido, e a ação fica no fim (RF-17, CB-06).
  - [ ] `live="polite"` liga o `role="status"`, e o padrão fica sem região viva (RF-18, CT-17).
  - [ ] Passa no axe em todos os tons, e todos os tons passam em AA nos dois temas (RNF-03, RNF-05).
  - [ ] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-08).
  - [ ] O `Callout` aparece correto nos temas claro e escuro e a 360 px (RNF-01).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02
