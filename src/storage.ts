import AsyncStorage from '@react-native-async-storage/async-storage';
import { Materia, Sesion } from './types';

// Una sola llave para todas las sesiones
const LLAVE = 'liveaid_sesiones';

// Lee todas las sesiones guardadas. Si falla o el JSON está dañado, devuelve [].
async function leerTodas(): Promise<Sesion[]> {
  try {
    const texto = await AsyncStorage.getItem(LLAVE);
    if (!texto) return [];
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? (datos as Sesion[]) : [];
  } catch {
    return [];
  }
}

// Devuelve true si se pudo guardar
async function escribirTodas(sesiones: Sesion[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(LLAVE, JSON.stringify(sesiones));
    return true;
  } catch {
    return false;
  }
}

// Más reciente primero
export async function listarSesiones(): Promise<Sesion[]> {
  const todas = await leerTodas();
  return todas.sort((a, b) => new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime());
}

export async function obtenerSesion(id: string): Promise<Sesion | null> {
  const todas = await leerTodas();
  return todas.find((s) => s.id === id) ?? null;
}

export async function guardarSesion(sesion: Sesion): Promise<boolean> {
  const todas = await leerTodas();
  return escribirTodas([...todas.filter((s) => s.id !== sesion.id), sesion]);
}

// Borra una sesión por id. Devuelve true si se pudo guardar el cambio
export async function eliminarSesion(id: string): Promise<boolean> {
  try {
    const todas = await leerTodas();
    return escribirTodas(todas.filter((s) => s.id !== id));
  } catch {
    return false;
  }
}

export async function actualizarSesion(id: string, cambios: Partial<Sesion>): Promise<boolean> {
  const todas = await leerTodas();
  const existe = todas.some((s) => s.id === id);
  if (!existe) return false;
  return escribirTodas(todas.map((s) => (s.id === id ? { ...s, ...cambios, id } : s)));
}

// ---------- Materias ----------
const LLAVE_MATERIAS = 'liveaid_materias';

async function leerMaterias(): Promise<Materia[]> {
  try {
    const texto = await AsyncStorage.getItem(LLAVE_MATERIAS);
    if (!texto) return [];
    const datos = JSON.parse(texto);
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (m: any) => m && typeof m.id === 'string' && typeof m.nombre === 'string' && typeof m.color === 'string'
    ) as Materia[];
  } catch {
    return [];
  }
}

async function escribirMaterias(materias: Materia[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(LLAVE_MATERIAS, JSON.stringify(materias));
    return true;
  } catch {
    return false;
  }
}

// Minúsculas y sin acentos, para comparar nombres
function normalizar(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export async function listarMaterias(): Promise<Materia[]> {
  return leerMaterias();
}

// Candado simple para evitar dobles ejecuciones al escribir materias
let ocupadoMaterias = false;

export async function crearMateria(
  nombre: string,
  color: string
): Promise<{ ok: true; materia: Materia } | { ok: false; error: string }> {
  if (ocupadoMaterias) return { ok: false, error: 'Espera un momento e intenta de nuevo.' };
  ocupadoMaterias = true;
  try {
    const limpio = (nombre ?? '').trim();
    if (limpio.length < 1) return { ok: false, error: 'Escribe el nombre de la materia.' };
    if (limpio.length > 40) return { ok: false, error: 'El nombre puede tener máximo 40 caracteres.' };

    const materias = await leerMaterias();
    if (materias.some((m) => normalizar(m.nombre) === normalizar(limpio))) {
      return { ok: false, error: 'Ya existe una materia con ese nombre.' };
    }

    const materia: Materia = { id: Date.now().toString(), nombre: limpio, color };
    const guardada = await escribirMaterias([...materias, materia]);
    if (!guardada) return { ok: false, error: 'No se pudo guardar la materia. Intenta de nuevo.' };
    return { ok: true, materia };
  } catch {
    return { ok: false, error: 'No se pudo crear la materia. Intenta de nuevo.' };
  } finally {
    ocupadoMaterias = false;
  }
}

// Sesiones de una materia: por materiaId o, si la sesión no lo tiene, por nombre
export function sesionesDeMateria(sesiones: Sesion[], materia: Materia): Sesion[] {
  return sesiones.filter((s) =>
    s.materiaId ? s.materiaId === materia.id : normalizarMayus(s.materia) === normalizarMayus(materia.nombre)
  );
}

// Para sesiones sin materiaId: igual ignorando mayúsculas
function normalizarMayus(texto: string): string {
  return (texto ?? '').trim().toLowerCase();
}

export async function eliminarMateria(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (ocupadoMaterias) return { ok: false, error: 'Espera un momento e intenta de nuevo.' };
  ocupadoMaterias = true;
  try {
    const materias = await leerMaterias();
    const materia = materias.find((m) => m.id === id);
    if (!materia) return { ok: false, error: 'La materia ya no existe.' };

    const cantidad = sesionesDeMateria(await leerTodas(), materia).length;
    if (cantidad > 0) {
      return {
        ok: false,
        error: `Tiene ${cantidad} ${cantidad === 1 ? 'sesión' : 'sesiones'}; elimínalas primero`,
      };
    }

    const guardada = await escribirMaterias(materias.filter((m) => m.id !== id));
    if (!guardada) return { ok: false, error: 'No se pudo eliminar la materia. Intenta de nuevo.' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'No se pudo eliminar la materia. Intenta de nuevo.' };
  } finally {
    ocupadoMaterias = false;
  }
}
