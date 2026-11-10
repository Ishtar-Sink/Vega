# Interação

Define como o agente apresenta perguntas e escolhas ao usuário.



[project/interaction-01]: No Claude Code, toda pergunta do template `question` e toda escolha de próximo passo ao fim de uma resposta são feitas pelo prompt de múltiplas opções da ferramenta (AskUserQuestion), com a opção recomendada em primeiro e marcada como recomendada; o texto do template só é usado nas ferramentas sem esse prompt.
