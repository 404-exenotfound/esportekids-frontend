import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FASES,
  FASES_SALTO,
  GRAVIDADE_VOO,
  GROUND_Y,
  LINHA_DE_FALTA_X,
  MUNDO_FIM_X,
  GAME_WIDTH,
  PIXEL_POR_METRO,
  PLAYER_H,
  PLAYER_W,
  POTENCIA_INICIAL,
  POTENCIA_POR_TOQUE,
  POTENCIA_QUEDA_POR_SEGUNDO,
  TABUA_LARGURA,
  ZONA_DE_SALTO_PX,
} from "../utils/constantes";

import { dadosIniciais, prepararTentativa } from "../helpers/dadosIniciais";
import { desenharCena } from "../helpers/desenharCena";

const TEMPO_RESULTADO_MS = 4600;
const CORES_FASE = ["#06D6A0", "#4CC9F0", "#FFC93C", "#F77F00", "#EF476F"];

// Salto em Distância: correr no ritmo (potência) -> saltar na tábua sem
// passar da linha (senão é FALTA do juiz) -> esticar as pernas no pouso ->
// juiz mede a distância na caixa de areia de 10 m.
// Errou ou queimou? Tenta de novo na mesma fase, sem punição na tela.
// Ao completar a fase, o progresso avança e o sistema educacional mostra
// a informação daquela fase; ao completar as 5, abre o fim com o quiz.
export function useAtletismo() {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const ultimaPotenciaRef = useRef(-1);
  const ultimoEmZonaRef = useRef(false);

  const [gameState, setGameState] = useState(FASES.START);
  const [progresso, setProgresso] = useState(0); // fases completas (uso interno do sistema educacional)
  const [displaySpeed, setDisplaySpeed] = useState(POTENCIA_INICIAL);
  const [fase, setFase] = useState(1);
  const [etapa, setEtapa] = useState("pronto");
  const [emZonaDeSalto, setEmZonaDeSalto] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [ultimo, setUltimo] = useState(0);
  const [melhor, setMelhor] = useState(0);
  const [vento, setVento] = useState(0);

  const dataRef = useRef(null);
  if (dataRef.current === null) dataRef.current = dadosIniciais();

  const sincronizar = useCallback((d) => {
    setProgresso(d.progresso);
    setFase(d.faseIndex + 1);
    setEtapa(d.etapa);
    setResultado(d.resultado);
    setUltimo(d.ultimoSalto);
    setMelhor(d.melhorDistancia);
    setVento(d.vento);
  }, []);

  const resetGame = useCallback(() => {
    dataRef.current = dadosIniciais();
    ultimaPotenciaRef.current = -1;
    ultimoEmZonaRef.current = false;
    setDisplaySpeed(POTENCIA_INICIAL);
    setEmZonaDeSalto(false);
    sincronizar(dataRef.current);
  }, [sincronizar]);

  const startGame = useCallback(() => {
    resetGame();
    setGameState(FASES.PLAYING);
  }, [resetGame]);

  const voltarParaHome = useCallback(
    () => navigate("/home?menu=jogar"),
    [navigate]
  );

  // ---------- regras do salto ----------
  const dispararFalta = useCallback(
    (d, motivo) => {
      const meta = FASES_SALTO[d.faseIndex].meta;
      d.etapa = "resultado";
      d.etapaTimer = TEMPO_RESULTADO_MS;
      d.bandeiraJuiz = "vermelha";
      d.torcida = "oh";
      d.pose = "triste";
      d.bateuMetaAtual = false;
      d.resultado = {
        falta: true,
        distancia: 0,
        meta,
        bateuMeta: false,
        perfeito: false,
        textoJuiz: motivo,
      };
      sincronizar(d);
    },
    [sincronizar]
  );

  const executarImpulso = useCallback((d) => {
    const cfg = FASES_SALTO[d.faseIndex];
    const peX = d.atletaX + PLAYER_W - 6;
    const distanciaAteLinha = LINHA_DE_FALTA_X - peX;

    if (distanciaAteLinha < 0) {
      dispararFalta(d, "FALTA! Pisou além da linha vermelha da tábua.");
      return;
    }

    d.decolagemX = peX;
    d.qualidadeImpulso =
      distanciaAteLinha <= cfg.zonaPerfeita
        ? "perfeito"
        : distanciaAteLinha <= TABUA_LARGURA
          ? "tabua"
          : "antes";

    const p = d.potencia;
    const bonusPerfeito = d.qualidadeImpulso === "perfeito" ? 26 : 0;
    d.velX = 170 + p * 1.6 + bonusPerfeito;
    d.velY = -(200 + p * 1.05 + (d.qualidadeImpulso === "perfeito" ? 12 : 0));
    d.etapa = "voo";
    d.pose = "voo";
    setEtapa("voo");
  }, [dispararFalta]);

  const pousar = useCallback(
    (d) => {
      const meta = FASES_SALTO[d.faseIndex].meta;
      d.atletaY = GROUND_Y - PLAYER_H;
      d.marcaPousoX = d.atletaX + PLAYER_W - 10;
      const distanciaBruta =
        (d.marcaPousoX - LINHA_DE_FALTA_X) / PIXEL_POR_METRO;
      const distancia = Math.max(
        0,
        Math.round(Math.min(distanciaBruta, 9.98) * 100) / 100
      );
      const bateuMeta = distancia >= meta;

      // A fase terminou NESTE instante: o progresso avança já, para a
      // informação da fase aparecer imediatamente (junto com o resultado
      // do juiz, que agora fica na parte de baixo da arena e não cobre
      // a informação). É esse avanço que liga dicas, informações e quiz.
      d.bateuMetaAtual = bateuMeta;
      if (bateuMeta) d.progresso = d.faseIndex + 1;
      d.ultimoSalto = distancia;
      d.melhorDistancia = Math.max(d.melhorDistancia, distancia);
      d.bandeiraJuiz = "branca";
      d.torcida = bateuMeta ? "festa" : "normal";
      d.pose = bateuMeta ? "comemoracao" : "parado";

      d.etapa = "resultado";
      d.etapaTimer = TEMPO_RESULTADO_MS;
      d.resultado = {
        falta: false,
        distancia,
        meta,
        bateuMeta,
        perfeito: d.qualidadeImpulso === "perfeito",
        textoJuiz: bateuMeta
          ? d.qualidadeImpulso === "perfeito"
            ? "SALTO VÁLIDO! Impulso perfeito na tábua!"
            : "SALTO VÁLIDO! Você passou da meta!"
          : "Salto válido, mas ficou faltando um pouquinho para a meta. Tente de novo!",
      };
      sincronizar(d);
    },
    [sincronizar]
  );

  const avancarAposResultado = useCallback(
    (d) => {
      if (!d.bateuMetaAtual) {
        // Errou? Salta de novo na mesma fase, sem contador na tela.
        prepararTentativa(d);
        sincronizar(d);
        return;
      }
      // Fase completa (progresso já avançou no momento do pouso).
      if (d.faseIndex >= FASES_SALTO.length - 1) {
        sincronizar(d);
        setGameState(FASES.WIN);
        return;
      }
      d.faseIndex += 1;
      prepararTentativa(d);
      sincronizar(d);
    },
    [sincronizar]
  );

  // Ação única do jogo (ESPAÇO ou botão grande na tela).
  const acaoPrincipal = useCallback(() => {
    const d = dataRef.current;
    if (!d) return;

    if (d.etapa === "pronto") {
      d.etapa = "corrida";
      d.pose = "corrida";
      setEtapa("corrida");
      return;
    }

    if (d.etapa === "corrida") {
      const peX = d.atletaX + PLAYER_W - 6;
      const distanciaAteLinha = LINHA_DE_FALTA_X - peX;
      if (distanciaAteLinha <= ZONA_DE_SALTO_PX) {
        executarImpulso(d);
      } else {
        d.potencia = Math.min(100, d.potencia + POTENCIA_POR_TOQUE);
      }
      return;
    }

    if (d.etapa === "voo" && !d.esticouPernas) {
      d.esticouPernas = true;
      d.pose = "pouso";
      const altura = GROUND_Y - (d.atletaY + PLAYER_H);
      // Esticar na hora certa (caindo, pertinho da areia) rende até +0,5 m
      if (d.velY > 0 && altura >= 12 && altura <= 58) d.velX += 70;
      else if (d.velY > 0) d.velX += 30;
      else d.velX += 12;
    }
  }, [executarImpulso]);

  // Teclado: ESPAÇO (e seta para cima como alternativa)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;
      e.preventDefault();
      if (e.repeat) return;
      if (gameState === FASES.PLAYING) acaoPrincipal();
      else startGame();
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameState, acaoPrincipal, startGame]);

  // Loop principal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dtMs = Math.min(time - lastTimeRef.current, 40);
      const dt = dtMs / 1000;
      lastTimeRef.current = time;

      const d = dataRef.current;
      d.tempoTotal += dtMs;
      d.metaAtual = FASES_SALTO[d.faseIndex]?.meta ?? 0;

      if (gameState === FASES.PLAYING) {
        if (d.etapa === "corrida") {
          const cfg = FASES_SALTO[d.faseIndex];
          d.potencia = Math.max(
            0,
            d.potencia - POTENCIA_QUEDA_POR_SEGUNDO * dt
          );
          const velocidade = cfg.velocidadeBase + d.potencia * 1.55;
          d.atletaX += velocidade * dt;
          d.groundOffset += velocidade * dt;
          d.runFrameTimer += dtMs * (0.6 + d.potencia / 60);
          if (d.runFrameTimer > 95) {
            d.runFrameTimer = 0;
            d.runFrame = d.runFrame === 0 ? 1 : 0;
          }

          const peX = d.atletaX + PLAYER_W - 6;
          const emZona = LINHA_DE_FALTA_X - peX <= ZONA_DE_SALTO_PX;
          if (emZona !== ultimoEmZonaRef.current) {
            ultimoEmZonaRef.current = emZona;
            setEmZonaDeSalto(emZona);
          }
          // Passou da tábua sem saltar = queimou a linha = FALTA
          if (peX >= LINHA_DE_FALTA_X) {
            d.atletaX = LINHA_DE_FALTA_X - PLAYER_W + 10;
            dispararFalta(
              d,
              "FALTA! Passou da tábua sem saltar e pisou além da linha."
            );
          }
        } else if (d.etapa === "voo") {
          d.velY += GRAVIDADE_VOO * dt;
          d.atletaX += (d.velX + d.vento * 30) * dt;
          d.atletaY += d.velY * dt;
          d.pose = d.esticouPernas ? "pouso" : "voo";
          d.groundOffset += d.velX * dt;
          if (d.atletaY >= GROUND_Y - PLAYER_H) pousar(d);
        } else if (d.etapa === "resultado") {
          d.etapaTimer -= dtMs;
          if (d.etapaTimer <= 0) avancarAposResultado(d);
        } else {
          // pronto: atleta respirando no lugar
          d.atletaY =
            GROUND_Y - PLAYER_H + Math.round(Math.sin(d.tempoTotal / 320)) * 1;
        }

        // Câmera acompanha o atleta pelo estádio
        const alvoCamera = Math.max(
          0,
          Math.min(d.atletaX - 190, MUNDO_FIM_X - GAME_WIDTH)
        );
        d.cameraX += (alvoCamera - d.cameraX) * Math.min(1, dt * 7 + 0.02);
        if (d.etapa === "pronto") d.cameraX = 0;

        const potenciaInt = Math.round(d.potencia);
        if (potenciaInt !== ultimaPotenciaRef.current) {
          ultimaPotenciaRef.current = potenciaInt;
          setDisplaySpeed(potenciaInt);
        }
      }

      desenharCena(ctx, d);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [gameState, dispararFalta, pousar, avancarAposResultado]);

  const cfgAtual = FASES_SALTO[Math.min(fase - 1, FASES_SALTO.length - 1)];
  const rotulo = `FASE ${fase} DE ${FASES_SALTO.length}`;
  const cor = CORES_FASE[Math.min(fase - 1, CORES_FASE.length - 1)];

  const instrucao =
    etapa === "pronto"
      ? "APERTE ESPAÇO OU TOQUE EM CORRER PARA COMEÇAR!"
      : etapa === "corrida"
        ? emZonaDeSalto
          ? "AGORA! SALTE NA TÁBUA SEM PASSAR DA LINHA VERMELHA!"
          : "TOQUE ESPAÇO SEM PARAR PARA CORRER MAIS RÁPIDO!"
        : etapa === "voo"
          ? "TOQUE PARA ESTICAR AS PERNAS ANTES DE CAIR NA AREIA!"
          : "OLHE O JUIZ: BANDEIRA BRANCA = VÁLIDO, VERMELHA = FALTA!";

  const rotuloBotao =
    etapa === "pronto"
      ? "🏃 CORRER!"
      : etapa === "corrida"
        ? emZonaDeSalto
          ? "👟 SALTAR!"
          : "🏃 CORRER!"
        : etapa === "voo"
          ? "🦵 ESTICAR!"
          : "⏳ JUIZ...";

  return {
    canvasRef,
    gameState,
    progresso,
    rotulo,
    cor,
    startGame,
    voltarParaHome,
    // Salto em Distância
    fase,
    totalFases: FASES_SALTO.length,
    etapa,
    emZonaDeSalto,
    resultado,
    ultimo,
    melhor,
    meta: cfgAtual.meta,
    nomeFase: cfgAtual.nome,
    vento,
    temVento: cfgAtual.temVento,
    potencia: displaySpeed,
    acaoPrincipal,
    instrucao,
    rotuloBotao,
  };
}
