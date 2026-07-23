import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardDataProvider } from "./context/DashboardDataContext.jsx";
import { DashboardLayout } from "./components/layout/DashboardLayout.jsx";
import { DEFAULT_TAB_ID } from "./theme/tabThemes.js";

// A aba ativa vive na URL (/:tabId), permitindo navegacao client-side tanto
// pelo carrossel automatico quanto por clique manual no TabNav.
export default function App() {
  return (
    <DashboardDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={`/${DEFAULT_TAB_ID}`} replace />} />
          <Route path="/:tabId" element={<DashboardLayout />} />
          <Route path="*" element={<Navigate to={`/${DEFAULT_TAB_ID}`} replace />} />
        </Routes>
      </BrowserRouter>
    </DashboardDataProvider>
  );
}
