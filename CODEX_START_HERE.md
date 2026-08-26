# CODEX START HERE — BLUE SYMBIOTE

## REGRA ABSOLUTA
Trabalhar **neste repositório `JotazizuSensei/Gerador-Treinos`** e evoluir a aplicação existente. **Não criar outra app, outro repo, outro instalador ou protótipo paralelo.** O objetivo é UMA PWA HTTPS para PC/portátil/telemóvel, com o mesmo URL.

A produção atual é **BLUE SYMBIOTE v10.2.0**.

## P0 — LOGIN, PERFIL E SINCRONIZAÇÃO NÃO SÃO OPCIONAIS
O utilizador já tinha definido como requisito obrigatório:
- zona de login;
- perfil/conta;
- mesma conta em PC, portátil e telemóvel;
- alterações sincronizadas entre dispositivos;
- Supabase como camada de autenticação/cloud.

Isto **já não é uma fase futura**. A v10.2.0 introduz `patch-10.2.0-auth.js` e as tabelas Supabase `blue_symbiote_members` e `blue_symbiote_state`, com RLS por utilizador autenticado.

Antes de qualquer trabalho funcional novo, o Codex deve:
1. auditar o login atual;
2. confirmar sessão persistente;
3. confirmar acesso apenas a membros autorizados;
4. confirmar sync do estado operacional entre dois browsers/dispositivos;
5. confirmar comportamento offline após uma sessão previamente autorizada;
6. confirmar que o PWA continua instalável e que o service worker é registado.

**Não remover, contornar ou adiar o login/cloud sync.**

### Estado cloud atual
Sincroniza o namespace `blue_symbiote_` de `localStorage`, incluindo estado principal, histórico, feedback, preferências, BLUE EDU editado e configurações/filtros que usem esse namespace.

Os binários/imagens que estejam exclusivamente em IndexedDB **ainda não devem ser declarados como sincronizados**. Implementar essa camada depois com storage adequado, sem meter centenas de imagens base64 num único estado JSON.

## NÃO PERDER DADOS
Preservar:
- `blue_symbiote_v5_state`;
- IndexedDB `blue_symbiote_state_v9`;
- IndexedDB visual existente;
- biblioteca visual aprendente;
- histórico;
- feedback;
- preferências;
- BLUE EDU editado;
- filtros;
- TRAINING LAB;
- AUTO-FRAMES.

Qualquer migração deve ser incremental, idempotente e com rollback/export.

## O ERRO A EVITAR: YOUTUBE NÃO É A BASE
YouTube é apenas uma fonte. O sistema deve juntar numa única base de conhecimento:
- exercícios canónicos e aliases;
- sequências;
- aulas/sessões de referência;
- métodos de treino/programação;
- regras biomecânicas/pedagógicas;
- fontes e proveniência;
- imagens/frames;
- histórico e aprendizagem das decisões do treinador.

**Fonte != exercício.** Um exercício existe independentemente de ter vindo de vídeo, PDF, formação, aula própria, manual, imagem ou criação interna.

## SEED CANÓNICO A IMPORTAR
Será fornecido ao Codex `BLUE_AULAS_MASTER_LIBRARY_v3.json`.

Conteúdo mínimo a preservar:
- 397 ocorrências de exercícios;
- 348 movimentos canónicos;
- 24 fontes;
- 18 sequências;
- 31 sessões Mix/Functional de referência;
- 7 arquétipos de aula;
- regras, DNA BLUE, métodos e matrizes.

O import deve ser **idempotente**, com `schemaVersion`, deduplicação por `canonicalId`/aliases e preservação de múltiplas fontes por exercício.

## CONTEÚDO PARA ALÉM DOS VÍDEOS
A biblioteca já foi alimentada com material de mobilidade, planos de aula, métodos e formação, incluindo BLUE Mobility/Flow, CEFAD Body & Mind, plano Body & Mind do João, YourFit Mind/Core e notas coreográficas, Mobility Stuff/Stretching, aulas próprias de mobilidade 40/45/50 min, Mix/Functional, TRAINING LAB e materiais visuais.

