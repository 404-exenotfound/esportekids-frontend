import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { SincronizarProgresso } from "../SincronizarProgresso";

function Layout() {
  const { id, token } = useSelector((s) => s.user);

  return (
    <div>
      {/* key: trocar de usuário recomeça a sincronização do zero */}
      {token && <SincronizarProgresso key={id} />}
      <header>
        {/* Meu sistema */}
      </header>

      <main
        style={{
          minHeight: "100svh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Outlet />
      </main>

      <footer>
        {/* Footer */}
      </footer>
    </div>
  );
}

export default Layout;