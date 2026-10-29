# Salto em Distância — o que mudou (v7)

Jogo 2D sobre **Salto em Distância**, com a **paisagem e o personagem no padrão do Basquete Campeão**: céu em faixas com dithering, sol, montanhas, prédios com janelas acesas, árvores, arquibancada com torcida animada, mureta com placas coloridas — e o atleta de boné amarelo, camisa vermelha com número branco e shorts azul (matriz de sprite + braços/pernas por pose, igual ao basquete).

## Como jogar (pensado para 7–10 anos)
1. **Correr:** aperte ESPAÇO (ou toque no botão grande) sem parar para encher a POTÊNCIA.
2. **Saltar:** quando aparecer “SALTE AGORA!”, aperte para saltar da tábua branca. Se pisar depois da **linha vermelha**, o juiz levanta a bandeira vermelha: **FALTA** (salto anulado).
3. **Voar e pousar:** no ar, aperte para **esticar as pernas** na hora certa e ganhar distância.
4. **Juiz e medição:** bandeira branca = salto válido. A distância é medida na **caixa de areia de 0 a 10 metros**, até a marca do pouso.

## As 5 fases
| Fase | Nome | Meta |
|---|---|---|
| 1 | Primeiro Salto | 3,00 m |
| 2 | Aquecendo | 4,00 m |
| 3 | Voando Longe | 4,90 m |
| 4 | Vento no Estádio (com vento) | 5,70 m |
| 5 | Grande Final (com vento) | 6,60 m |

- Errou ou queimou a tábua? **Salta de novo na mesma fase** — sem contador de estrelas/tentativas na tela (isso era da corrida e foi removido do placar, da tela final e dos avisos).
- A corrida fica mais rápida, a zona de impulso perfeito diminui e, nas fases 4–5, o vento ajuda ou atrapalha um pouquinho.

## O que NÃO foi alterado (de propósito)
- A integração educacional continua idêntica: `useDicasDoJogo("atletismo", jogo.progresso)`,
  `DicaToast`, `FimEducativo esporte="atletismo"` e `Creditos`.
- **Correção v3 (momento da informação):** o progresso avança **no instante do pouso**
  que completa a fase, e a placa do juiz foi movida para a **parte de baixo** da arena
  para não cobrir a informação. Resultado: bateu a meta → **a informação da fase
  aparece na mesma hora**, junto com o resultado do juiz → ao completar as 5 fases,
  abre o fim educativo com **quiz e créditos**. Não mexa na chave
  `"atletismo"` — é ela que liga o jogo às informações e ao quiz já cadastrados.
- Imports externos, estrutura de pastas, `FASES` (start/playing/gameover/win),
  tela cheia, botão voltar e o áudio de instruções foram preservados.
- O nome da pasta/componente continua `atletismo`/`Atletismo` para não quebrar rotas.

## Arquivos novos principais
- `hooks/useAtletismo.js` — nova máquina do salto (corrida → impulso → voo → juiz).
- `helpers/desenharTorcida.js`, `desenharJuiz.js`, `desenharCaixaDeAreia.js` — ambientação.
- `components/ResultadoSalto.jsx` — placa do juiz com bandeira e distância.
- `components/BotaoAcao.jsx` — botão grande para tablet/celular (mesma ação do ESPAÇO).
- `utils/constantes.js` — `FASES_SALTO` com metas, caixa de 10 m e dificuldades.

- **v3 — pés no chão:** o ciclo de corrida virou 3 tempos (apoio/passagem/apoio) com um pé sempre plantado na linha do chão (y+72) e a sola do tênis terminando exatamente no ponto do pé.

- **v4 — altura e chão:** personagem de volta aos **60 px** originais (sprite do basquete em escala 2,5) e a linha dos pés desceu para a **linha pontilhada no centro da pista** (`GROUND_Y = 344`, pista começa em `TOPO_PISTA = 312`): atleta, tábua branca/linha vermelha, juiz e caixa de areia ficam sobre essa linha.

- **v5 — personagem, botão e tela cheia:** (1) personagem restaurado ao desenho
  original do jogo (grade 10x15, 40x60 px) com poses do salto; (2) botão de ação
  foi para o canto inferior direito da arena e perdeu o textinho duplicado — não
  cobre mais a mensagem "aperte ESPAÇO" do rodapé; (3) `DicaToast` (informações/
  dicas) e o rodapé de instrução foram movidos para DENTRO do `.atl-stage`, que é
  o elemento que entra em tela cheia — fora dele o navegador não exibe esses
  elementos no fullscreen, por isso a informação não aparecia nesse modo.

- **v6 — personagem igual ao basquete:** sprite completo em grade 12x20 com
  escala inteira de 3 px (36x60 px, altura original): boné amarelo, cabelo
  marrom com brilho, camisa vermelha com número branco, shorts azul, meia
  branca e tênis preto — com poses parada/corrida/impulso/voo/pouso/comemoração.

- **v7 — só a pista:** personagem idêntico ao da v6 (nenhum pixel alterado). A linha pontilhada da raia foi alinhada para passar exatamente sob a sola do tênis (termina em `GROUND_Y`), do jeito que estava na v5 — nada de pé flutuando acima da linha.
