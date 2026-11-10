# TASK-02: Ícones de interface

Arquivo gerado pelo vostok a cada mudança de estado; não edite.

- **Spec:** SPEC-003
- **Status:** done
- **Onda:** 2
- **Dependências:** TASK-01

## Arquivos

- [Execução](execucao.md): o que ler, mudar e os passos.
- [Verificação](verificacao.md): baseline, comandos e evidências.
- [Critérios](criterios.md): quando a tarefa está concluída.
- [Resumo executivo](executivo.md)
- [Detalhes técnicos](tecnico.md)
- [Registro](registro.md): etapas da execução e histórico de ajustes.

## Card

- **Título:** Ícones de interface
- **Tipo:** historia
- **Descrição:** Cria o `Icon` interno sobre o `lucide-react` e os 36 ícones com os nomes da Vega.
- **Critérios de aceite:**
  - [x] Os 36 ícones da primeira leva são exportados com os nomes da Vega, sobre o `lucide-react` (RF-01, CT-01).
  - [x] Todo ícone é decorativo, com `aria-hidden` fixo, traço `currentColor`, tamanho 20 por padrão (16 e 24 por prop) e repassa a `ref` (RF-02, CT-01, CT-02).
  - [x] Os arquivos novos têm até 200 linhas e nenhum ícone tem cor fixa (RNF-08, RN-03).
  - [x] Os ícones são legíveis nos temas claro e escuro, nos três tamanhos (RF-01, RF-02).
- **Rótulos:** SPEC-003, padrao
- **Estimativa:** padrao
- **Bloqueada por:** TASK-01
