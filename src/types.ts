export type EstadoSesion = 'lista' | 'procesando' | 'error';

// Una frase de la transcripción con su tiempo (en segundos).
export type Segmento = { inicio: number; fin: number; texto: string };

export type Sesion = {
  id: string;
  materia: string;
  color: string;
  fechaISO: string; // fecha ISO, ej. "2026-11-21T10:00:00.000Z"
  duracionSeg: number;
  estado: EstadoSesion;
  marcadores: number[]; // segundos exactos del cronómetro
  transcripcion: string; // vacío hasta que termine la transcripción
  segmentos?: Segmento[]; // frases con tiempos (sesiones nuevas)
  audioUri?: string; // archivo .m4a grabado en el celular
  errorMsg?: string; // motivo del error cuando estado === 'error'
  resumen?: string;
  explicacion?: string;
  guia?: string;
  notas?: string;
};
