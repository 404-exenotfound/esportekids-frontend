import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { RotaPrivada, RotaPublica } from "./components/RotaPrivada";
import { ORDEM_JOGOS } from "./educacional/fases/dicasFases";
import { JogoProtegido } from "./educacional/fases/JogoProtegido";

const pages = import.meta.glob("./pages/**/index.jsx", {
  eager: true,
  import: "default",
});

// Únicas telas que abrem sem login
const ROTAS_PUBLICAS = ["/login", "/registro"];

function getRoute(path) {
  return path
    .replace("./pages", "")
    .replace("/index.jsx", "")
    .toLowerCase() || "/";
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          {Object.entries(pages).map(([path, Component]) => {
            const rota = getRoute(path);
            const id = rota.slice(1);

            if (ROTAS_PUBLICAS.includes(rota)) {
              return <Route key={path} path={rota} element={<RotaPublica><Component /></RotaPublica>} />;
            }

            // Jogos ainda não liberados não abrem (nem pela barra de endereço)
            const element = ORDEM_JOGOS.includes(id) ? (
              <JogoProtegido jogo={id}>
                <Component />
              </JogoProtegido>
            ) : (
              <Component />
            );
            // Fora login/registro, tudo exige estar logado
            return <Route key={path} path={rota} element={<RotaPrivada>{element}</RotaPrivada>} />;
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
