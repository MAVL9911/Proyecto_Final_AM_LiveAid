import { Segmento } from './types';

// La gente toca MARCAR después de oír lo importante, así que se busca
// la frase unos segundos antes del toque.
export const MARGEN_ATRAS_SEG = 4;

// Devuelve el índice del segmento que corresponde a un marcador, o -1 si no hay segmentos.
export function segmentoDeMarcador(segmentos: Segmento[], segundo: number): number {
  if (!segmentos || segmentos.length === 0) return -1;
  const t = Math.max(0, segundo - MARGEN_ATRAS_SEG);

  // Caso normal: t cae dentro de una frase.
  for (let i = 0; i < segmentos.length; i++) {
    if (segmentos[i].inicio <= t && t <= segmentos[i].fin) return i;
  }

  // t cae entre dos frases (o después de la última): la última frase que ya había empezado.
  let ultimo = 0; // si t es anterior a la primera, índice 0
  for (let i = 0; i < segmentos.length; i++) {
    if (segmentos[i].inicio <= t) ultimo = i;
  }
  return ultimo;
}
