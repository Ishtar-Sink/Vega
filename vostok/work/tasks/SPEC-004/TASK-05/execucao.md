### Ler

- `vostok/work/specs/refined/SPEC-004-timer-countdown-e-connectionstatus.md` (RF-19, RF-20, CT-15, RN-01 a RN-05, "Escopo", "Contratos e interfaces")
- `vostok/rules/project/development-methodology.md` ([project/development-methodology-05] e [project/development-methodology-06])
- `vostok/rules/project/security.md` ([project/security-04])
- `CHANGELOG.md` (formato da entrada `[0.2.0]`: parágrafo de abertura e os grupos Adicionado, Alterado, Corrigido e Removido)
- `README.md` (seções Componentes, Ícones, Texto formatado (Prose) e Tema próprio)
- `package.json` (campo `version`)
- `.github/workflows/release.yml`
- `src/index.ts`
- `vostok/work/tasks/SPEC-004/TASK-01/tecnico.md` a `vostok/work/tasks/SPEC-004/TASK-04/tecnico.md` (componentes, props e nomes entregues, decisões e mudanças registradas)
- `vostok/work/.archive/SPEC-003/tasks/TASK-16/tecnico.md` e `vostok/work/.archive/SPEC-003/tasks/TASK-16/verificacao.md` (como a 0.2.0 foi publicada e conferida)

### Mudar

- `CHANGELOG.md` (alterar): entrada `[0.3.0]` acima da `[0.2.0]`, com Adicionado, Alterado, Corrigido e Removido (RF-20, [project/development-methodology-06]).
- `README.md` (alterar): componentes e utilitários novos na tabela, frase de versões e seção "Tempo e conexão" (RF-20).
- `package.json` (alterar): `version` de `0.2.0` para `0.3.0` (RF-20, [project/development-methodology-05]).

### Passos

1. Teste antes: rode o bloco da "Verificação" e confira que ele falha no primeiro comando, porque o `package.json` ainda está na `0.2.0`. Confira: a saída mostra `ERRO: versão 0.2.0 no package.json`.
2. `package.json` (alterar): troque `"version": "0.2.0"` por `"version": "0.3.0"`, sem mudar mais nada. Confira: `node -p "require('./package.json').version"` imprime `0.3.0`.
3. `CHANGELOG.md` (alterar): acima de `## [0.2.0] - 2026-11-10`, acrescente `## [0.3.0] - AAAA-MM-DD`, com a data do dia da execução, e um parágrafo: componentes de tempo e conexão pedidos pelo Synestia (KT-002), genéricos para qualquer produto, compatíveis com a 0.2.0. Depois, em pt-br e com o motivo de cada item, lendo os `tecnico.md` das TASK-01 a TASK-04 da SPEC-004:
   - `### Adicionado`: um item por componente novo, com as props que o `changelog.txt` confere: `Timer` (regressivo e progressivo por `direction`, `warnAt`, `onExpire`, `hideable`, tempo derivado do relógio), `Countdown` (dias de calendário, tamanhos `display` e `inline`) e `ConnectionStatus` (cinco estados em `ConnectionState`, variantes `chip` e `detail`); um item para os utilitários `formatDuration` e `daysBetween`; um item para os tipos públicos (`TimerProps`, `TimerCountdownProps`, `TimerElapsedProps`, `TimerLabels`, `DurationParts`, `CountdownProps`, `CountdownLabels`, `ConnectionStatusProps`, `ConnectionStatusLabels`, `ConnectionState`), com o motivo (textos trocáveis por `labels`, sem regra de produto, RN-02 e RN-03). Nomes de componentes, props, utilitários e tipos sempre entre crases.
   - `### Alterado`: "Nenhuma mudança em componentes existentes; compatível com a 0.2.0." Inclua qualquer mudança de contrato registrada nos `tecnico.md`.
   - `### Corrigido`: os bugs corrigidos registrados nos `tecnico.md`; senão, a linha "Nenhuma correção nesta versão."
   - `### Removido`: "Nada removido nesta versão." (salvo registro em contrário nos `tecnico.md`).
   Se uma tarefa trocou um nome ou acrescentou um valor ou tipo público, use o nome registrado no `tecnico.md` dela e cite a troca no `tecnico.md` desta tarefa. Confira: o comando `changelog.txt` da "Verificação" termina em `OK: ...`.
4. `README.md` (alterar):
   - Na tabela de `## Componentes`, acrescente a linha `| Tempo e conexão | `Timer`, `Countdown`, `ConnectionStatus`, `formatDuration`, `daysBetween`, na 0.3.0 |` depois da linha `Conteúdo`, e troque o último parágrafo de versões (que começa com "Os grupos Ações, Campos...") por uma frase com a versão em que cada grupo entrou: 0.1.0 (os grupos que já estavam), 0.2.0 (o que a tabela marca com 0.2.0 e os grupos Ícones de interface, Navegação e Conteúdo) e 0.3.0 (o grupo Tempo e conexão).
   - Acrescente `## Tempo e conexão`, depois de `## Texto formatado (Prose)` e antes de `## Tema próprio`: um parágrafo curto dizendo que o `Timer` (regressivo com `endsAt`, progressivo com `direction="up"` e `startedAt`) calcula o tempo pelo relógio, que o `Countdown` conta dias de calendário a partir de `today` e `target` (o produto passa a data no fuso do usuário) e que o `ConnectionStatus` mostra o estado em `chip` ou `detail`, sem consultar a rede (o produto informa o `state`); e um bloco `tsx` com `import { ConnectionStatus, Countdown, Timer } from '@ishtar-sink/vega';` e uma função de exemplo que renderiza `<Timer endsAt={fim} warnAt={[30, 10, 5]} onExpire={entregar} />`, `<Countdown target="2026-12-20" today={hoje} caption="para a prova" />` e `<ConnectionStatus state="syncing" progress={{ done: 3, total: 8 }} />`. As props do exemplo devem existir nos tipos da spec.
   Mantenha as demais seções. Confira: o comando `readme-pacote.txt` da "Verificação" termina em `OK: ...` depois de um `pnpm build`.
5. Rode `pnpm exec prettier --write CHANGELOG.md README.md package.json` e o bloco da "Verificação" até antes da linha `# evidência: npm-view.txt` (comandos locais). Confira: todos com código 0.
6. **PARE** e peça ao usuário, com o template `question`, os passos manuais (o agente não faz nenhum deles, [project/security-04]):
   1. Fazer o commit do trabalho pela skill `approve-commit` e levar a `main` ao GitHub, com a CI verde.
   2. Criar e enviar a tag: `git tag v0.3.0 && git push origin v0.3.0` (o segredo `NPM_TOKEN` do ambiente `npm` já existe desde a 0.1.0).
   3. Acompanhar o workflow "Release" até `success`. Se falhar, corrigir pela CI, apagar e recriar a tag (`git push origin :refs/tags/v0.3.0`); nunca `npm publish` local.
   4. Esperar o npm liberar a versão: na 0.2.0, ela ficou cerca de 4 minutos em "Validating" depois do `success` do Release, e o `npm view` respondeu `E404` nesse intervalo.
   Confira: o usuário confirma que o workflow "Release" terminou e `npm view @ishtar-sink/vega@0.3.0 version` imprime `0.3.0`.
7. Rode o bloco da "Verificação" inteiro. Confira: código 0, com `npm-view.txt` mostrando a versão 0.3.0 e a provenance.
