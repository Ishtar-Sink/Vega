---
issue: 11
title: "[harness-bug] Evidência diff sai vazia quando o arquivo já foi commitado durante a tarefa"
created_at: 2026-11-10T17:42:47Z
---

<!-- Relato de defeito do próprio harness Vostok (CLI, skills, regras, templates e configuração
     distribuídos), não do projeto do usuário. Use só dados do harness: troque caminhos, nomes,
     trechos de código e saídas do projeto por exemplos neutros e mascare segredos. Valide com
     `vostok bug check <arquivo>`. Comentários como este não vão para a issue. -->

## Versão

- `vostok 0.5.3`
- `Linux 6.18.33.2-microsoft-standard-WSL2`
- Agente: Claude Code

## Comportamento atual

Numa tarefa com evidência do tipo diff (`- \`mudanca.diff\` (diff): \`docs/guia.md\``), o `vostok task evidence <SPEC> <TASK> --antecipada` (e o `vostok task evidence` da finalização) falha quando o arquivo foi commitado depois do baseline e antes de as evidências serem geradas:

```
Erro: evidências antecipadas de TASK-02 com erro; nada mudou nos resultados:
- mudanca.diff: sem diferença em docs/guia.md
```

O diff parece ser calculado entre a pasta de trabalho e o `HEAD`. Por isso a mudança da tarefa some assim que é commitada, embora ela exista desde o baseline. Isso acontece em fluxos normais do harness: na tarefa cujos passos pedem o commit antes de um passo manual (por exemplo, enviar a `main` e criar uma tag para a CI publicar), ou quando o usuário pede o commit (skill `approve-commit`) antes de finalizar.

## Comportamento esperado

A evidência diff mostra a mudança da tarefa em relação ao estado do baseline, inclusive a parte já commitada. Por exemplo, o `vostok task start` grava o commit do baseline, e o diff usa `git diff <commit-do-baseline> -- <caminho>`, que soma o que foi commitado e o que ainda está na pasta de trabalho. No mínimo, a mensagem de erro deveria explicar que o arquivo foi commitado e como seguir.

## Como reproduzir

1. Num repositório git de exemplo com o harness, crie e aprove uma tarefa que muda `docs/guia.md`, com a evidência `- \`mudanca.diff\` (diff): \`docs/guia.md\`` em "Evidências".
2. `vostok task start SPEC-001 TASK-02 --model <modelo>` (coleta o baseline).
3. Altere `docs/guia.md`.
4. Commite a mudança: `printf 'docs: guia\n' | vostok commit commit docs/guia.md`.
5. `vostok task evidence SPEC-001 TASK-02 --antecipada`.
6. Resultado: `mudanca.diff: sem diferença em docs/guia.md`, e a tarefa não fica `executed`.

## Causa provável

No `vostok task evidence`, o tipo `diff` (`evidence_diff: diff` em `config/tasks.yml`) gera o diff da pasta de trabalho contra o `HEAD`, e não contra o commit em que o baseline foi coletado. O commit do baseline não parece ser gravado no `estado.yml`.

## O que já foi tentado

- Contorno que funcionou: ajustar a tarefa (skill `adjust-task`) para trocar cada evidência diff por uma automática da verificação, com uma linha autocontida `git diff <commit-anterior-à-tarefa> <último-commit-da-tarefa> -- docs/guia.md`. A tarefa volta para `in_progress` e as conferências anteriores caem.
- `vostok task evidence --help` não tem opção para indicar o commit base do diff.
