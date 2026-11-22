export type EstadoSesion = 'lista' | 'procesando';

export type Sesion = {
  id: string;
  materia: string;
  color: string;
  fechaISO: string; // fecha ISO, ej. "2026-11-21T10:00:00.000Z"
  duracionSeg: number;
  estado: EstadoSesion;
  marcadores: number[]; // segundos exactos del cronómetro
  transcripcion: string; // vacío por ahora
  resumen?: string;
  notas?: string;
};
