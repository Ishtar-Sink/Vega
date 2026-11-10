<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Cria a estrutura de navegação que todo app do ecossistema usa: barra lateral no computador e, no celular, gaveta ou barra inferior, à escolha de cada produto.
O Synestia usa a barra inferior com os destinos de estudo e esconde a navegação no modo foco; o Atria usa a gaveta.
Funciona pelo teclado e com leitor de tela, incluindo o atalho para pular direto ao conteúdo, e não depende do roteador, da sessão nem da tradução de nenhum produto.
Perfil `julgamento`; risco médio, por separar a navegação do código do Atria. Depende dos ícones (TASK-02) e é um dos componentes que a publicação da 0.2.0 espera.

## O que foi feito

A Vega ganhou a estrutura de navegação dos apps. No computador, aparece uma barra lateral fixa. No celular, cada produto escolhe uma de duas formas: uma gaveta que abre pelo botão de menu, ou uma barra fixa embaixo, com 3 a 5 destinos, cada um com ícone, nome e, se preciso, um selo com número (como "Revisar 3"). Há também um link "Pular para o conteúdo", que aparece com o teclado e leva direto ao conteúdo. Quando o produto esconde a navegação, como no modo foco, a barra superior continua se ele quiser. Os links usam o roteador de cada produto, então a Vega não depende de nenhum app específico. A entrega foi verificada com 30 testes automáticos, e o usuário conferiu o print das telas, no computador e a 360 px.

## Pontos de atenção

- Na gaveta aberta, o fundo atrás dela fica mais claro no tema claro, e não mais escuro. O usuário aceitou isso ao ver o print.
- Um produto com elementos fixos próprios pode precisar ajustar a camada da barra inferior e da gaveta.
- Os produtos só podem usar a navegação depois que a exportação for feita na TASK-15.
