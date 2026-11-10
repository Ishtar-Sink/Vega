<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Migração com TDD ([project/development-methodology-01]) de `src/money-field/` a partir de `../atria/packages/ui/src/money-field/` (commit `139d036`): `money-mask.ts` (funções puras de máscara, com teste próprio) e `money-field.tsx` (o campo, que renderiza o `TextField` da TASK-04 por `../text-field/text-field`). Os testes do Atria vêm primeiro e ganham casos de outros locales (CB-03), textos recebidos (CT-12), teclado (CT-09) e props nativas (CT-13).

## O que muda em relação ao Atria (conformidade)

| Item | Atria hoje | Na Vega |
|---|---|---|
| Props | Interface própria com `label`, `error`, `help`, `name`, `id`, `disabled`, `onBlur`; sem `className`, `style`, `ref` nem `data-*`. | `Omit<TextFieldProps, 'value' \| 'defaultValue' \| 'onChange' \| 'type' \| 'inputMode'>`: todas as props nativas do `<input>` chegam pelo `TextField` (RF-20). |
| Valor | `value_cents`. | `valueCents` ([project/naming-convention-09]; RN-02 permite pela conformidade; vai para o `CHANGELOG.md`). |
| `onBlur` | `() => void`. | O nativo do `TextFieldProps` (`FocusEventHandler`), chamado com o evento. |
| Locale e moeda | `locale = 'pt-BR'`, `currency = 'BRL'`. | Mantidos como padrão, sobrescrevíveis por prop ([project/language-06], [project/code-style-07]). |
| Comentário da máscara | Cita `RN-09` do Atria. | Sem referência ao Atria ([project/architecture-04]). |
| Estilo | Sem `.module.css`. | `money-field.module.css` com `font-variant-numeric: tabular-nums` ([project/architecture-02]). |

O campo não tem texto fixo: rótulo, ajuda e erro vêm por prop; o símbolo e os separadores vêm do `Intl` no `locale` recebido. O erro já sai com `role="alert"` e `aria-describedby` pelo `TextField` ([project/accessibility-04]).

## Decisões

- **Tokens de fonte e camada (decisão do usuário).** A TASK-02 cria `--font-weight-*`, `--line-height-*` e `--z-*`; o `money-field.module.css` não usa nenhum desses valores, mas a busca de literais da Verificação também pega `font-weight`, `line-height` e `z-index` numéricos, para o estilo novo seguir a regra.
- **`MoneyField` estende `TextFieldProps`.** Herda a regra da TASK-04 ("Props nativas no controle"): `className`, `style`, `...rest` e `ref` vão ao `<input>`; o `className` recebido é somado ao `styles.root` do próprio módulo. Alternativa descartada: manter a interface própria do Atria e acrescentar só `className`/`style`, que deixaria `ref` e `data-*` de fora (CT-13).
- **Arquivo `.module.css` com `tabular-nums`.** [project/architecture-02] pede o trio de arquivos; em vez de um módulo vazio, o estilo tem uma função real (algarismos de largura fixa em valores monetários), sem literal (RNF-02) e sem mudar cor, tamanho ou tipografia da identidade (RN-03). Alternativa descartada: não criar o CSS e registrar exceção à regra; e um módulo vazio, que seria código morto ([project/code-style-05]).
- **Parâmetros `locale` e `currency` obrigatórios nas funções puras.** As funções exportadas não têm padrão escondido; o padrão `pt-BR`/`BRL` fica só no componente. Alternativa descartada: padrões nas funções, que fixariam um formato no pacote ([project/code-style-07]).
- **Testes de locale com valores calculados pelo `Intl`.** Prefixos e sufixos (`$`, ` €`) vêm do próprio `Intl` no teste, como o Atria já faz com o BRL, para o teste não quebrar com a versão do ICU do Node. Alternativa descartada: strings fixas como `14.500,50 €`, que dependem do espaço não separável de cada versão.

## Riscos

- **Moedas sem duas casas decimais** (como `JPY`): a máscara e `formatCents` assumem centavos (duas casas), como no Atria e na spec (RF-12). Uma moeda com outro número de casas formataria errado; fica fora desta spec e deve ir para o `CHANGELOG.md` como limitação conhecida.
- **Locales com separador de grupo diferente de `.`/`,`** (por exemplo, `fr-FR` usa espaço fino): a máscara usa o separador do `Intl` e funciona, mas não há teste para eles além de `pt-BR`, `en-US` e `de-DE`.

## Referências da spec

RF-12, RF-19, RF-20, RNF-01, RNF-02, RNF-06, RN-01, RN-02, RN-03, CB-03, CT-09, CT-12, CT-13.

## Arquivos em comum com a onda

Onda 4: TASK-05, TASK-06, TASK-08, TASK-09 e TASK-10. Nenhum arquivo em comum: a tarefa só cria `src/money-field/` e lê `src/text-field/` (TASK-04, sem alterar).

## O que foi feito

Criei os cinco arquivos de `src/money-field/` a partir do Atria. Os testes falharam antes do código (módulos ausentes) e passaram depois.

- `money-mask.ts`: `maskMoneyInput` (formata o texto digitado sem completar os decimais), `parseMoneyInput` (extrai os centavos inteiros, ou `null` se vazio ou fora do inteiro seguro) e `formatCents` (valor em centavos com duas casas). As três recebem `locale` e `currency` obrigatórios e mantêm o cache do Atria. O comentário do topo não cita mais o Atria, e as três funções têm JSDoc.
- `money-mask.test.ts`: testes trazidos do Atria, com os casos de en-US/USD (prefixo), de-DE/EUR (sufixo) e valor acima do inteiro seguro. Os prefixos e sufixos são calculados pelo `Intl` dentro do próprio teste.
- `money-field.tsx`: `MoneyField` estende `TextFieldProps` (sem `value`, `defaultValue`, `onChange`, `type` e `inputMode`), recebe `valueCents`, `locale` (padrão `pt-BR`) e `currency` (padrão `BRL`) e renderiza o `TextField` com `inputMode="decimal"` e `autoComplete="off"`. O `className` recebido é somado ao estilo do próprio módulo, e o `onBlur` nativo é chamado depois da formatação. O ajuste do texto quando valor, locale ou moeda mudam de fora foi mantido.
- `money-field.test.tsx`: testes trazidos do Atria com `valueCents`, mais os casos de en-US/USD, rótulo e erro recebidos em outro locale, teclado, mudança de valor vinda de fora e props nativas, `ref` e `data-*` chegando ao `<input>`.
- `money-field.module.css`: `.root` com `font-variant-numeric: tabular-nums`, sem cor, tamanho ou duração literais.

Verificação e evidências:

- Testes: sem falhas. Regressão: os três comandos repetem o baseline.
- Evidências: `dinheiro-testes.txt`, `dinheiro-locale.txt` (automática) e `dinheiro-temas.png` foram conferidas pelo usuário; o print de temas foi aceito sem ressalvas.
- Ajuste 1 (histórico): o print manual virou automático, com build temporário em `node_modules` e Chromium headless, sem arquivo novo no projeto.

Mudanças de API a registrar no `CHANGELOG.md` (TASK-14):

- `value_cents` virou `valueCents`.
- `onBlur` passou a ser o nativo do campo, chamado com o evento.
- Moedas sem duas casas decimais continuam fora do escopo (ver Riscos).

Ponto de atenção: o módulo de estilo não define largura nem espaçamento, então não tem `box-sizing` próprio.
