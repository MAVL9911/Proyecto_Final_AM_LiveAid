import { transcribirAudio } from './api';
import { actualizarSesion } from './storage';

// Ids de sesiones que se están transcribiendo ahora mismo (evita transcribir dos veces).
// Vive fuera de los componentes, así sigue funcionando aunque la pantalla se cierre.
const enCurso = new Set<string>();

// Transcribe el audio de una sesión y guarda el resultado en el almacenamiento local.
// Nunca lanza error: si falla, deja la sesión en estado 'error' con el mensaje.
export async function transcribirSesion(id: string, audioUri: string): Promise<void> {
  if (enCurso.has(id)) return;
  enCurso.add(id);
  try {
    const { texto, segmentos } = await transcribirAudio(audioUri);
    await actualizarSesion(id, { transcripcion: texto, segmentos, estado: 'lista', errorMsg: undefined });
  } catch (e: any) {
    const errorMsg = e?.message || 'No se pudo transcribir el audio.';
    await actualizarSesion(id, { estado: 'error', errorMsg });
  } finally {
    enCurso.delete(id);
  }
}
