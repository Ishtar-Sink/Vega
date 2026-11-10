# Segurança

Define as proteções de uma biblioteca aberta, usada por produtos de terceiros.

[project/security-01]: O pacote não envia telemetria nem faz requisição de rede.
[project/security-02]: A CI roda `pnpm audit` sem vulnerabilidade alta ou crítica.
[project/security-03]: Nenhum `dangerouslySetInnerHTML` com conteúdo vindo de prop.
[project/security-04]: Publicação no npm com provenance, feita pela CI e nunca de uma máquina local.
