# BLUE SYMBIOTE v10.0.2

Versão de produção do sistema de aulas BLUE.

## Regra principal

Existe **uma única aplicação** para PC, portátil e telemóvel: a PWA publicada por HTTPS. O utilizador abre sempre o mesmo endereço e instala a mesma app no dispositivo.

## Produção atual

Ficheiros necessários em runtime:

- `index.html` — carregador atómico da app
- `payload-1.txt`
- `payload-2a.txt`, `payload-2b.txt`, `payload-2c.txt`, `payload-2d.txt`
- `payload-3.txt`, `payload-4.txt`
- `manifest.json` — instalação PWA
- `service-worker.js` — offline e atualização
- `icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — ícones
- `.github/workflows/pages.yml` — validação e publicação automática

Os segmentos `payload-*` não são JavaScript executado separadamente. Juntos representam uma única cópia compactada do HTML completo e validado.

## Porque mudou

A versão anterior executava JavaScript dividido por vários ficheiros. Um browser/cache podia receber partes de versões diferentes e provocar erros de sintaxe. A v10.0.2 deixou de executar fragmentos separados. Antes de abrir a aplicação, o carregador reconstrói o pacote completo e confirma o seu SHA-256.

SHA-256 esperado: `0090f2c7066f9aed2fc9567933851d82d95eaadef02f1cc5dead7aa83da17098`.

## Validação antes de publicar

O workflow bloqueia o deploy se:

- faltar algum ficheiro de produção;
- o tamanho de algum segmento não for exatamente o esperado;
- os segmentos não reconstruírem exatamente a mesma aplicação;
- o SHA-256 não coincidir;
- o JavaScript não passar `node --check`;
- não existirem as 397 ocorrências de exercícios esperadas;
- faltar alguma vista/controlo essencial;
- manifest ou cache offline estiverem incoerentes.

## Dados do utilizador

Histórico, feedback, preferências, BLUE EDU e biblioteca visual continuam guardados localmente no browser/PWA. Não é necessário apagar os dados para atualizar a aplicação.

## Versões antigas

Ficheiros antigos de desenvolvimento que ainda existam no repositório não fazem parte do runtime v10.0.2 e só devem ser removidos depois da confirmação da versão publicada.
