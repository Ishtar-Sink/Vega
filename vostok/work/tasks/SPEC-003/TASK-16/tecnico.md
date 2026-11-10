<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Teste antes pelo próprio bloco da "Verificação" (falha pela versão 0.1.0). Depois a versão, o CHANGELOG e o README, conferidos por scripts que leem os arquivos e importam o pacote gerado. A publicação segue o caminho da 0.1.0 (TASK-14 da SPEC-001): o workflow `Release` já existe, e o segredo `NPM_TOKEN` já está no ambiente `npm`, então o único passo manual que publica é a tag `v0.2.0`.

## Decisões e alternativas

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Conteúdo do CHANGELOG e do README provado por scripts (`changelog.txt`, `readme-pacote.txt`). | Evidências do tipo diff, como na 0.1.0. | O tipo diff compara com o `HEAD` e sai vazio depois do commit (Ishtar-Sink/Vostok#11), e o commit é passo manual antes da tag. |
| O `changelog.txt` exige cada componente, ícone e prop nova entre crases. | Conferir só os quatro grupos. | Garante que nada do lote fica sem registro ([project/development-methodology-06]). |
| A versão sai `0.2.0` (minor). | `0.1.1`. | Componentes e props novos, sem quebra de contrato ([project/development-methodology-05]); decisão 5 da spec. |
| `npm-view.txt` também confere `license` e `dist-tags.latest`. | Só versão e provenance. | Na 0.1.0, a versão `0.0.0-stage` (sem licença) chegou a ocupar o `latest`; o critério evita repetir isso. |
| Licença do Lucide citada no README (ISC, pelo `lucide-react`). | Copiar o texto da licença para o pacote. | O `lucide-react` é dependência instalada com a própria licença; a Vega não copia o código dele (decisão 1). |

## Pontos de atenção

- O npm pode deixar a 0.2.0 em "Validating" por alguns minutos depois do `success` do workflow; o `npm-view.txt` só passa quando ela aparece no registro.
- Tokens com "Bypass 2FA" passam a ser restringidos pelo npm até jan/2027 (registrado na TASK-14 da SPEC-001). A migração para Trusted Publishing fica fora desta spec.
- FA-01: se o prazo apertar, o usuário decide publicar sem `Prose` e `AppShell`; isso exige ajustar a spec e esta tarefa antes.

## Riscos

- Workflow `Release` falha (FA-02): correção pela CI e tag recriada, nunca `npm publish` local.
- O `changelog.txt` reprova por um nome trocado numa tarefa de componente: o passo 3 manda ler os `tecnico.md` e usar o nome registrado.

## Referências da spec

RF-42, CT-39, RN-06, FA-01, FA-02; decisão 5; [project/development-methodology-05], [project/development-methodology-06], [project/security-04].

## Arquivos em comum na onda

Onda 5 só tem esta tarefa. O `package.json` também é mudado pela TASK-01, na onda 1.

## O que foi feito

- Teste antes: a Verificação falhou no primeiro comando com `ERRO: versão 0.1.0 no package.json`.
- `package.json`: `version` de `0.1.0` para `0.2.0`, sem outra mudança.
- `CHANGELOG.md`: entrada `[0.2.0] - 2026-11-10` acima da `[0.1.0]`, com os quatro grupos.
  - Adicionado: os 36 ícones com todos os nomes, um item por componente novo, o `Prose` com a entrada própria e a sanitização, os 18 tipos públicos e as quatro dependências com o motivo.
  - Alterado: `size` e `block` no `Button`, `valueText` e `indeterminate` no `ProgressBar`, e o `exports` de `.` com `types` e `import`, mais o `./prose`. Esta última mudança não estava listada nos passos; ela veio de `git diff v0.1.0 HEAD -- package.json` (TASK-01).
  - Corrigido: "Nenhuma correção nesta versão."
  - Removido: "Nada removido nesta versão."
  - O `changelog.txt` conferiu 55 de 55 itens.
- `README.md`:
  - A tabela de Componentes ganhou os nomes novos nos grupos existentes e três grupos novos (Ícones de interface, Navegação e Conteúdo), com a versão de entrada de cada grupo.
  - Ganhou as seções `## Ícones`, com o Lucide e a licença ISC e um exemplo com `HomeIcon`, e `## Texto formatado (Prose)`, com o import de `@ishtar-sink/vega/prose`, `size="reading"`, `remarkPlugins` e `components`.
- Publicação:
  - Com a autorização do usuário, os commits `ff7a230` (release) e `b480480` foram enviados à `main`, e a CI da `main` terminou com `success`.
  - O usuário criou e enviou a tag `v0.2.0`. O workflow `Release` terminou com `success` (execução 42894996573), e o `npm view` passou a responder cerca de 220 s depois.
- Resultado: `npm-view.txt` mostra a versão 0.2.0, a licença `AGPL-3.0-only`, a provenance `https://slsa.dev/provenance/v1` e `latest` em 0.2.0. `release-ci.txt` mostra `v0.2.0 push completed success`.
- Regressão: só as duas mudanças esperadas (a versão, e as seções novas do CHANGELOG e do README).

## Pontos de atenção

- `BottomSheetLabels` e `FocusHeaderLabels`, os tipos da prop `labels`, não são exportados pelo índice. Na 0.1.0, os equivalentes (`DateFieldLabels`, `CalendarLabels`) são. O usuário decidiu publicar assim; até a 0.2.1, quem usa a Vega tipa com `BottomSheetProps['labels']`.
- O `NPM_TOKEN` do ambiente `npm` precisa migrar para Trusted Publishing antes de janeiro de 2027.
- O npm demora alguns minutos em "Validating" depois do `Release`: uma checagem automática logo após o workflow responde `E404` mesmo com a publicação certa.
