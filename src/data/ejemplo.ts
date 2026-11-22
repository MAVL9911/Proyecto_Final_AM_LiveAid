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
    fecha: hace(0, 8),
    duracionMin: 90,
    estado: 'procesando',
    marcadores: 4,
  },
  {
    id: '2',
    materia: 'Programación Orientada a Objetos',
    color: coloresMateria[1],
    fecha: hace(1, 10),
    duracionMin: 75,
    estado: 'lista',
    marcadores: 6,
  },
  {
    id: '3',
    materia: 'Interacción Humano-Computadora',
    color: coloresMateria[2],
    fecha: hace(2, 12),
    duracionMin: 60,
    estado: 'lista',
    marcadores: 2,
  },
];
