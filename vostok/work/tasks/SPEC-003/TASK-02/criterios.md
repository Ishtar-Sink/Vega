### Concluída quando

- [ ] Os 36 ícones da primeira leva são exportados com os nomes da Vega, sobre o `lucide-react` (RF-01, CT-01).

  > Como comprovar: abrir `icones-testes.txt` e ver "exporta os 36 ícones da primeira leva" aprovado e uma linha aprovada por ícone.

- [ ] Todo ícone é decorativo, com `aria-hidden` fixo, traço `currentColor`, tamanho 20 por padrão (16 e 24 por prop) e repassa a `ref` (RF-02, CT-01, CT-02).

  > Como comprovar: em `icones-testes.txt`, ver aprovados "é decorativo, com traço currentColor e ref", "aceita os tamanhos 16 e 24" e "mantém aria-hidden mesmo com outro valor".

- [ ] Os arquivos novos têm até 200 linhas e nenhum ícone tem cor fixa (RNF-08, RN-03).

  > Como comprovar: abrir `icones-arquivos.txt` e ver a linha "OK: arquivos dos ícones em até 200 linhas e sem cor fixa".

- [ ] Os ícones são legíveis nos temas claro e escuro, nos três tamanhos (RF-01, RF-02).

  > Como comprovar: abrir `icones-temas.png` e ver a grade completa nos dois painéis, com o traço claro no escuro e os três tamanhos diferentes.
