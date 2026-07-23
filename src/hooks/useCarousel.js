import { useCallback, useEffect, useRef, useState } from "react";

// Controla o avanco automatico do carrossel de abas: progresso 0-100 em
// funcao do tempo decorrido, pausa/retomada e reset ao trocar de aba
// (seja por avanco automatico ou navegacao manual).
export function useCarousel({ tabIds, activeId, intervalMs, onAdvance }) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startRef = useRef(Date.now());
  const elapsedAtPauseRef = useRef(0);

  const reset = useCallback(() => {
    startRef.current = Date.now();
    elapsedAtPauseRef.current = 0;
    setProgress(0);
  }, []);

  // Qualquer troca de aba (automatica ou manual) reinicia o cronometro.
  useEffect(() => {
    reset();
  }, [activeId, reset]);

  useEffect(() => {
    if (isPaused) return undefined;

    const id = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / intervalMs) * 100);
      setProgress(pct);

      if (pct >= 100) {
        const currentIndex = tabIds.indexOf(activeId);
        const nextId = tabIds[(currentIndex + 1) % tabIds.length];
        onAdvance(nextId);
      }
    }, 100);

    return () => clearInterval(id);
  }, [isPaused, activeId, intervalMs, tabIds, onAdvance]);

  const togglePause = useCallback(() => {
    setIsPaused((prevPaused) => {
      const nextPaused = !prevPaused;
      if (nextPaused) {
        elapsedAtPauseRef.current = Date.now() - startRef.current;
      } else {
        startRef.current = Date.now() - elapsedAtPauseRef.current;
      }
      return nextPaused;
    });
  }, []);

  return { progress, isPaused, togglePause, reset };
}
