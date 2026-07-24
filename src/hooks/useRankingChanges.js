import { useEffect, useRef, useState } from "react";

const CLASS_DURATION_MS = 1000;

// Compara o ranking atual (ja ordenado, com {id, value, contracts}) com o
// tick anterior e devolve, por consultor, a reacao ao vivo a exibir por
// ~1s: { changeClass: 'celebrating'|'rank-up'|'rank-down'|'data-updated',
// magnitude }. Precedencia por ciclo: celebrating > rank-down > rank-up >
// data-updated (um consultor so recebe uma classe por vez).
//
// O ciclo de vida da classe e controlado por setTimeout (nao por
// onAnimationEnd): assim, com `prefers-reduced-motion` a animacao correspondente
// e desligada via CSS mas a classe continua aplicada pelo mesmo ~1s, entao a
// cor estatica ainda comunica a mudanca sem depender de um evento de animacao
// que nunca dispara quando animation:none.
export function useRankingChanges(ranking) {
  const previousRef = useRef(new Map());
  const timersRef = useRef(new Map());
  const [changes, setChanges] = useState(new Map());

  useEffect(() => {
    const previous = previousRef.current;
    const nextSnapshot = new Map();

    if (previous.size === 0) {
      ranking.forEach((item, index) => {
        nextSnapshot.set(item.id, { position: index, value: item.value, contracts: item.contracts });
      });
      previousRef.current = nextSnapshot;
      return;
    }

    const nextChanges = new Map();

    ranking.forEach((item, index) => {
      const prev = previous.get(item.id);
      nextSnapshot.set(item.id, { position: index, value: item.value, contracts: item.contracts });
      if (!prev) return;

      const positionDelta = prev.position - index; // positivo = subiu N posicoes
      const valueChanged = prev.value !== item.value;
      const celebrated =
        item.contracts != null && prev.contracts != null && item.contracts > prev.contracts;

      if (celebrated) {
        nextChanges.set(item.id, { changeClass: "celebrating", magnitude: 0 });
      } else if (positionDelta < 0) {
        nextChanges.set(item.id, { changeClass: "rank-down", magnitude: Math.abs(positionDelta) });
      } else if (positionDelta > 0) {
        nextChanges.set(item.id, { changeClass: "rank-up", magnitude: positionDelta });
      } else if (valueChanged) {
        nextChanges.set(item.id, { changeClass: "data-updated", magnitude: 0 });
      }
    });

    previousRef.current = nextSnapshot;
    if (nextChanges.size === 0) return;

    setChanges((current) => {
      const merged = new Map(current);
      nextChanges.forEach((value, id) => merged.set(id, value));
      return merged;
    });

    nextChanges.forEach((_value, id) => {
      const existingTimer = timersRef.current.get(id);
      if (existingTimer) clearTimeout(existingTimer);
      const timer = setTimeout(() => {
        setChanges((current) => {
          if (!current.has(id)) return current;
          const next = new Map(current);
          next.delete(id);
          return next;
        });
        timersRef.current.delete(id);
      }, CLASS_DURATION_MS);
      timersRef.current.set(id, timer);
    });
  }, [ranking]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return changes;
}
