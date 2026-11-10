# Vega

Biblioteca de componentes React e temas do ecossistema [Ishtar Sink](https://github.com/Ishtar-Sink). Todo produto da organização monta a interface com as mesmas peças (botões, campos, diálogos, avisos, abas, cartões) e recebe daqui o tema. O tema do Ishtar Sink é o padrão: quando ele muda aqui, todos os produtos que o usam acompanham na próxima atualização. Quem precisar pode trocar a paleta pela sua.

Código aberto (AGPL-3.0) e aberto a qualquer projeto, dentro ou fora do ecossistema.

> **Em desenvolvimento.** Este repositório ainda não tem código. A Vega nasce da extração do `@atria/ui` e do `@atria/theme`, a biblioteca e o tema que o [Atria](https://github.com/Ishtar-Sink/Atria) construiu para a própria interface, e será publicada como `@ishtar-sink/vega`.

## Temas

- **Tema Ishtar Sink, padrão.** É a paleta das [diretrizes do ecossistema](https://github.com/Ishtar-Sink/.github/blob/main/docs/identidade-ecossistema.md), nos temas claro e escuro, junto com a tipografia (Outfit e Inter), os raios, o espaço e o movimento.
- **Paleta própria.** Uma aplicação cria o próprio tema com a API de tema da Vega, preenchendo os mesmos tokens (`bg`, `surface`, `primary`, `success`, os `*Soft`…) nos dois temas, e passa esse tema para os componentes. Nenhum componente tem cor fixa.
- **Contraste verificado.** A Vega traz as verificações de contraste que o tema padrão usa (AA para texto), para que um tema próprio passe pelas mesmas regras nos testes da aplicação.
- **Troca em tempo de execução.** A camada de marca pode ser sobrescrita sem rebuild, o que permite o white label por instância nos produtos que o oferecem.

## O que vem do Atria

| Grupo | Componentes |
|---|---|
| Ações | `Button`, `IconButton`, `MenuButton` |
| Campos | `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete`, `TagField`, `ColorField` |
| Data e hora | `Calendar`, `DateField`, `TimeField`, `DateTimeField`, `PeriodField` |
| Dinheiro | `MoneyField`, com as funções de máscara e formatação em centavos |
| Estrutura | `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid`, `FormActions` |
| Diálogos e avisos | `Dialog`, `ConfirmDialog`, `Toast`, `ToastRegion` |
| Estados | `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState`, `ProgressBar` |
| Marca e itens | `BrandLogo`, `Badge`, `ItemSwatch`, ícones de visualização |

O que parte dessa lista entra na primeira versão, e com que nome, é decidido na extração. Um componente que só faz sentido para o Atria fica no Atria.

## Princípios

- **Uma fonte para a identidade.** Os componentes leem os tokens do tema e não declaram cor, raio, espaço nem fonte próprios.
- **Acessível por padrão.** Cada componente é testado com axe e com navegação por teclado, e o contraste dos tokens é verificado em AA.
- **Tema claro e escuro.** Os dois funcionam sem configuração, com o claro como padrão.
- **Sem dependência de serviço externo.** Fontes e ícones vêm junto com o pacote, nunca de um CDN em tempo de execução.
- **Nenhum produto do ecossistema recria um componente que já existe aqui.** Se faltar algo, o componente entra na Vega, não no produto.

## Uso previsto

```bash
pnpm add @ishtar-sink/vega
```

```tsx
import { Button, Card } from '@ishtar-sink/vega';

export function Exemplo() {
  return (
    <Card>
      <Button variant="primary">Salvar</Button>
    </Card>
  );
}
```

O pacote e a forma de importar os estilos podem mudar até a primeira versão.

## Sobre o nome

Vega, a estrela mais brilhante da Lira, é a referência de brilho da astronomia: por séculos, o brilho de todas as outras estrelas foi medido em relação a ela, que é o ponto zero da escala de magnitude. A biblioteca é a referência visual contra a qual todos os produtos do Ishtar Sink se medem, mesmo os que escolhem uma cor própria.

## Licença

[AGPL-3.0](LICENSE).
