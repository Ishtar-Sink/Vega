# TASK-08: Disclosure e Accordion

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

- **Título:** Disclosure e Accordion
- **Tipo:** historia
- **Descrição:** Cria o `Disclosure` sobre `<details>` e o `Accordion` `single` e `multiple`.
- **Critérios de aceite:**
  - [ ] O `Disclosure` usa `<details>` e `<summary>` nativos, com título, ícone e tom (RF-13).
  - [ ] Abre e fecha por clique, Enter e Espaço, controlado e não controlado (RF-14, CT-13, CT-14, CB-05).
  - [ ] O `Accordion` `single` fecha os outros ao abrir um, e o `multiple` deixa abrir vários (RF-15, CT-15).
  - [ ] A seta e a abertura animam só com os tokens de movimento e param com movimento reduzido (RNF-04).
  - [ ] Passa no axe, os tons passam em AA nos dois temas e o resumo tem pelo menos 44 px (RNF-02, RNF-03, RNF-05).
  - [ ] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal e cada arquivo de produção tem até 200 linhas (RNF-08).
  - [ ] O `Disclosure` e o `Accordion` aparecem corretos nos temas claro e escuro e a 360 px (RNF-01).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-02
