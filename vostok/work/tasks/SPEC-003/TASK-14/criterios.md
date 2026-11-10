### Concluída quando

- [x] A `Sidebar` mostra a marca, a navegação `Principal` com o item atual marcado e o rodapé, e no modo gaveta prende o foco, fecha por Escape e fica `inert` quando fechada (RF-28, RF-29, CT-25, CT-26).

  > Como comprovar: em `testes-navegacao.txt`, ver aprovados `shows the brand, the Principal navigation and the footer`, `traps the focus in the open drawer and closes with Escape` e `is inert while the drawer is closed`.

- [x] A `BottomNav` mostra de 3 a 5 destinos, sempre com ícone e rótulo, com o selo e o item atual, fica fixa embaixo com a área segura e só aparece abaixo de 720 px (RF-30, CT-27, CB-10, RNF-02).

  > Como comprovar: em `testes-navegacao.txt`, ver aprovados `shows icon and label for every destination`, `warns when there are fewer than 3 or more than 5 items` e `is fixed at the bottom with the safe area and hides from 721 px`.

- [x] A `Topbar` é um `<header>` com os slots `start`, `center` e `end` (RF-31, CT-28).

  > Como comprovar: em `testes-navegacao.txt`, ver aprovado `renders the start, center and end slots in the header`.

- [x] O `AppShell` tem o link "Pular para o conteúdo" como primeiro foco, troca a navegação em 720 px conforme `mobileNav` (gaveta com foco devolvido ao botão, ou barra inferior com o espaço reservado) e esconde a navegação com `hideNavigation`, mantendo o `<main>` (RF-32, RF-33, RF-34, CT-29, CT-30, CT-31).

  > Como comprovar: em `testes-navegacao.txt`, ver aprovados `focuses the skip link first and leads to the main`, `opens the drawer with the menu button and returns the focus on Escape`, `uses the bottom navigation on narrow screens`, `reserves the space of the bottom navigation` e `hides the navigation and keeps the main`.

- [x] Os links usam o `renderLink` do produto e, sem ele, um `<a href>` simples (RF-35, CT-32, CB-11).

  > Como comprovar: em `testes-navegacao.txt`, ver aprovados `renders links with renderLink and falls back to anchors` e `renders anchors without renderLink`.

- [x] O código passa no lint, no Prettier e na checagem de tipos, os estilos não têm literal fora das condições de `@media`, os arquivos de produção têm até 200 linhas e nada do Atria (roteador, tradução, sessão, paleta) fica no componente (RNF-08).

  > Como comprovar: a Verificação inteira termina com código 0, e `navegacao-estrutura.txt` termina na linha "OK".

- [x] O `AppShell` aparece correto no computador e a 360 px, nos temas claro e escuro (RNF-01).

  > Como comprovar: abrir `navegacao-telas.png` e conferir a barra lateral no painel largo, a barra inferior no painel escuro de 360 px e a gaveta aberta no painel claro de 360 px.
