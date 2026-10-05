import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ORDEM_JOGOS } from "./educacional/fases/dicasFases";
import { JogoProtegido } from "./educacional/fases/JogoProtegido";

const pages = import.meta.glob("./pages/**/index.jsx", {
  eager: true,
  import: "default",
});

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
          {Object.entries(pages).map(([path, Component]) => {
            const rota = getRoute(path);
            const id = rota.slice(1);
            // Jogos ainda não liberados não abrem (nem pela barra de endereço)
            const element = ORDEM_JOGOS.includes(id) ? (
              <JogoProtegido jogo={id}>
                <Component />
              </JogoProtegido>
            ) : (
              <Component />
            );
            return <Route key={path} path={rota} element={element} />;
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
