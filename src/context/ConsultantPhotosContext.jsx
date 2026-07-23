import { createContext, useCallback, useContext, useState } from "react";

const STORAGE_KEY = "montseguro:consultant-photos";
const ConsultantPhotosContext = createContext(null);

function loadStoredPhotos() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistPhotos(photos) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch {
    // localStorage indisponivel (modo privado/quota) - segue sem persistir
  }
}

// Guarda as fotos anexadas por consultor (localStorage, sem endpoint de API
// ainda) e as compartilha entre todas as abas via contexto, para que uma
// foto adicionada em uma tela (ex.: podio) reflita nas demais (ranking, tabela).
export function ConsultantPhotosProvider({ children }) {
  const [photos, setPhotos] = useState(() => loadStoredPhotos());

  const setPhoto = useCallback((consultantId, dataUrl) => {
    setPhotos((prev) => {
      const next = { ...prev, [consultantId]: dataUrl };
      persistPhotos(next);
      return next;
    });
  }, []);

  const removePhoto = useCallback((consultantId) => {
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[consultantId];
      persistPhotos(next);
      return next;
    });
  }, []);

  return (
    <ConsultantPhotosContext.Provider value={{ photos, setPhoto, removePhoto }}>
      {children}
    </ConsultantPhotosContext.Provider>
  );
}

export function useConsultantPhotos() {
  const context = useContext(ConsultantPhotosContext);
  if (!context) {
    throw new Error("useConsultantPhotos deve ser usado dentro de <ConsultantPhotosProvider>");
  }
  return context;
}
