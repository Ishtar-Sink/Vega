<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Cria o componente que mostra o texto das lições, enunciados e resoluções escrito em Markdown, com a tipografia de leitura do ecossistema e o mesmo resultado em todos os produtos.
O texto é convertido com segurança: nada escrito no conteúdo consegue executar código ou injetar HTML na página.
Sai numa entrada própria do pacote, para que um produto que não usa Markdown não carregue o conversor e mantenha a primeira tela leve.
Perfil `julgamento`; risco alto, por ser o único componente que trata conteúdo vindo de fora. Depende das dependências da TASK-01 e é um dos componentes que a publicação da 0.2.0 espera.

## O que foi feito

A Vega ganhou o componente `Prose`, que mostra textos escritos em Markdown, com títulos, listas, tabelas, links, imagens e citações, com a tipografia de leitura do ecossistema. O componente fica numa parte separada do pacote, então um produto que não usa Markdown não carrega esse conteúdo. Em celulares estreitos, as tabelas largas rolam para o lado, sem apertar o texto. A entrega foi verificada com testes automáticos, e as evidências foram conferidas pelo usuário.

## Pontos de atenção

- O texto de fora nunca executa código nem mostra HTML escondido. Conteúdo que não é permitido some da tela sem aviso.
- Um recurso novo, como fórmulas matemáticas, pode exigir ajuste na Vega, e não só no produto que o pede.
- Em telas muito estreitas, palavras curtas em uma célula de tabela ainda podem quebrar em duas linhas.
