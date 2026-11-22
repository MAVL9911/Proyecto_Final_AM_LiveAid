import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sesion } from './types';

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
