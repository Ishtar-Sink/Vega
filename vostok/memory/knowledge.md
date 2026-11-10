---
type: knowledge
title: "Conhecimentos"
description: "Descobertas e peculiaridades do projeto sem documentação primária. Consulte antes de pesquisar ou investigar um assunto pouco documentado."
updated_at: 2026-11-10T14:23:20Z
---

# Conhecimentos

Descobertas e peculiaridades do projeto sem documentação primária. Consulte antes de pesquisar ou investigar um assunto pouco documentado.

Entradas criadas por `vostok memory add` e consultadas por `vostok memory search`. Não carregue este arquivo inteiro.

## KNW-001: Evidência da verificação roda só a linha após o rótulo

- **Data:** 2026-11-10
- **Status:** válido
- **Tags:** evidência, verificação, vostok-task-evidence, bash
- **Conhecimento:** O `vostok task evidence` (inclusive `--antecipada`) roda sozinha, num `bash` novo, só a linha que vem logo depois de `# evidência: <arquivo>` no bloco da Verificação. Funções, variáveis e `trap` definidos antes no bloco não existem nesse contexto: uma linha como `build_probe` falha com `command not found`. O `vostok task check` roda o bloco inteiro e passa, por isso o defeito só aparece nas evidências. A linha rotulada precisa ser autocontida, por exemplo uma subshell `( set -e; ...; )` numa linha só.
- **Como foi descoberto:** SPEC-001: a evidência `build-sonda.txt` da TASK-01 e `ci-local-passa.txt`/`ci-local-falha-lint.txt` da TASK-13 falharam no `--antecipada` com a verificação passando; a TASK-01 foi corrigida com a linha autocontida (ajuste 1).
- **Validade:** Vostok 0.5.x. Vale enquanto o `vostok task evidence` executar a linha rotulada isoladamente.
