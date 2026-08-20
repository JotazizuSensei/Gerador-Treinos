# BLUE SYMBIOTE v10

Versão de produção do sistema de aulas BLUE.

## Fonte oficial

Esta pasta/repositório é a versão atual a manter. Não misturar aqui versões antigas, ficheiros de teste, exports, backups ou imagens pessoais.

## Ficheiros de produção a manter

- `index.html` — entrada da app
- `manifest.json` — instalação PWA
- `service-worker.js` — funcionamento offline e atualizações
- `styles.css` — interface
- `boot.js` — carregador da aplicação
- `ui-1.txt`, `ui-2.txt` — interface principal
- `data-1.txt` … `data-7.txt` — biblioteca compacta de exercícios e referências
- `code-1.txt` … `code-7.txt` — lógica da app
- `icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — ícones
- `.github/workflows/pages.yml` — validação e publicação automática por HTTPS

## O que NÃO deve ficar misturado na pasta principal

Mover para uma pasta local separada, fora do repositório:

- versões `v1` a `v9`
- HTMLs de teste ou protótipos antigos
- ficheiros temporários
- backups JSON exportados pela app
- imagens pessoais adicionadas à biblioteca
- PDFs/vídeos de estudo
- screenshots
- ZIPs de trabalho

Estrutura local recomendada no Ambiente de Trabalho:

```text
BLUE_SYMBIOTE/
├─ Gerador-Treinos/        <- cópia GitHub / produção atual
├─ BACKUPS_APP/            <- backups JSON/HTML exportados pela app
├─ IMAGENS_EXERCICIOS/     <- imagens verificadas a adicionar à app
├─ FONTES_ESTUDO/          <- PDFs, vídeos, screenshots e referências
└─ ARQUIVO_ANTIGO/         <- versões antigas e protótipos
```

## Regra de atualização

1. Trabalhar apenas sobre `Gerador-Treinos` como fonte atual.
2. Cada atualização é validada antes de ser publicada.
3. A app instalada recebe a nova versão através do service worker, sem depender de reinstalação manual.
4. Dados pessoais, histórico, aprendizagem BLUE EDU e imagens continuam locais; fazer `BACKUP COMPLETO` regularmente.

## Estado atual

- versão de produção: **v10**
- biblioteca: **397 ocorrências de exercícios**
- instalação PWA configurada
- modo offline configurado
- BLUE EDU integrado
- biblioteca visual integrada
- histórico e aprendizagem local integrados
- deploy automático por GitHub Pages configurado
