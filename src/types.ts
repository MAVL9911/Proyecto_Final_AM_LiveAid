export type EstadoSesion = 'lista' | 'procesando';

export type Sesion = {
  id: string;
  materia: string;
  color: string;
  fecha: string; // fecha ISO, ej. "2026-11-21T10:00:00"
  duracionMin: number;
  estado: EstadoSesion;
  marcadores: number;
};
