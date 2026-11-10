### Ler

- `vostok/work/specs/refined/SPEC-003-lote-1-de-componentes-para-o-synestia.md` (RF-42, CT-39, RN-06, FA-01, FA-02, "Escopo", "Registro de decisões")
- `vostok/rules/project/development-methodology.md` ([project/development-methodology-05] e [project/development-methodology-06])
- `vostok/rules/project/security.md` ([project/security-04])
- `CHANGELOG.md` (formato da entrada `[0.1.0]`)
- `README.md` (seções Componentes, Instalação, Estilos, Uso e Tema próprio)
- `package.json` (campos `version` e `exports`)
- `.github/workflows/release.yml`
- `src/index.ts`
- `vostok/work/tasks/SPEC-003/TASK-01/tecnico.md` a `vostok/work/tasks/SPEC-003/TASK-15/tecnico.md` (componentes, props e nomes entregues, decisões e mudanças registradas)
- `vostok/work/tasks/SPEC-001/TASK-14/verificacao.md` (ensaio do release e conferência do README da 0.1.0)

### Mudar

- `CHANGELOG.md` (alterar): entrada `[0.2.0]` acima da `[0.1.0]`, com Adicionado, Alterado, Corrigido e Removido (RF-42, [project/development-methodology-06]).
- `README.md` (alterar): componentes novos na tabela, ícones com a licença do Lucide e a entrada `@ishtar-sink/vega/prose` (RF-42).
- `package.json` (alterar): `version` de `0.1.0` para `0.2.0` (RF-42, [project/development-methodology-05]).

### Passos

1. Teste antes: rode o bloco da "Verificação" e confira que ele falha no primeiro comando, porque o `package.json` ainda está na `0.1.0`. Confira: a saída mostra `ERRO: versão 0.1.0 no package.json`.
2. `package.json` (alterar): troque `"version": "0.1.0"` por `"version": "0.2.0"`, sem mudar mais nada. Confira: `node -p "require('./package.json').version"` imprime `0.2.0`.
3. `CHANGELOG.md` (alterar): acima de `## [0.1.0] - 2026-11-10`, acrescente `## [0.2.0] - AAAA-MM-DD`, com a data do dia da execução, e um parágrafo: lote 1 de componentes pedido pelo Synestia (KT-001), genéricos para qualquer produto. Depois, em pt-br e com o motivo de cada item, lendo os `tecnico.md` das TASK-01 a TASK-15 da SPEC-003:
   - `### Adicionado`: um item para os 36 ícones de interface, com todos os nomes (`HomeIcon`, ..., `PencilIcon`, `SearchIcon`, `TrashIcon`), sobre o `lucide-react`; um item por componente novo (`Switch`, `RadioGroup`, `TextAreaField`, `Disclosure` e `Accordion`, `Callout`, `BottomSheet`, `CardLink` e `CardButton`, `FocusHeader`, `Topbar`, `Sidebar`, `BottomNav` e `AppShell`); um item para o `Prose`, citando a entrada `@ishtar-sink/vega/prose` e a sanitização; um item para as dependências novas (`lucide-react`, `react-markdown`, `remark-gfm`, `rehype-sanitize`) com o motivo ([project/stack-07]).
   - `### Alterado`: `Button` ganha `size` (`md`, `lg`) e `block`; `ProgressBar` ganha `valueText` e `indeterminate`; os padrões continuam iguais (compatível com a 0.1.0). Inclua qualquer outra mudança de contrato registrada nos `tecnico.md`.
   - `### Corrigido`: os bugs corrigidos registrados nos `tecnico.md`; senão, a linha "Nenhuma correção nesta versão."
   - `### Removido`: "Nada removido nesta versão." (salvo registro em contrário nos `tecnico.md`).
   Confira: o comando `changelog.txt` da "Verificação" termina em `OK: ...`.
4. `README.md` (alterar):
   - Na tabela de `## Componentes`, acrescente as linhas ou os nomes dos componentes novos nos grupos (Ações: `Button` com `size`/`block`; Campos: `Switch`, `RadioGroup`, `TextAreaField`; Estrutura: `CardLink`, `CardButton`, `FocusHeader`, `Disclosure`, `Accordion`; Diálogos e avisos: `BottomSheet`, `Callout`; Navegação, grupo novo: `AppShell`, `Sidebar`, `BottomNav`, `Topbar`; Conteúdo, grupo novo: `Prose`) e troque "Todos os componentes da tabela estão na 0.1.0." por uma frase com a versão em que cada grupo entrou (0.1.0 ou 0.2.0).
   - Acrescente `## Ícones`: os 36 ícones de interface vêm do [Lucide](https://lucide.dev) pelo `lucide-react` (licença ISC), sempre decorativos e com tamanho 16, 20 ou 24; um bloco `tsx` com `import { Button, HomeIcon } from '@ishtar-sink/vega';`.
   - Acrescente `## Texto formatado (Prose)`: o `Prose` sai em `@ishtar-sink/vega/prose`, para que quem não usa Markdown não carregue o parser; um bloco `tsx` com `import { Prose } from '@ishtar-sink/vega/prose';` e um `<Prose markdown={texto} size="reading" />`, e uma frase sobre `components` e `remarkPlugins` para extensões do produto (ex.: matemática).
   Mantenha as demais seções. Confira: o comando `readme-pacote.txt` da "Verificação" termina em `OK: ...` depois de um `pnpm build`.
5. Rode `pnpm exec prettier --write CHANGELOG.md README.md package.json` e o bloco da "Verificação" até antes da linha `# evidência: npm-view.txt` (comandos locais). Confira: todos com código 0.
6. **PARE** e peça ao usuário, com o template `question`, os passos manuais (o agente não faz nenhum deles, RN-06, [project/security-04]):
   1. Fazer o commit do trabalho pela skill `approve-commit` e levar a `main` ao GitHub, com a CI verde.
   2. Criar e enviar a tag: `git tag v0.2.0 && git push origin v0.2.0` (o segredo `NPM_TOKEN` do ambiente `npm` já existe desde a 0.1.0).
   3. Acompanhar o workflow "Release" até `success`. Se falhar (FA-02), corrigir pela CI, apagar e recriar a tag (`git push origin :refs/tags/v0.2.0`); nunca `npm publish` local.
   4. Esperar o npm liberar a versão: na 0.1.0, ela ficou alguns minutos em "Validating" antes de responder no `npm view`.
   Confira: o usuário confirma que o workflow "Release" terminou e `npm view @ishtar-sink/vega@0.2.0 version` imprime `0.2.0`.
7. Rode o bloco da "Verificação" inteiro. Confira: código 0, com `npm-view.txt` mostrando a versão 0.2.0 e a provenance.
