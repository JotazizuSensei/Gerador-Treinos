# HANDOFF — BLUECORE × BLUE SYMBIOTE / GERADOR DE TREINOS
**Data:** 12/10/2026  
**Objetivo:** confirmar, completar e validar a ligação entre o motor de prescrição individual BLUECORE e a base de conhecimento/exercícios do BLUE Symbiote, mantendo os dois produtos funcionalmente distintos.

---

## 1. REGRA ABSOLUTA DE ARQUITETURA

### BLUECORE
É o **motor de prescrição individual**.
Recebe uma pessoa concreta, com dados concretos, avaliações concretas, objetivos concretos, limitações concretas e contexto real, e gera uma proposta individualizada de treino.

### BLUE SYMBIOTE / GERADOR DE TREINOS
É o **motor de aulas/sessões de grupo e laboratório de exercícios**, atualmente no repositório:
`JotazizuSensei/Gerador-Treinos`

Produção atual observada: **BLUE Symbiote v10.2.0**.

### Regra de integração
Os dois sistemas podem e devem **partilhar a mesma linguagem técnica, biblioteca de exercícios, nomenclatura, relações progressão/regressão e conhecimento biomecânico/evidência**, mas **não devem usar o mesmo algoritmo de decisão**.

- BLUECORE decide para **uma pessoa**.
- BLUE Symbiote decide para **uma aula/sessão de grupo**.
- Não criar uma terceira aplicação paralela.
- Não substituir o BLUECORE pelo Symbiote.
- Não fazer o BLUECORE “chamar o gerador de aulas” para prescrever um cliente.

---

## 2. ESTADO TÉCNICO CONFIRMADO NESTE HANDOFF

### Repositório BLUE Symbiote
- Repo: `JotazizuSensei/Gerador-Treinos`
- Branch: `main`
- Commit observado antes deste handoff: `4c3bd6ac9a986dbd73043778f709a6647a856ccb`
- `index.html` identifica produção **v10.2.0**.
- O workflow de produção valida **397 exercícios** no pacote-base.
- O projeto contém biblioteca, BLUE EDU, filtros, histórico, feedback, imagens, login/cloud sync e PWA.

### Repositório BLUECORE
- Repo: `JotazizuSensei/blueon-app`
- Base ativa a preservar: `blue-core/index.html`
- Branch: `main`
- Commit observado: `a4bfc5e433f19ddb1c8d06ace68247c4ab87e8d8`
- `blue-core/index.html` carrega o runtime através da Edge Function `blue-core-app/app.js`.

### Supabase BLUECORE
Projeto observado: ativo e saudável.
A Edge Function `blue-core-app` encontra-se **ACTIVE, versão 3** e serve o asset `app.staging.js` a partir de `blue_core_assets`.

Existem também funções auxiliares de QA já implementadas, incluindo:
- `blue-core-stage-check`
- `blue-core-debug-source`
- `blue-core-qa-user`

O `blue-core-stage-check` foi desenhado para validar no `app.staging.js`:
- versão `13.7.0`;
- função `completeTrainingSession`;
- suporte de menor `guardianConsent`;
- proteção de backup (`backupSafe`).

### O que NÃO está confirmado
Não foi obtida nesta sessão uma prova suficiente de que o BLUECORE esteja atualmente a consumir a biblioteca/taxonomia do BLUE Symbiote de forma automática.

**Logo: não declarar os sistemas “interligados” até os testes deste documento passarem.**

---

# 3. OBJETIVO FUNCIONAL DO BLUECORE

O fluxo correto é:

**CLIENTE → DADOS → ANÁLISE → PRIORIDADES → FILTRO DE SEGURANÇA → PADRÕES → EXERCÍCIOS ELEGÍVEIS → DOSE → DISTRIBUIÇÃO A/B/C → AUDITORIA → VALIDAÇÃO HUMANA → PLANO**

O sistema nunca deve começar por um template anterior.

> Cada cliente deve ser reconstruído a partir dos próprios dados.

Dois clientes podem receber o mesmo exercício se esse exercício for adequado aos dois. Isso não é cópia. O erro é partir do plano anterior e trocar apenas alguns exercícios.

