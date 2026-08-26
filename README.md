# BLUE SYMBIOTE v10.2.0

Versão de produção do sistema de aulas BLUE.

## Regra principal

Existe **uma única aplicação** para PC, portátil e telemóvel: a PWA publicada por HTTPS. Não existem apps separadas por modalidade nem instalações diferentes para cada dispositivo.

## LOGIN + CONTA BLUE

A v10.2.0 adiciona uma zona de login real, ligada ao projeto Supabase já existente.

- email + palavra-passe;
- recuperação de palavra-passe;
- sessão persistente;
- acesso apenas a membros autorizados do BLUE Symbiote;
- estado visível: `SINCRONIZADO`, `A SINCRONIZAR…`, `OFFLINE` ou `ERRO NUVEM`;
- botão `SAIR` no cabeçalho depois do login.

A aplicação usa uma **publishable key** no browser e Row Level Security (RLS) no Supabase. Os dados privados ficam associados ao utilizador autenticado.

## SINCRONIZAÇÃO ENTRE DISPOSITIVOS

O estado operacional guardado em `localStorage` com namespace `blue_symbiote_` é sincronizado para `public.blue_symbiote_state` no Supabase.

Isto inclui o estado principal da app, histórico, feedback, preferências, BLUE EDU editado, filtros e configurações guardadas que usem esse namespace. Na primeira utilização, se a conta ainda não tiver estado remoto, a app envia o estado local existente; num dispositivo novo, restaura o estado remoto da mesma conta.

A sincronização é feita após alterações, quando a app volta ao primeiro plano e periodicamente. Em caso de falta de internet, uma sessão previamente autorizada pode continuar a trabalhar localmente e sincronizar quando a ligação regressa.

**Nota:** imagens guardadas exclusivamente em IndexedDB continuam locais nesta etapa. Não fingir que esses binários já estão sincronizados; a camada cloud de visuais deve ser implementada separadamente com armazenamento adequado.

## PWA / ATUALIZAÇÃO

O `service-worker.js` voltou a fazer parte da produção. O login autorizado regista o service worker da versão atual, com cache offline dos ficheiros críticos e atualização do runtime pelo mesmo URL.

## FUNCIONALIDADES PRESERVADAS

- filtros livres/editáveis;
- TRAINING LAB;
- componente social/cooperativa;
- AUTO-FRAMES;
- biblioteca visual aprendente;
- referências visuais reais;
- modo aula;
- BLUE EDU;
- histórico, feedback e aprendizagem.

## TRAINING LAB

Base permanente: **TRX, barras suspensas, barra + discos, kettlebells e peso corporal**. Halteres são recurso complementar.

Regra de decisão: **objetivo da sessão → padrão de movimento → melhor exercício → material mínimo necessário**.

## PRODUÇÃO ATUAL

Ficheiros runtime principais:

- `index.html` — único entrypoint da app;
- `payload-1a.txt`…`payload-4.txt` — aplicação-base compactada/validada;
- `patch-10.0.3.js` … `patch-10.1.0.js` — evolução funcional existente;
- `patch-10.2.0-auth.js` — login + autorização + sync de estado + registo PWA;
- `manifest.json`;
- `service-worker.js`;
- `.github/workflows/pages.yml` — validação e deploy.

SHA-256 da aplicação-base: `0090f2c7066f9aed2fc9567933851d82d95eaadef02f1cc5dead7aa83da17098`.

O workflow valida o pacote-base, número de exercícios, versão, presença do login/cloud patch e sintaxe JavaScript antes de publicar.