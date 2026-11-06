import { useState } from "react";
import { useDispatch } from "react-redux";
import { ESPORTES } from "../data/esportes";
import { marcarCuriosidade } from "../../store/progressoSlice";
import { BotaoLeitura } from "./BotaoLeitura";

// "Você sabia?" — mostra uma curiosidade do esporte.
// Componente independente: dá para colocar em qualquer tela, inclusive no banner
// de resultado de um jogo:  <CuriosidadeBanner esporte="basquete" />
export const CuriosidadeBanner = ({ esporte }) => {
  const dados = ESPORTES[esporte];
  const dispatch = useDispatch();
  const total = dados.curiosidades.length;
  const [indice, setIndice] = useState(() => Math.floor(Math.random() * total));

  const mostrar = (i) => {
    setIndice(i);
    dispatch(marcarCuriosidade(`${esporte}-${i}`));
  };

  // A curiosidade só conta como lida quando a criança interage (próxima / "Li esta").
  const proxima = () => mostrar((indice + 1) % total);

  return (
    <div className="edu-card edu-curiosidade">
      <p className="edu-titulo-pixel">💡 VOCÊ SABIA?</p>
      <p className="edu-texto">{dados.curiosidades[indice]}</p>
      <div className="edu-acoes">
        <BotaoLeitura texto={dados.curiosidades[indice]} />
        <button type="button" className="edu-btn" onClick={proxima}>
          Outra curiosidade ({indice + 1}/{total})
        </button>
        <button type="button" className="edu-btn edu-btn-ok" onClick={() => mostrar(indice)}>
          ✔ Li esta
        </button>
      </div>
    </div>
  );
};