---

# 4. DADOS DE ENTRADA OBRIGATÓRIOS / DESEJÁVEIS

## 4.1 Identificação e contexto
- clientId estável;
- idade;
- sexo quando relevante à prescrição;
- altura;
- peso;
- profissão/atividade diária;
- experiência de treino;
- nível técnico;
- modalidade desportiva;
- rotina semanal;
- dias e tempo disponíveis;
- equipamento disponível;
- preferências e aversões.

## 4.2 Objetivos
Permitir objetivo principal + secundários, por exemplo:
- força;
- hipertrofia;
- potência;
- resistência muscular;
- condição cardiorrespiratória;
- perda de gordura;
- recomposição corporal;
- saúde;
- performance desportiva;
- robustez/prevenção;
- retorno ao treino;
- preparação para prova/teste;
- aprendizagem técnica;
- autonomia funcional;
- equilíbrio/coordenação;
- mobilidade quando efetivamente indicada.

## 4.3 Avaliações
Guardar séries temporais, não apenas o último valor:
- peso;
- IMC;
- % gordura;
- massa magra/muscular;
- gordura visceral;
- água corporal;
- perímetros;
- FC de repouso;
- PA;
- hand grip;
- testes de força;
- testes de potência;
- testes funcionais;
- equilíbrio;
- mobilidade;
- capacidade aeróbia;
- assimetrias quando medidas;
- observações técnicas.

O motor deve saber qual é a **avaliação mais recente válida** e comparar tendência sem confundir questionário antigo com avaliação atual.

## 4.4 Saúde e limitações
- PAR-Q / triagem;
- patologias conhecidas;
- lesões;
- cirurgias;
- dor atual;
- sintomas;
- fisioterapia;
- restrições médicas;
- medicação relevante;
- oncologia;
- risco/linfedema;
- coluna;
- joelho;
- ombro;
- gravidez/pós-parto;
- diabetes;
- hipertensão;
- osteoporose;
- outras condições.

O sistema **não diagnostica**.
Quando faltam dados clínicos decisivos, deve sinalizar “necessita esclarecimento” em vez de inventar.

## 4.5 Carga externa e recuperação
- treinos de equipa;
- corrida;
- jogos;
- aulas de grupo;
- trabalho físico;
- passos/atividade quando disponível;
- sono;
- fadiga;
- dor;
- RPE recente;
- stress;
- recuperação.

A prescrição deve considerar o que a pessoa já faz fora do ginásio.

---

# 5. HIERARQUIA DE DECISÃO DO BLUECORE

Executar sempre nesta ordem:

1. **Segurança**
2. **História / limitações / contexto clínico**
3. **Estado atual e avaliação mais recente**
4. **Carga externa e capacidade de recuperação**
5. **Objetivo principal e secundários**
6. **Padrões de movimento necessários**
7. **Biomecânica / linha de força / torque / braço de momento**
8. **Perfil de resistência**
9. **Adequação do equipamento/máquina à pessoa**
10. **Complexidade, estabilidade e competência técnica**
11. **Seleção de exercício**
12. **Ordem da sessão**
13. **Dose: séries, reps, carga, RPE/RIR, cadência, descanso**
14. **Volume e frequência semanal**
15. **Progressão/regressão**
16. **Auditoria das sessões em conjunto**
17. **Validação humana**
18. **Feedback e reprogramação**

---

# 6. REGRAS DE SELEÇÃO E ORDEM

## Regra-base
Na ausência de uma razão específica em contrário:

**preparação relevante → potência/skill quando necessário → poliarticular/global prioritário → poliarticular secundário → unilateral/funcional → monoarticular/acessório → core/complementar**

Regras:
- grandes/globais antes de pequenos/isolações;
- poliarticulares antes de monoarticulares;
- estáveis/simples antes de instáveis/complexos em iniciantes e populações limitadas;
- exercícios prioritários para o objetivo devem surgir suficientemente cedo;
- potência/velocidade/técnica podem preceder força quando forem prioridade;
- reabilitação/segurança pode justificar exceções;
- qualquer exceção deve possuir motivo registável.

