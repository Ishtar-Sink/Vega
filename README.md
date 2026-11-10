# Vega

Biblioteca de componentes React e temas do ecossistema [Ishtar Sink](https://github.com/Ishtar-Sink). Todo produto da organização monta a interface com as mesmas peças (botões, campos, diálogos, avisos, abas, cartões) e recebe daqui o tema. O tema do Ishtar Sink é o padrão: quando ele muda aqui, todos os produtos que o usam acompanham na próxima atualização. Quem precisar pode trocar a paleta pela sua.

Código aberto (AGPL-3.0) e aberto a qualquer projeto, dentro ou fora do ecossistema.

A Vega nasce da extração do `@atria/ui` e do `@atria/theme`, a biblioteca e o tema que o [Atria](https://github.com/Ishtar-Sink/Atria) construiu para a própria interface, e é publicada como `@ishtar-sink/vega`. As mudanças de cada versão estão no [CHANGELOG](CHANGELOG.md).

## Temas

- **Tema Ishtar Sink, padrão.** É a paleta das [diretrizes do ecossistema](https://github.com/Ishtar-Sink/.github/blob/main/docs/identidade-ecossistema.md), nos temas claro e escuro, junto com a tipografia (Outfit e Inter), os raios, o espaço e o movimento.
- **Paleta própria.** Uma aplicação cria o próprio tema com a API de tema da Vega, preenchendo os mesmos tokens (`bg`, `surface`, `primary`, `success`, os `*Soft`…) nos dois temas, e passa esse tema para os componentes. Nenhum componente tem cor fixa.
- **Contraste verificado.** A Vega traz as verificações de contraste que o tema padrão usa (AA para texto), para que um tema próprio passe pelas mesmas regras nos testes da aplicação.
- **Troca em tempo de execução.** A camada de marca pode ser sobrescrita sem rebuild, o que permite o white label por instância nos produtos que o oferecem.

## Componentes

| Grupo | Componentes e funções |
|---|---|
| Ações | `Button`, `IconButton`, `MenuButton` |
| Campos | `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete`, `TagField`, `ColorField`, `ColorPicker`, `DEFAULT_COLOR_FIELD_LABELS`, `hexToRgb`, `rgbToHex`, `hslToRgb`, `rgbToHsl` |
| Data e hora | `Calendar`, `DateField`, `TimeField`, `DateTimeField`, `PeriodField`, `parseTime`, `maskTime`, `resolvePeriod` |
| Dinheiro | `MoneyField`, `maskMoneyInput`, `parseMoneyInput`, `formatCents` |
| Estrutura | `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid`, `FormActions` |
| Diálogos e avisos | `Dialog`, `ConfirmDialog`, `Toast`, `ToastRegion` |
| Estados | `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState`, `ProgressBar` |
| Marca e itens | `BrandLogo`, `Badge`, `ItemSwatch`, `ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon`, `TimelineIcon` |

Todos os componentes da tabela estão na 0.1.0.

## Princípios

- **Uma fonte para a identidade.** Os componentes leem os tokens do tema e não declaram cor, raio, espaço nem fonte próprios.
- **Acessível por padrão.** Cada componente é testado com axe e com navegação por teclado, e o contraste dos tokens é verificado em AA.
- **Tema claro e escuro.** Os dois funcionam sem configuração, com o claro como padrão.
- **Sem dependência de serviço externo.** Fontes e ícones vêm junto com o pacote, nunca de um CDN em tempo de execução.
- **Nenhum produto do ecossistema recria um componente que já existe aqui.** Se faltar algo, o componente entra na Vega, não no produto.

## Instalação

```bash
pnpm add @ishtar-sink/vega react react-dom
```

`react` e `react-dom` `^19.3.1` são peer dependencies.

## Estilos

```ts
import '@ishtar-sink/vega/tokens.css';
import '@ishtar-sink/vega/styles.css';
```

O `tokens.css` traz as variáveis dos dois temas e as fontes; o `styles.css`, o CSS dos componentes. Importe os dois uma vez, na entrada da aplicação, nessa ordem.

O tema claro é o padrão. Para o escuro, use `data-theme="dark"` num elemento ancestral, como o `<html>`. A marca pode ser sobrescrita por variáveis como `--primary` num contêiner, sem rebuild.

## Uso

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

## Tema próprio

```ts
import { dark, defineTheme, light } from '@ishtar-sink/vega';

export const meuTema = defineTheme({
  light: { ...light, primary: '#115e59' },
  dark: { ...dark, primary: '#5eead4' },
});
```

Um teste da aplicação confere que o tema passa nas mesmas regras de contraste do tema padrão:

```ts
import { checkThemeContrast } from '@ishtar-sink/vega';
import { meuTema } from './tema';

it('o tema próprio passa no contraste AA', () => {
  expect(checkThemeContrast(meuTema)).toEqual([]);
});
```

## Sobre o nome

Vega, a estrela mais brilhante da Lira, é a referência de brilho da astronomia: por séculos, o brilho de todas as outras estrelas foi medido em relação a ela, que é o ponto zero da escala de magnitude. A biblioteca é a referência visual contra a qual todos os produtos do Ishtar Sink se medem, mesmo os que escolhem uma cor própria.

## Licença

[AGPL-3.0](LICENSE).
