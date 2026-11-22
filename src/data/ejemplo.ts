import { coloresMateria } from '../theme';
import { Sesion } from '../types';

// Devuelve una fecha de hace "dias" días a las 'hora' horas
function hace(dias: number, hora: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, 0, 0, 0);
  return d.toISOString();
}

export const sesionesEjemplo: Sesion[] = [
  {
    id: '1',
    materia: 'Cálculo Diferencial e Integral',
    color: coloresMateria[0],
    fechaISO: hace(0, 8),
    duracionSeg: 5400,
    estado: 'procesando',
    marcadores: [30, 60, 90, 120],
    transcripcion: '',
  },
  {
    id: '2',
    materia: 'Programación Orientada a Objetos',
    color: coloresMateria[1],
    fechaISO: hace(1, 10),
    duracionSeg: 4500,
    estado: 'lista',
    marcadores: [30, 60, 90, 120, 150, 180],
    transcripcion: '',
  },
  {
    id: '3',
    materia: 'Interacción Humano-Computadora',
    color: coloresMateria[2],
    fechaISO: hace(2, 12),
    duracionSeg: 3600,
    estado: 'lista',
    marcadores: [30, 60],
    transcripcion: '',
  },
];