### Mobilidade e ativação
Não adicionar exercícios “porque costumam aparecer no aquecimento”.
Só entram se:
- avaliação indicar necessidade;
- prepararem diretamente exercício seguinte;
- reduzirem uma limitação relevante;
- forem parte deliberada do objetivo.

---

# 7. REGRAS A/B/C E ANTI-TEMPLATE

Serviço base: **máximo 3 sessões estruturadas A/B/C por semana**, salvo upgrade/serviço diferente.

Ao gerar A/B/C, auditar as três sessões como um único microciclo.

Perguntas automáticas:
- Há exercício repetido em duas ou mais sessões?
- A repetição tem justificação?
- Há padrões redundantes?
- Há grupo/padrão importante ausente?
- Existe excesso de fadiga local?
- Existe conflito com desporto/jogo/trabalho?
- O volume semanal é coerente?
- A ordem respeita a prioridade?
- Existem duas variantes quase iguais sem valor adicional?

Se um exercício se repetir, guardar o motivo:
- aprendizagem técnica;
- especificidade;
- frequência deliberada;
- melhor opção segura;
- progressão planeada;
- alternativas inferiores.

Sem motivo: procurar variante complementar coerente.

---

# 8. BLUE EXERCISE LIBRARY — CONTRATO PARTILHADO

O BLUECORE deve usar uma biblioteca estruturada e não escolher exercícios apenas por correspondência textual.

Cada exercício deve possuir, quando aplicável:
- `exerciseId` estável;
- nome PT-PT;
- nome EN;
- aliases/sinónimos;
- família;
- padrão;
- dominância;
- plano/eixo;
- cadeia cinética;
- articulações;
- músculos principais;
- sinergistas/estabilizadores;
- equipamento;
- bilateral/unilateral;
- estabilidade;
- complexidade técnica;
- impacto;
- carga axial;
- exigência de mobilidade;
- posição corporal;
- direção da resistência;
- linha de força;
- perfil de resistência;
- curva de dificuldade quando conhecida;
- objetivo(s);
- população adequada;
- contraindicações/precauções;
- amplitude regressável;
- execução;
- cues;
- erros frequentes;
- correções;
- regressões;
- progressões;
- alternativas equivalentes;
- séries/reps/tempo típicos por objetivo;
- imagens/vídeos;
- fonte/evidência;
- data de revisão;
- nível de confiança.

### Nomenclatura
Usar nome corrente em PT-PT e, quando útil, o original entre parênteses.
Evitar nomes inventados e duplicados sem necessidade.

---

# 9. REGISTO DE EVIDÊNCIA

Separar biblioteca de exercícios de regras científicas.

Criar/usar uma camada de `evidence_registry` com:
- `evidenceId`;
- tema;
- população;
- objetivo;
- regra suportada;
- tipo de fonte;
- organização/revista;
- PMID/DOI/URL quando aplicável;
- ano;
- força/confiança;
- data de revisão;
- notas/limitações.

Fontes prioritárias conforme o tema:
- ACSM;
- NSCA;
- IOC;
- WHO;
- guidelines clínicas relevantes;
- consensos profissionais;
- revisões sistemáticas/meta-análises;
- PubMed para literatura primária e revisão.

A evidência não deve ser usada como “receita automática”. Deve informar limites e intervalos de decisão.

---

# 10. POPULAÇÕES E MÓDULOS ESPECÍFICOS

Criar regras/filtros próprios, sem diagnosticar, para:
- crianças;
- adolescentes;
- adultos;
- séniores;
- iniciantes;
- atletas;
- retorno após pausa;
- obesidade/perda ponderal;
- terapêutica GLP-1/GIP;
- hipertensão;
- diabetes;
- osteoporose;
- oncologia;
- risco/linfedema;
- gravidez/pós-parto;
- coluna;
- joelho;
- ombro;
- lesão em acompanhamento;
- dor ativa.

Os módulos devem filtrar e priorizar; não criar diagnósticos.

---

# 11. SAÍDA DO GERADOR INDIVIDUAL

Ao clicar **GERAR PROPOSTA DE PLANO**, mostrar:

