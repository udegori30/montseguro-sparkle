import { useEffect, useState } from "react";

// Relogio ao vivo usado no header (HH:MM:SS), atualizado a cada segundo.
export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}
