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
| Ações | `Button` (com `size` e `block` desde a 0.2.0), `IconButton`, `MenuButton` |
| Campos | `TextField`, `SelectField`, `Checkbox`, `SegmentedField`, `Autocomplete`, `TagField`, `ColorField`, `ColorPicker`, `DEFAULT_COLOR_FIELD_LABELS`, `hexToRgb`, `rgbToHex`, `hslToRgb`, `rgbToHsl`; na 0.2.0, `Switch`, `RadioGroup`, `TextAreaField` |
| Data e hora | `Calendar`, `DateField`, `TimeField`, `DateTimeField`, `PeriodField`, `parseTime`, `maskTime`, `resolvePeriod` |
| Dinheiro | `MoneyField`, `maskMoneyInput`, `parseMoneyInput`, `formatCents` |
| Estrutura | `Card`, `PageHeader`, `Toolbar`, `Tabs`, `ViewSwitcher`, `FormGrid`, `FormActions`; na 0.2.0, `CardLink`, `CardButton`, `FocusHeader`, `Disclosure`, `Accordion` |
| Diálogos e avisos | `Dialog`, `ConfirmDialog`, `Toast`, `ToastRegion`; na 0.2.0, `BottomSheet`, `Callout` |
| Estados | `EmptyState`, `LoadingState`, `Skeleton`, `ErrorState`, `ProgressBar` (com `valueText` e `indeterminate` desde a 0.2.0) |
| Marca e itens | `BrandLogo`, `Badge`, `ItemSwatch`, `ListIcon`, `GridIcon`, `ShelfIcon`, `TableIcon`, `DayIcon`, `TimelineIcon` |
| Ícones de interface | Os 36 da seção [Ícones](#ícones), na 0.2.0 |
| Navegação | `AppShell`, `Sidebar`, `BottomNav`, `Topbar`, na 0.2.0 |
| Conteúdo | `Prose`, na 0.2.0, pela entrada `@ishtar-sink/vega/prose` |
| Tempo e conexão | `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration`, `daysBetween`, na 0.3.0 |

Os grupos Ações, Campos, Data e hora, Dinheiro, Estrutura, Diálogos e avisos, Estados e Marca e itens entraram na 0.1.0; o que a tabela marca com 0.2.0, e os grupos Ícones de interface, Navegação e Conteúdo, entraram na 0.2.0; o grupo Tempo e conexão entrou na 0.3.0.

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

## Ícones

Os 36 ícones de interface vêm do [Lucide](https://lucide.dev), pelo pacote `lucide-react` (licença ISC), com os nomes da Vega: `HomeIcon`, `BookOpenIcon`, `LayersIcon`, `TimerIcon`, `UsersIcon`, `MenuIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `ArrowLeftIcon`, `CloseIcon`, `PlusIcon`, `MinusIcon`, `DownloadIcon`, `UploadIcon`, `FlagIcon`, `RefreshIcon`, `EyeIcon`, `CheckIcon`, `CircleCheckIcon`, `InfoIcon`, `AlertTriangleIcon`, `CircleAlertIcon`, `WifiOffIcon`, `CloudCheckIcon`, `UserIcon`, `SettingsIcon`, `LogOutIcon`, `SunIcon`, `MoonIcon`, `LightbulbIcon`, `ClockIcon`, `CalendarIcon`, `PencilIcon`, `SearchIcon` e `TrashIcon`.

Os ícones são sempre decorativos (`aria-hidden`), usam a cor do texto (`currentColor`) e têm tamanho 16, 20 ou 24, com 20 por padrão. O nome acessível fica no elemento que contém o ícone.

```tsx
import { Button, HomeIcon } from '@ishtar-sink/vega';

export function Inicio() {
  return (
    <Button variant="primary">
      <HomeIcon size={16} />
      Início
    </Button>
  );
}
```

## Texto formatado (Prose)

O `Prose` sai numa entrada própria, `@ishtar-sink/vega/prose`, para que quem não usa Markdown não carregue o parser. O HTML cru do texto é ignorado, e links com `javascript:`, `data:` ou `vbscript:` são bloqueados.

```tsx
import { Prose } from '@ishtar-sink/vega/prose';

export function Licao({ texto }: { texto: string }) {
  return <Prose markdown={texto} size="reading" />;
}
```

Extensões do produto, como fórmulas de matemática, entram por `remarkPlugins` (sintaxe nova) e `components` (como cada elemento é renderizado), sem mudar a Vega.

## Tempo e conexão

O `Timer` calcula o tempo pelo relógio, e não por ticks. Ele funciona como regressivo, com `endsAt`, ou como progressivo, com `direction="up"` e `startedAt`.

O `Countdown` conta os dias de calendário entre `today` e `target`. O produto passa `today` já no fuso do usuário.

O `ConnectionStatus` mostra o estado em `chip` ou `detail`. Ele não consulta a rede: o produto informa o `state`.

```tsx
import { ConnectionStatus, Countdown, Timer } from '@ishtar-sink/vega';

export function Simulado({ fim, hoje, entregar }: { fim: number; hoje: string; entregar: () => void }) {
  return (
    <>
      <Timer endsAt={fim} warnAt={[30, 10, 5]} onExpire={entregar} />
      <Countdown target="2026-12-20" today={hoje} caption="para a prova" />
      <ConnectionStatus state="syncing" progress={{ done: 3, total: 8 }} />
    </>
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
