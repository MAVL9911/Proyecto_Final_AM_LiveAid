import { useCallback, useEffect, useRef, useState } from 'react';

// Cronómetro que calcula el tiempo con Date.now() (no suma de 1 en 1),
// así no se desfasa si la app pasa a segundo plano. Soporta pausar y reanudar.
export function useCronometro() {
  // ms acumulados de los tramos anteriores (antes de la última pausa)
  const acumuladoRef = useRef(0);
  // momento en que empezó el tramo actual (null = en pausa)
  const inicioRef = useRef<number | null>(Date.now());

  const [corriendo, setCorriendo] = useState(true);
  const [, setTick] = useState(0); // solo para volver a dibujar

  const msTotales = useCallback(() => {
    const tramo = inicioRef.current === null ? 0 : Date.now() - inicioRef.current;
    return acumuladoRef.current + tramo;
  }, []);

  // Segundos exactos en este instante (lo usa MARCAR)
  const obtenerSegundos = useCallback(() => Math.floor(msTotales() / 1000), [msTotales]);

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [corriendo]);

  const pausar = useCallback(() => {
    if (inicioRef.current === null) return;
    acumuladoRef.current += Date.now() - inicioRef.current;
    inicioRef.current = null;
    setCorriendo(false);
  }, []);

  const reanudar = useCallback(() => {
    if (inicioRef.current !== null) return;
    inicioRef.current = Date.now();
    setCorriendo(true);
  }, []);

  return {
    segundos: Math.floor(msTotales() / 1000),
    corriendo,
    pausar,
    reanudar,
    obtenerSegundos,
  };
}
