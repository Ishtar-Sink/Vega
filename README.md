# Vega

Biblioteca de componentes React do ecossistema [Ishtar Sink](https://github.com/Ishtar-Sink). Todo produto da organização monta a interface com as mesmas peças (botões, campos, diálogos, avisos, abas, cartões), construídas sobre os tokens de tema compartilhados. Quando a identidade visual muda, ela muda aqui, e todos os produtos acompanham na próxima atualização.

Código aberto (AGPL-3.0), como os produtos que a usam.

> **Em desenvolvimento.** Este repositório ainda não tem código. A Vega nasce da extração do `@atria/ui`, a biblioteca que o [Atria](https://github.com/Ishtar-Sink/Atria) construiu para a própria interface, e será publicada como `@ishtar-sink/vega`.

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

- **Uma fonte para a identidade.** Os componentes leem os tokens do pacote de tema e não declaram cor, raio, espaço nem fonte próprios. Seguem as [diretrizes do ecossistema](https://github.com/Ishtar-Sink/.github/blob/main/docs/identidade-ecossistema.md).
- **Acessível por padrão.** Cada componente é testado com axe e com navegação por teclado, e o contraste dos tokens é verificado em AA.
- **Tema claro e escuro.** Os dois funcionam sem configuração, com o claro como padrão.
- **Pronta para white label.** A camada de marca pode ser sobrescrita em tempo de execução, nos limites que as diretrizes definem, para os produtos que oferecem white label.
- **Sem dependência de serviço externo.** Fontes e ícones vêm junto com o pacote, nunca de um CDN em tempo de execução.
- **Nenhum produto recria um componente que já existe aqui.** Se faltar algo, o componente entra na Vega, não no produto.

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

Vega, a estrela mais brilhante da Lira, é a referência de brilho da astronomia: por séculos, o brilho de todas as outras estrelas foi medido em relação a ela, que é o ponto zero da escala de magnitude. A biblioteca é a referência visual contra a qual todos os produtos do Ishtar Sink se medem.

## Licença

[AGPL-3.0](LICENSE).
