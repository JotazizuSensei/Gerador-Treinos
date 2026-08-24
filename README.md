# BLUE SYMBIOTE v10.0.5

Versão de produção do sistema de aulas BLUE.

## Regra principal

Existe **uma única aplicação** para PC, portátil e telemóvel: a PWA publicada por HTTPS. A mesma instalação recebe atualizações automáticas sem ser necessário reinstalar.

## Atualização automática

A app verifica atualizações sempre que abre, quando volta ao primeiro plano e periodicamente enquanto permanece aberta. Uma nova versão do `service-worker.js` é instalada e ativada automaticamente. Histórico, feedback, preferências, BLUE EDU, filtros e biblioteca visual mantêm-se no mesmo armazenamento.

## AUTO-FRAMES — frames reais dos exercícios

A v10.0.5 adiciona uma camada de imagem baseada em vídeo real:

- botão `AUTO-FRAMES` na aula;
- associação automática entre exercício e fonte extraída através de `sourcePool`;
- seleção automática da fonte quando a aula vem de um vídeo já extraído;
- carregamento local do vídeo fonte uma única vez para captura exata de frames;
- extração automática de 1 frame para movimentos simples e 2 frames para movimentos/transições dinâmicas;
- frames guardados na mesma biblioteca visual IndexedDB já usada pela app;
- reutilização automática desses frames em aulas futuras sempre que o mesmo exercício canónico voltar a aparecer;
- identificação `FRAME VÍDEO` nas imagens capturadas;
- botão `FLASH` por exercício para abrir rapidamente o fluxo de captura;
- miniaturas reais das fontes nas sugestões quando existe ligação à internet;
- o modo aula/scroll passa a beneficiar da mesma biblioteca sem trabalho adicional.

### Limitação técnica intencional

Um browser não pode copiar diretamente pixels de um vídeo YouTube embebido devido às regras de origem/CORS do próprio browser. Por isso a app não finge que consegue obter uma imagem exata diretamente do player remoto. Para captura real do exercício, usa o ficheiro de vídeo no dispositivo; depois de extraídos, os frames ficam guardados e deixam de ser necessários novos carregamentos para esse exercício.

A ordem dos exercícios dos vídeos `EXTRAÍDO` já existe na biblioteca BLUE. A auto-extração distribui os pontos de captura pela sequência da fonte e usa dois pontos em movimentos/transições mais dinâmicos.

## TRAINING LAB

Preset de programação incorporado:

- base permanente: **TRX, barras suspensas, barra + discos, kettlebells e peso corporal**;
- halteres = recurso complementar;
- ordem de decisão: **objetivo da sessão → padrão de movimento → melhor exercício → material mínimo necessário**;
- prioridade a transições rápidas, pouco material espalhado, montagem simples, mínimo tempo morto e várias pessoas em simultâneo;
- material escrito explicitamente pelo treinador prevalece sobre o preset automático.

## Filtros

Os filtros principais são editáveis. O treinador pode escolher sugestões ou escrever novas opções para modalidade, duração, perfil da turma, equipamento, impacto, foco e contexto. A configuração de aulas de grupo não obriga a selecionar patologias individuais.

## Produção atual

Ficheiros runtime principais:

- `index.html` — carregador atómico + auto-update
- `payload-1a.txt`…`payload-4.txt` — aplicação-base compactada/validada
- `patch-10.0.3.js` — filtros livres + equipamento
- `patch-10.0.4.js` — TRAINING LAB
- `patch-10.0.5.js` — AUTO-FRAMES
- `manifest.json`
- `service-worker.js`
- ícones PWA
- `.github/workflows/pages.yml` — validação e deploy

SHA-256 da aplicação-base: `0090f2c7066f9aed2fc9567933851d82d95eaadef02f1cc5dead7aa83da17098`.

O workflow bloqueia o deploy se o pacote-base não reconstruir, o hash não coincidir, faltar algum ficheiro crítico ou qualquer loader/service worker/patch falhar `node --check`.