Conteúdo protegido/licenciado é referência interna: não copiar nem redistribuir texto, imagens, vídeos, PDFs, marcas ou coreografias proprietárias sem licença.

## MODELO DE DADOS ÚNICO
Normalizar entidades: `Exercise`, `Sequence`, `Session`, `Method`, `Source`, `Feedback/Learning`, `Visual`, `History`, `User/Profile`.

`Exercise` deve suportar pelo menos: `id, canonicalId, name, aliases, family, category, objective, phase, position, region, pattern, plane, movementType, mobilityStyle, equipment, level, complexity, setup, execution, priorityCue, observe, commonErrors, regressionIds, progressionIds, alternativeIds, dose, tempo, rest, intensity, sourceRefs, sourceConfidence, status, tags, visualRefs, notes`.

## MOTOR BLUE
Não sortear exercícios. Ordem de decisão:
**objetivo da sessão → padrão de movimento → melhor exercício → material mínimo necessário**.

Considerar segurança, objetivo, perfil geral, padrões, dose, progressão, facilidade de ensino/correção, espaço, material, fluidez e histórico.

Fluidez posicional por defeito:
**em pé → meio-ajoelhado/ajoelhado → quadrupedia → sentado → deitado**, evitando subidas/descidas aleatórias. Flows Primal/Animal-inspired só quebram isto quando a transição é intencional.

No configurador de aula de grupo não colocar patologias individuais como filtros obrigatórios. Perfis gerais: Geral, Iniciantes, Intermédio, Avançado, Sénior/60+, Low Impact, Misto.

## TRAINING LAB
Base permanente: TRX, barras suspensas, barra + discos, kettlebells e peso corporal. Halteres são complemento. Priorizar pouco material espalhado, montagem rápida, mínimo tempo morto e várias pessoas em simultâneo. Material escrito explicitamente pelo treinador prevalece sobre o preset automático.

## BLUE EDU
Cada exercício deve poder mostrar: objetivo, razão contextual na aula, setup, execução, cue prioritário, observação, erros, regressão, progressão, biomecânica, cuidados, alternativas e fonte/confiança.

Dois modos:
- MODO AULA: imagem + nome + tempo/reps + cue;
- MODO TREINADOR/BLUE EDU: detalhe técnico.

## UX
Uma app, com navegação convergente: LOGIN/PERFIL, CRIAR AULA, AULA/INSTRUTOR, BIBLIOTECA, AULAS GUARDADAS, SEQUÊNCIAS, BLUE EDU, DADOS/BACKUP.

No telemóvel, o modo aula deve mostrar exercício atual grande, imagem correta, tempo/reps, cue, próximo, anterior/seguinte, substituir, pausa e scroll opcional.

## BLUE CLASS FIT SCORE
0–12, seis critérios 0–2: objetivo claro; segurança/escalabilidade; fluidez/transições; cobertura sem redundância; facilidade de ensinar/corrigir; progressão/variação vs histórico. Abaixo de 8 não auto-finalizar sem revisão.

## ORDEM DE EXECUÇÃO
1. **P0:** testar login + Supabase + sync + PWA em produção.
2. Auditar runtime/storage/IndexedDB/gerador/biblioteca/patches.
3. Criar Data Core/schema único + import idempotente do seed v3.
4. Unificar exercícios, sequências, sessões, métodos e fontes.
5. Atualizar motor + Fit Score.
6. Unificar Builder, Instructor, Library e BLUE EDU.
7. Implementar sync cloud de visuais/IndexedDB com storage adequado.
8. Testar migração a partir da produção existente.
9. QA mobile/desktop/offline/update e deploy.

## ACEITAÇÃO
Só concluir se:
- existir UMA app;
- **login estiver visível e funcional**;
- **mesma conta funcionar nos vários dispositivos**;
- **estado operacional sincronizar via Supabase**;
- PWA instalar e reabrir;
- seed for integrado sem perdas;
- geração não depender de YouTube;
- filtros livres continuarem;
- não existirem patologias obrigatórias;
- TRAINING LAB, BLUE EDU e AUTO-FRAMES continuarem;
- dados anteriores sobreviverem;
- workflow bloquear deploy com erro;
- houver relatório de migração e QA.
