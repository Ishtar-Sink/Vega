<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Cria o componente que mostra o texto das lições, enunciados e resoluções escrito em Markdown, com a tipografia de leitura do ecossistema e o mesmo resultado em todos os produtos.
O texto é convertido com segurança: nada escrito no conteúdo consegue executar código ou injetar HTML na página.
Sai numa entrada própria do pacote, para que um produto que não usa Markdown não carregue o conversor e mantenha a primeira tela leve.
Perfil `julgamento`; risco alto, por ser o único componente que trata conteúdo vindo de fora. Depende das dependências da TASK-01 e é um dos componentes que a publicação da 0.2.0 espera.
