---
type: decision
title: "Decisões"
description: "Decisões estruturantes do projeto e o motivo de cada uma. Consulte antes de decidir algo que afete arquitetura, stack, dados, contratos ou convenções, e quando houver ambiguidade."
updated_at: 2026-11-10T12:28:24Z
---

# Decisões

Decisões estruturantes do projeto e o motivo de cada uma. Consulte antes de decidir algo que afete arquitetura, stack, dados, contratos ou convenções, e quando houver ambiguidade.

Entradas criadas por `vostok memory add` e consultadas por `vostok memory search`. Não carregue este arquivo inteiro.

## DEC-001: Vega como fonte de verdade da identidade visual do ecossistema

- **Data:** 2026-11-10
- **Status:** ativa
- **Tags:** identidade-visual, tema, tokens, ecossistema
- **Origem:** init-harness, confirmada pelo usuário em 2026-11-10
- **Contexto:** A identidade visual do Ishtar Sink (paleta, tokens, tipografia, contraste) era definida em `Ishtar-Sink/.github` `docs/identidade-ecossistema.md`. A Vega passa a exportar os componentes e o tema padrão que todos os produtos usam.
- **Decisão:** A Vega é a fonte de verdade da identidade visual do ecossistema. O que é decidido aqui prevalece sobre `docs/identidade-ecossistema.md`, e toda mudança de identidade feita na Vega é levada para esse documento.
- **Alternativas descartadas:** Manter o documento da organização como fonte e a Vega como implementação dele: os tokens existiriam em dois lugares e o código acabaria se afastando do documento.
- **Consequências:** Mudanças de tema, tokens, tipografia e contraste começam na Vega (`tokens.ts`) e o documento da organização acompanha. Os produtos herdam a identidade pelo pacote. O documento da organização precisa passar a citar a Vega como fonte. Regras ligadas: [project/theme-08] e [project/development-methodology-04].
- **Substitui:** Nenhuma
