# TASK-14: AppShell e navegação

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

- **Título:** AppShell e navegação
- **Tipo:** historia
- **Descrição:** Cria `Topbar`, `Sidebar`, `BottomNav` e `AppShell`, com gaveta, barra inferior e `renderLink`.
- **Critérios de aceite:**
  - [ ] A `Sidebar` mostra a marca, a navegação `Principal` com o item atual marcado e o rodapé, e no modo gaveta prende o foco, fecha por Escape e fica `inert` quando fechada (RF-28, RF-29, CT-25, CT-26).
  - [ ] A `BottomNav` mostra de 3 a 5 destinos, sempre com ícone e rótulo, com o selo e o item atual, fica fixa embaixo com a área segura e só aparece abaixo de 720 px (RF-30, CT-27, CB-10, RNF-02).
  - [ ] A `Topbar` é um `<header>` com os slots `start`, `center` e `end` (RF-31, CT-28).
  - [ ] O `AppShell` tem o link "Pular para o conteúdo" como primeiro foco, troca a navegação em 720 px conforme `mobileNav` (gaveta com foco devolvido ao botão, ou barra inferior com o espaço reservado) e esconde a navegação com `hideNavigation`, mantendo o `<main>` (RF-32, RF-33, RF-34, CT-29, CT-30, CT-31).
  - [ ] Os links usam o `renderLink` do produto e, sem ele, um `<a href>` simples (RF-35, CT-32, CB-11).
  - [ ] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal fora das condições de `@media`, os arquivos de produção têm até 200 linhas e nada do Atria (roteador, tradução, sessão, paleta) fica no componente (RNF-08).
  - [ ] O `AppShell` aparece correto no computador e a 360 px, nos temas claro e escuro (RNF-01).
- **Rótulos:** SPEC-003, julgamento
- **Estimativa:** julgamento
- **Bloqueada por:** TASK-02
