## Registro de execução

| # | Data | Etapa | Resultado | Detalhe |
|---|---|---|---|---|
| 1 | 2026-11-10 | início | in_progress | aprovada em 2026-11-10T16:02:42Z; modelo: sonnet |
| 2 | 2026-11-10 | baseline | coletado | 3 comando(s); códigos de saída: 0, 0, 0; 1 evidência(s) automática(s) gravada(s) para comparação |
| 3 | 2026-11-10 | ajuste | in_progress | Cena do print abre só o PeriodField no painel claro e só o DateField no escuro, para um popover não cobrir o outro |
| 4 | 2026-11-10 | evidências antecipadas | geradas | 3 evidências; a conferir: testes-data-hora.txt, datas-outro-fuso.txt, data-hora-temas.png |
| 5 | 2026-11-10 | execução | executed | evidências antecipadas geradas sem erro |
| 6 | 2026-11-10 | conferência | usuário | evidência testes-data-hora.txt conferida pelo usuário (sha256 5632a734) |
| 7 | 2026-11-10 | conferência | usuário | evidência datas-outro-fuso.txt conferida pelo usuário (sha256 62a5bb90) |
| 8 | 2026-11-10 | rejeição | in_progress | evidência data-hora-temas.png rejeitada pelo usuário (sha256 9049ad6e): Título do calendário sai 'Novembro De 2026': text-transform capitalize capitaliza todas as palavras; deve ser só a primeira letra |
| 9 | 2026-11-10 | evidências antecipadas | geradas | 3 evidências; a conferir: data-hora-temas.png |
| 10 | 2026-11-10 | execução | executed | evidências antecipadas geradas sem erro |
| 11 | 2026-11-10 | conferência | usuário | evidência data-hora-temas.png conferida pelo usuário (sha256 c7d6c527) |
| 12 | 2026-11-10 | evidências antecipadas | geradas | 3 evidências; a conferir: - |
| 13 | 2026-11-10 | execução | executed | evidências antecipadas geradas sem erro |
| 14 | 2026-11-10 | testes | passed | Verificação sem falhas; saída em validation/tests.out |
| 15 | 2026-11-10 | regressão | passed | 3 comando(s) iguais ao baseline |
| 16 | 2026-11-10 | evidências | passed | 3 evidência(s) em TASK-06/evidencias/; conferida(s) mantida(s): testes-data-hora.txt, datas-outro-fuso.txt, data-hora-temas.png |
| 17 | 2026-11-10 | conclusão | done | testes, regressão e evidências passed; critérios de conclusão marcados |

## Histórico de ajustes

| # | Data | Origem | Resumo |
|---|---|---|---|
| 1 | 2026-11-10 | agente | Print manual vira (print) automático: build temporário em node_modules e Chromium headless, sem arquivo novo no projeto |
| 2 | 2026-11-10 | agente | Cena do print abre só o PeriodField no painel claro e só o DateField no escuro, para um popover não cobrir o outro |