## Análise do cliente
- avaliação usada;
- objetivos;
- condicionantes;
- dados em falta;
- principais prioridades;
- carga externa;
- semáforo/alertas.

## Plano A/B/C
Cada exercício:
- exercício;
- séries;
- repetições;
- carga orientativa ou campo de carga;
- RPE/RIR;
- descanso;
- cadência;
- amplitude/adaptação;
- notas/cues;
- motivo de seleção.

## Justificação
Possibilidade de abrir “Porquê este exercício?”.

## Exercícios rejeitados / bloqueados
Mostrar os principais quando relevante e o motivo.

## Auditoria semanal
- padrões;
- volume;
- repetições deliberadas;
- fadiga;
- interferência com outras atividades;
- flags.

---

# 12. INTERATIVIDADE OBRIGATÓRIA DO BLUECORE

Confirmar que funciona de ponta a ponta:

1. selecionar cliente;
2. criar/editar anamnese;
3. adicionar nova avaliação;
4. preservar avaliações antigas;
5. reconhecer automaticamente a mais recente;
6. definir objetivos;
7. indicar dias/tempo/equipamento;
8. registar limitações;
9. gerar plano A/B/C;
10. editar manualmente exercícios/dose;
11. substituir exercício por variante coerente;
12. guardar plano;
13. fechar/reabrir sem perder alterações;
14. executar sessão;
15. registar carga/reps/RPE/dor/notas;
16. concluir sessão;
17. histórico atualizar;
18. feedback influenciar próxima prescrição;
19. funcionar PC/telemóvel com a mesma conta;
20. sincronizar cloud sem misturar clientes.

---

# 13. LIGAÇÃO BLUECORE ↔ SYMBIOTE — IMPLEMENTAÇÃO RECOMENDADA

Não ligar aplicações por DOM, scraping, iframe ou cópia manual de HTML.

Criar um **contrato de dados partilhado**, por exemplo:

- `blue_exercise_library`
- `blue_exercise_relations`
- `blue_training_rules`
- `blue_evidence_registry`

ou assets JSON versionados equivalentes, caso seja preferível nesta fase.

Ambas as apps leem a mesma base técnica.

### BLUECORE consome
- exercícios;
- nomenclatura;
- biomecânica;
- progressões/regressões;
- precauções;
- evidência;
- relações entre exercícios.

### BLUE Symbiote consome
A mesma base, mas aplica lógica de aulas/grupo, sequência/flow, duração e equipamento.

### Não partilhar automaticamente
- algoritmo de prescrição individual;
- algoritmo de montagem de aulas;
- dados privados de clientes;
- histórico de um cliente com a app de aulas.

---

# 14. TESTES DE ACEITAÇÃO DA INDIVIDUALIZAÇÃO

Criar pelo menos estes casos de QA anónimos:

### Caso 1 — adolescente atleta
- futebol;
- carga semanal alta;
- limitações músculo-esqueléticas;
- objetivo força/robustez;
- duas sessões complementares.

**Resultado esperado:** programa subordinado ao microciclo desportivo, sem copiar aquecimentos/mobilidade sem justificação e sem fadiga desnecessária pré-jogo.

### Caso 2 — adulta em perda ponderal farmacológica
- retorno após pausa;
- necessidade de preservar massa magra;
- limitação de membro superior pós-tratamento de saúde;
- 3 sessões.

**Resultado esperado:** treino de força prioritário; upper adaptado; não gerar overhead/press apenas por template; dados clínicos em falta sinalizados.

### Caso 3 — adulto saudável com objetivo diferente
- sem limitações significativas;
- objetivo força/hipertrofia;
- 3 sessões.

**Resultado esperado:** plano substancialmente diferente dos casos anteriores, com dose e seleção coerentes com objetivo e experiência.

### Teste anti-cópia
Comparar os três planos.
Falha se partilharem o mesmo esqueleto de aquecimento + principais + core sem justificação fisiológica/programática.

---

# 15. QA TÉCNICO BLUECORE

Antes de declarar “FUNCIONA / INTERLIGADO / INTERATIVO”, confirmar:

