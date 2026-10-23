# Parte educacional do EsporteKids

## Como funciona (fases)
1. Só o **Basquete** começa liberado. A ordem é: basquete → futebol → atletismo → ping pong → boliche.
2. Durante o jogo, **a cada acerto** (cesta, gol, estrela, ponto) aparece uma **dica** na parte de baixo da tela (5 dicas por jogo). A dica não recebe cliques, então não atrapalha o jogo.
3. No fim do jogo: **revisão das 5 dicas → quiz de 5 perguntas (1 por dica) → resultado**.
4. Acertando **3 de 5**, o próximo jogo é liberado. Se não passar, dá para rever as dicas e tentar o quiz de novo, sem perder nada.
5. Depois, aparece a tela de fim de jogo original, com o aviso de liberação.
6. Jogos bloqueados mostram 🔒 na seleção e também não abrem pela barra de endereço (`/futebol` volta para `/home`).
7. **Modo apresentação:** em `/album`, o botão "Liberar todos os jogos". O botão "Apagar progresso" tranca tudo de novo.

## Onde mexer
- Dicas e perguntas das fases: `src/educacional/fases/dicasFases.js` (também `MINIMO_PARA_LIBERAR` e `ORDEM_JOGOS`)
- Lógica das fases: `src/educacional/fases/` (`useDicasDoJogo`, `FimEducativo`, `JogoProtegido`)
- Conteúdo de /aprender e /album: `src/educacional/data/esportes.js`
- Progresso salvo (localStorage): `src/store/progressoSlice.js`

## Botão de voltar
Todos os jogos têm o botão fixo "⬅ VOLTAR" (canto superior esquerdo) que leva para `/home` a qualquer momento: `src/educacional/components/BotaoVoltar.jsx`.

## O que foi alterado nos jogos
Só o `index.jsx` de cada jogo (4 pontos): incluir `<BotaoVoltar />`, importar, chamar `useDicasDoJogo("<jogo>", <contador de acertos>)` e envolver a tela de fim de jogo com `<FimEducativo>`. Hooks, helpers e componentes dos jogos não foram tocados.
Contadores usados: basquete `cestas`, futebol `placar`, atletismo `stars`, pingpong `pontos`, boliche `pontos`.
