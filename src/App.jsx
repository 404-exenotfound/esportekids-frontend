import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

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
          {Object.entries(pages).map(([path, Component]) => (
            <Route
              key={path}
              path={getRoute(path)}
              element={<Component />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
