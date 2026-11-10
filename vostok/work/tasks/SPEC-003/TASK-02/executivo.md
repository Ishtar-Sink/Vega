<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

Traz para a Vega um conjunto de 36 ícones de interface (navegação, setas, ações, estados, conta e estudo), para que nenhum produto desenhe os próprios ícones. Eles seguem a cor do texto, têm três tamanhos e são sempre decorativos, sem confundir leitores de tela. Perfil `padrao`; risco baixo. Depende das dependências da TASK-01 e desbloqueia os componentes que usam ícone: `RadioGroup`, `Disclosure`, `Callout`, `BottomSheet`, `FocusHeader` e `AppShell`.

## O que foi feito

A Vega ganhou 36 ícones de interface, como setas, menus, ações, avisos, conta e estudo. Todos seguem a cor do texto ao redor, então funcionam em tema claro e escuro. Eles têm três tamanhos (pequeno, padrão e grande), e o padrão é o tamanho médio. Cada produto usa o mesmo desenho, sem criar ícones próprios. A entrega foi verificada com testes automáticos, e as evidências foram conferidas pelo usuário.

## Pontos de atenção

- Os ícones são sempre decorativos: quem usa leitor de tela não ouve o nome do desenho. O que a pessoa pode fazer precisa estar escrito no botão ou no link que contém o ícone.
- Os nomes dos 36 ícones fazem parte do combinado com a spec. Trocar um nome depois afeta os produtos que já usam o ícone.
- Um ícone fora desse conjunto precisa ser incluído na Vega antes de ser usado pelo produto.
