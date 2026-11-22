export type EstadoSesion = 'lista' | 'procesando' | 'error';

export type Sesion = {
  id: string;
  materia: string;
  color: string;
  fechaISO: string; // fecha ISO, ej. "2026-11-21T10:00:00.000Z"
  duracionSeg: number;
  estado: EstadoSesion;
  marcadores: number[]; // segundos exactos del cronómetro
  transcripcion: string; // vacío hasta que termine la transcripción
  audioUri?: string; // archivo .m4a grabado en el celular
  errorMsg?: string; // motivo del error cuando estado === 'error'
  resumen?: string;
  notas?: string;
};
