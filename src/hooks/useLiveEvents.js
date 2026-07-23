import { useEffect, useRef } from "react";
import { createEventSource } from "../api/client.js";

// Abre (e mantem viva) a conexao SSE de GET /events/?token=<jwt>, repassando
// cada mensagem ja decodificada para o callback informado. Em modo mock,
// createEventSource devolve um emissor com a mesma interface onmessage/close.
export function useLiveEvents(onEvent, { enabled = true } = {}) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return undefined;

    const source = createEventSource();
    source.onmessage = (message) => {
      try {
        const parsedEvent = JSON.parse(message.data);
        onEventRef.current(parsedEvent);
      } catch {
        // mensagem fora do contrato esperado — ignora silenciosamente
      }
    };

    return () => source.close();
  }, [enabled]);
}
