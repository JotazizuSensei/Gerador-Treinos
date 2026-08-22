# BLUE SYMBIOTE v10.0.4

Versão de produção do sistema de aulas BLUE.

## Regra principal

Existe **uma única aplicação** para PC, portátil e telemóvel: a PWA publicada por HTTPS. O utilizador abre sempre o mesmo endereço e instala a mesma app no dispositivo.

## Atualização automática

A partir da v10.0.4, a app verifica atualizações **sempre que abre**. Se existir uma nova versão do `service-worker.js`, instala-a, ativa-a e recarrega a app automaticamente. Também volta a verificar quando regressa ao primeiro plano após alguns minutos e faz verificações periódicas enquanto permanece aberta.

Os dados do utilizador não são apagados durante a atualização: histórico, feedback, preferências, BLUE EDU e biblioteca visual continuam no mesmo armazenamento do browser/PWA.

## TRAINING LAB

Preset de programação incorporado:

- base permanente: **TRX, barras suspensas, barra + discos, kettlebells e peso corporal**;
- halteres = recurso complementar, não material-base;
- ordem de decisão: **objetivo da sessão → padrão de movimento → melhor exercício → material mínimo necessário**;
- prioridade a transições rápidas, pouco material espalhado, montagem/desmontagem simples, mínimo tempo morto e possibilidade de várias pessoas trabalharem ao mesmo tempo;
- quando o material é escrito explicitamente pelo treinador (por exemplo `elásticos`, `barra`, `TRX`), essa indicação prevalece sobre o preset automático.

## Filtros

Os filtros principais são editáveis. O treinador pode escolher uma sugestão ou escrever uma opção nova para modalidade, duração, perfil da turma, material/equipamento, impacto, foco e contexto geral da aula.

A configuração de aulas de grupo não obriga a selecionar patologias ou limitações individuais; essas adaptações permanecem decisão do treinador durante a aula.

## Produção atual

Ficheiros necessários em runtime:

- `index.html` — carregador atómico + verificação automática de atualização
- `payload-1a.txt`, `payload-1b.txt`, `payload-1c.txt`, `payload-1d.txt`
- `payload-2a.txt`, `payload-2b.txt`, `payload-2c.txt`, `payload-2d.txt`
- `payload-3.txt`, `payload-4.txt`
- `patch-10.0.3.js` — filtros livres e interpretação de equipamento
- `patch-10.0.4.js` — preset/logística TRAINING LAB
- `manifest.json` — instalação PWA
- `service-worker.js` — offline e atualização automática
- `icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — ícones
- `.github/workflows/pages.yml` — validação e publicação automática

Os segmentos `payload-*` não são JavaScript executado separadamente. Juntos representam uma única cópia compactada do HTML completo e validado.

SHA-256 esperado do pacote-base: `0090f2c7066f9aed2fc9567933851d82d95eaadef02f1cc5dead7aa83da17098`.

## Validação antes de publicar

O workflow bloqueia o deploy se faltar um ficheiro de produção, se o pacote não reconstruir exatamente a aplicação-base, se o SHA-256 não coincidir, se o JavaScript principal/loader/service worker/patches não passar `node --check`, se não existirem as 397 ocorrências de exercícios esperadas ou se manifest/cache offline estiverem incoerentes.

## Dados do utilizador

Histórico, feedback, preferências, BLUE EDU e biblioteca visual continuam guardados localmente no mesmo domínio/PWA. **Não é necessário reinstalar nem apagar dados para receber atualizações.**
