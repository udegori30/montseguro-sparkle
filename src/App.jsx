import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardDataProvider } from "./context/DashboardDataContext.jsx";
import { ConsultantPhotosProvider } from "./context/ConsultantPhotosContext.jsx";
import { DashboardLayout } from "./components/layout/DashboardLayout.jsx";
import { DEFAULT_TAB_ID } from "./theme/tabThemes.js";

// Quando o build e servido a partir de um subcaminho (ex.: GitHub Pages em
// /montseguro-sparkle/), o basename precisa refletir isso - senao qualquer
// navegacao com caminho absoluto (redirect da raiz, TabNav, carrossel) sai
// do subcaminho e quebra. Em dev, BASE_URL e "/" e isso vira um no-op.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

// A aba ativa vive na URL (/:tabId), permitindo navegacao client-side tanto
// pelo carrossel automatico quanto por clique manual no TabNav.
export default function App() {
  return (
    <ConsultantPhotosProvider>
      <DashboardDataProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Navigate to={`/${DEFAULT_TAB_ID}`} replace />} />
            <Route path="/:tabId" element={<DashboardLayout />} />
            <Route path="*" element={<Navigate to={`/${DEFAULT_TAB_ID}`} replace />} />
          </Routes>
        </BrowserRouter>
      </DashboardDataProvider>
    </ConsultantPhotosProvider>
  );
}
