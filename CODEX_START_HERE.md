# CODEX START HERE — BLUE SYMBIOTE

## Regra absoluta
Trabalha **neste repositório `JotazizuSensei/Gerador-Treinos`** e evolui a aplicação existente. **Não cries outra app, outro repo, outro instalador ou protótipo paralelo.** O objetivo é UMA PWA HTTPS para PC/portátil/telemóvel, com o mesmo URL e atualizações automáticas.

A produção atual está documentada como **BLUE SYMBIOTE v10.0.5**. Preservar PWA/auto-update, filtros livres, TRAINING LAB, BLUE EDU, biblioteca visual/IndexedDB, AUTO-FRAMES, histórico, feedback e dados existentes.

## O erro a evitar
YouTube **não é a base da app**. É apenas uma fonte.

O sistema deve juntar numa única base de conhecimento:
- exercícios canónicos e aliases;
- sequências;
- aulas/sessões de referência;
- métodos de treino/programação;
- regras biomecânicas/pedagógicas;
- fontes e proveniência;
- imagens/frames;
- histórico e aprendizagem das decisões do treinador.

**Fonte != exercício.** Um exercício existe independentemente de ter vindo de vídeo, PDF, formação, aula própria, manual, imagem ou criação interna.

## Seed canónico a importar
Será fornecido ao Codex o ficheiro `BLUE_AULAS_MASTER_LIBRARY_v3.json`.

Conteúdo mínimo a preservar:
- 397 ocorrências de exercícios;
- 348 movimentos canónicos;
- 24 fontes;
- 18 sequências;
- 31 sessões Mix/Functional de referência;
- 7 arquétipos de aula;
- regras, DNA BLUE, métodos e matrizes.

O import deve ser **idempotente**, com `schemaVersion`, deduplicação por `canonicalId`/aliases e preservação de múltiplas fontes por exercício.

## Conteúdo para além dos vídeos
A biblioteca já foi alimentada com material de mobilidade, planos de aula, métodos e formação, incluindo: BLUE Mobility/Flow handoff, CEFAD Body & Mind, plano Body & Mind do João, YourFit Mind/Core e notas coreográficas, Mobility Stuff/Stretching (365 routines, assessment, cueing, props, STRETCH volumes), aulas próprias de mobilidade 40/45/50 min, Mix/Functional, TRAINING LAB, materiais visuais e conteúdos técnicos BLUE.

Conteúdo protegido/licenciado é referência interna: não copiar nem redistribuir texto, imagens, vídeos, PDFs, marcas ou coreografias proprietárias sem licença.

## Modelo de dados único
Normalizar entidades: `Exercise`, `Sequence`, `Session`, `Method`, `Source`, `Feedback/Learning`, `Visual`, `History`.

Exercise deve suportar pelo menos: `id, canonicalId, name, aliases, family, category, objective, phase, position, region, pattern, plane, movementType, mobilityStyle, equipment, level, complexity, setup, execution, priorityCue, observe, commonErrors, regressionIds, progressionIds, alternativeIds, dose, tempo, rest, intensity, sourceRefs, sourceConfidence, status, tags, visualRefs, notes`.

## Motor BLUE
Não sortear exercícios. Ordem de decisão:
**objetivo da sessão → padrão de movimento → melhor exercício → material mínimo necessário**.

Considerar segurança, objetivo, perfil geral, padrões, dose, progressão, ensinabilidade, espaço, material, fluidez e histórico.

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
Uma app, com navegação convergente: CRIAR AULA, AULA/INSTRUTOR, BIBLIOTECA, AULAS GUARDADAS, SEQUÊNCIAS, BLUE EDU, DADOS/BACKUP. Fontes/criadores ficam nos bastidores, não como navegação principal.

No telemóvel, o modo aula deve mostrar exercício atual grande, imagem correta, tempo/reps, cue, próximo, anterior/seguinte, substituir, pausa e scroll opcional.

## BLUE Class Fit Score
0–12, seis critérios 0–2: objetivo claro; segurança/escalabilidade; fluidez/transições; cobertura sem redundância; facilidade de ensinar/corrigir; progressão/variação vs histórico. Abaixo de 8 não auto-finalizar sem revisão.

## Migração sem perda
Não apagar/renomear cegamente storage keys. Preservar localStorage, IndexedDB visual, histórico, feedback, filtros, BLUE EDU editado e AUTO-FRAMES. Fazer backup/export, introduzir schemaVersion, migrar incrementalmente e manter rollback. Modularizar gradualmente o payload atual; não reescrever tudo de raiz sem necessidade.

## Aprendizagem
Guardar substituições, remoções, reordenações, tempos alterados, material escolhido, fonte aceite/rejeitada, aula usada e avaliação pós-aula. Usar isso para ranking futuro sem adulterar dados canónicos.

Não fingir cloud sync. Se for implementado mais tarde, será camada adicional com autenticação/migração clara.

## Ordem de execução
1. Auditar runtime atual + storage/IndexedDB + gerador + biblioteca + patches.
2. Criar Data Core/schema único + import idempotente do seed v3.
3. Unificar biblioteca de exercícios, sequências, sessões, métodos e fontes.
4. Atualizar motor de ranking/geração + Fit Score.
5. Unificar Builder, Instructor, Library e BLUE EDU na app atual.
6. Testar migração a partir da produção existente.
7. QA PWA, offline, auto-update, mobile/desktop e deploy.

## Aceitação
Só concluir se existir UMA app; seed sem perdas; geração não depender de YouTube; filtros livres; sem patologias obrigatórias; TRAINING LAB/BLUE EDU/AUTO-FRAMES preservados; dados anteriores sobrevivem; PWA instala e atualiza; workflow bloqueia deploy com erro; entregar relatório de migração e QA.
