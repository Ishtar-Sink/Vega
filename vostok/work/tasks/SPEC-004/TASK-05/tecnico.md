<!-- Escrito no planejamento com o que a tarefa vai fazer e enriquecido na conclusão com o que foi feito. -->

## Abordagem

Teste antes pelo próprio bloco da "Verificação" (falha pela versão 0.2.0). Depois a versão, o CHANGELOG e o README, conferidos por scripts que leem os arquivos e importam o pacote gerado. A publicação segue o caminho da 0.2.0 (TASK-16 da SPEC-003): o workflow `Release` já existe e o segredo `NPM_TOKEN` já está no ambiente `npm`, então o único passo manual que publica é a tag `v0.3.0`.

## Decisões e alternativas

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Conteúdo do CHANGELOG e do README provado por scripts (`changelog.txt`, `readme-pacote.txt`). | Evidências do tipo diff. | O tipo diff compara com o `HEAD` e sai vazio depois do commit (Ishtar-Sink/Vostok#11), e o commit é passo manual antes da tag. |
| O `changelog.txt` exige entre crases `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration`, `daysBetween`, `direction`, `warnAt`, `onExpire`, `hideable` e `ConnectionState`. | Conferir só os quatro grupos. | Garante que nada da superfície nova fica sem registro ([project/development-methodology-06]). |
| A versão sai `0.3.0` (minor). | `0.2.1`. | Componentes e utilitários novos, sem quebra de contrato ([project/development-methodology-05]). |
| Grupo novo "Tempo e conexão" na tabela do README. | Espalhar os nomes por Estados e Data e hora. | O `Timer`, o `Countdown` e o `ConnectionStatus` formam um conjunto de uso comum e a frase de versões fica mais simples. |
| `npm-view.txt` também confere `license` e `dist-tags.latest`. | Só versão e provenance. | Na 0.1.0, a versão `0.0.0-stage` (sem licença) chegou a ocupar o `latest`. |
| `readme-pacote.txt` exige que o exemplo importe os três componentes do pacote. | Conferir só que a seção existe. | Prova que o exemplo do README usa nomes reais do `dist/`. |

## Pontos de atenção

- O npm leva cerca de 4 minutos em "Validating" depois do `success` do Release (aprendizado da 0.2.0): uma checagem logo após o workflow responde `E404` mesmo com a publicação certa. O `npm-view.txt` só passa quando a 0.3.0 aparece no registro.
- Tokens com "Bypass 2FA" passam a ser restringidos pelo npm até jan/2027; a migração para Trusted Publishing fica fora desta spec.
- Pendência da 0.2.0: se a TASK-04 ou o usuário decidirem exportar os tipos `BottomSheetLabels` e `FocusHeaderLabels` (adiados para a 0.2.1), eles entram no CHANGELOG da versão em que forem publicados, não nesta.

## Riscos

- Workflow `Release` falha: correção pela CI e tag recriada, nunca `npm publish` local.
- O `changelog.txt` reprova por um nome trocado numa tarefa de componente: o passo 3 manda ler os `tecnico.md` e registrar a troca.
- Prazo do Synestia (17/11): a publicação depende de commit, push e tag feitos pelo usuário.

## Referências da spec

RF-20, CT-15, RNF-08; [project/development-methodology-05], [project/development-methodology-06], [project/security-04].

## Arquivos em comum na onda

Onda 3 só tem esta tarefa. `package.json`, `CHANGELOG.md` e `README.md` não são mudados por outras tarefas da SPEC-004.

## O que foi feito

- `package.json`: versão `0.3.0`.
- `CHANGELOG.md`: entrada `[0.3.0] - 2026-11-10`, com parágrafo de abertura (KT-002, compatível com a 0.2.0) e os quatro grupos.
  - Adicionado: `Timer`, `Countdown`, `ConnectionStatus`, os utilitários e os tipos.
  - Alterado: "Nenhuma mudança...".
  - Corrigido: "Nenhuma correção...".
  - Removido: "Nada removido...".
- **Diferença do plano:** os tipos públicos são 11, e não 10. Entrou o `ConnectionStatusAction`, criado no ajuste 1 da TASK-03 (a pílula inteira clicável com `action: { label, onAction }`) e exportado pela TASK-04. O item do `ConnectionStatus` descreve a `action` nesse formato.
- **Formato da prop `direction`:** na primeira rodada, o `changelog.txt` reprovou com 9 de 10 itens, porque a prop aparecia só como `direction="up"`. A frase passou a citar a `direction` entre crases ("a prop `direction` em `up`").
- **Formato do `formatDuration`:** o CHANGELOG segue o JSDoc. A saída é `mm:ss` abaixo de uma hora e `h:mm:ss` a partir dela; por exemplo, `formatDuration(3725000)` dá `1:02:05`.
- `README.md`: linha "Tempo e conexão" na tabela de componentes; a frase de versões cita a 0.3.0; seção `## Tempo e conexão` entre "Texto formatado (Prose)" e "Tema próprio", com o exemplo `Simulado`.
- **Publicação:** os commits `2c13d80` (`chore(release): 0.3.0`) e `ee47d5f` foram enviados à `main`, e o usuário criou a tag `v0.3.0`.
  - O Release ([execução 42917568055](https://github.com/Ishtar-Sink/Vega/actions/runs/42917568055)) terminou com `success` em 1m18s.
  - A CI da tag e a da `main` também terminaram com `success`. A da `main` voltou a passar com o `.prettierignore` da TASK-04.
  - O npm respondeu `E404` logo após o Release e liberou a versão cerca de 90 segundos depois. Na 0.2.0, foram cerca de 4 minutos.

## Como foi verificado

- `changelog.txt`: 10 de 10 itens.
- `release-ensaio.txt`: os passos do `release.yml` passam com `GITHUB_REF_NAME=v0.3.0`.
- `readme-pacote.txt`: os imports do README existem no `dist/`.
- `npm-view.txt`: versão 0.3.0, licença AGPL-3.0-only, provenance SLSA v1 e `latest` na 0.3.0.
- `release-ci.txt`: a execução do Release da tag.
- Regressão: o Prettier dá o mesmo resultado do baseline. A versão e os títulos mudaram, como esperado.

## Pendências que seguem fora desta spec

- 0.2.1: exportar `BottomSheetLabels` e `FocusHeaderLabels`, overlay no tema claro e rádio no tema escuro.
- Migrar para Trusted Publishing no npm antes de jan/2027.
