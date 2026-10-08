import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        {/* Meu sistema */}
      </header>

      <main
        style={{
          minHeight: "100vh",
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