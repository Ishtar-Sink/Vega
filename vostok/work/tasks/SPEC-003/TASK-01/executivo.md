<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Prepara o pacote para os componentes novos: acrescenta as bibliotecas de ícones e de Markdown que a spec escolheu e deixa pronta a entrada separada do componente de texto formatado, para que um produto sem Markdown não carregue esse código. Nada muda para quem já usa a 0.1.0. Perfil `padrao`; risco baixo, porque o build é conferido no fim. Desbloqueia os ícones (TASK-02) e o `Prose` (TASK-13).

Na prática, a biblioteca ganhou as ferramentas que os próximos componentes precisam: um conjunto de ícones e um leitor de textos formatados. O leitor ficou em um pacote separado, então um produto que não o usa não carrega esse código a mais. As verificações de montagem e de dependências passaram, sem falha grave de segurança, e quem já usa a biblioteca não precisa refazer nada.