## Runtime
- `blue-core/index.html` abre;
- login funciona;
- `blue-core-app/app.js` responde;
- JS sem erro de sintaxe;
- versão correta;
- PWA/service worker funcional.

## Dados
- leitura/escrita cloud;
- cliente A nunca recebe dados de B;
- backup/export não muda `activeClientId` indevidamente;
- refresh não perde dados;
- edição concorrente não destrói estado.

## Treino
- gerar A/B/C;
- editar;
- guardar;
- concluir sessão;
- feedback persistir;
- nova prescrição consultar histórico.

## Biblioteca partilhada
- selecionar um `exerciseId` conhecido no BLUECORE;
- confirmar mesmo nome/metadata na fonte partilhada;
- alterar versão de biblioteca em ambiente de teste;
- confirmar que ambos os consumidores reconhecem a nova versão sem duplicar IDs.

## Menores
- confirmar `guardianConsent` e regras de segurança previstas pelo BLUECORE.

---

# 16. CRITÉRIO DE “INTERLIGADO”

Só considerar interligado quando:

1. BLUECORE e Symbiote usam uma fonte técnica comum versionada;
2. IDs dos exercícios são estáveis;
3. nomenclatura é igual nos dois sistemas;
4. progressões/regressões são partilhadas;
5. alterações da biblioteca têm mecanismo de versão/migração;
6. dados privados permanecem exclusivos do BLUECORE;
7. ambos continuam a funcionar independentemente;
8. testes automáticos/QA confirmam integridade.

---

# 17. CRITÉRIO DE “INTERATIVO”

O BLUECORE não é interativo apenas porque tem campos editáveis.
É interativo quando a informação introduzida **muda efetivamente a decisão**.

Exemplos obrigatórios:
- alterar objetivo → altera seleção/dose;
- adicionar dor/limitação → filtra/regride exercícios;
- mudar 3 para 2 dias → redistribui volume;
- acrescentar treino de equipa → adapta fadiga;
- nova avaliação → atualiza prioridades;
- exercício não tolerado → escolhe alternativa coerente;
- feedback de RPE/dor → altera progressão seguinte.

---

# 18. HUMAN-IN-THE-LOOP

O BLUECORE gera **proposta**, não decisão clínica autónoma.

Fluxo:

**motor propõe → treinador revê → treinador valida → plano é publicado → execução gera feedback → motor reavalia**

Casos clínicos complexos devem poder ficar com estado:
`NECESSITA VALIDAÇÃO / DADOS EM FALTA`.

---

# 19. PRIORIDADE DE IMPLEMENTAÇÃO

### P0 — Não quebrar o atual
- preservar `blue-core/index.html`;
- preservar login/cloud;
- preservar IDs/clientes/histórico;
- backup antes de migração.

### P1 — Auditar runtime atual
Executar os testes da secção 15.

### P2 — Criar camada comum de biblioteca
Importar/normalizar a BLUE Exercise Library com IDs estáveis.

### P3 — Motor de prescrição individual
Implementar a hierarquia das secções 4–7.

### P4 — Evidência e população
Adicionar regras versionadas e `evidence_registry`.

### P5 — Explicabilidade
“Porquê este exercício?”, bloqueios e auditoria A/B/C.

### P6 — Feedback adaptativo
Usar histórico real de execução para reprogramar.

---

# 20. REGRA FINAL PARA QUEM PEGAR NESTE HANDOFF

**Não criar outra app. Não apagar a app existente. Não começar por redesenhar UI.**

Primeiro:
1. abrir o BLUECORE atual;
2. confirmar runtime e dados;
3. mapear gerador atual;
4. confirmar se já existe integração real;
5. criar a camada comum em falta;
6. testar individualização com casos anónimos;
7. só depois melhorar UX.

Resultado final pretendido:

> O treinador escolhe um cliente específico, com informação específica e individualizada. O BLUECORE interpreta essa informação, usa a biblioteca/evidência BLUE, gera uma proposta A/B/C coerente com objetivo, avaliações, saúde, carga externa e experiência, explica as decisões, permite edição humana e aprende com a execução — sem reutilizar automaticamente o plano de outro cliente.
