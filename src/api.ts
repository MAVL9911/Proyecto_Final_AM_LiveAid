import { API_URL } from './config';

const TIMEOUT_MS = 60000;

// Diagnóstico: imprime SOLO datos técnicos, nunca el audio ni textos de transcripción.
function registrarError(error: any, uri: string, estado?: number) {
  console.warn('[transcribirAudio]', {
    nombre: error?.name,
    mensaje: error?.message,
    codigoHttp: estado ?? 'sin respuesta',
    url: API_URL,
    uri: String(uri ?? '').slice(0, 10),
  });
}

// Envía el audio con XMLHttpRequest. El fetch de Expo no acepta archivos
// en formato { uri, name, type }, pero XMLHttpRequest sí.
function enviarAudio(uri: string): Promise<{ estado: number; cuerpo: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/transcribir`);
    xhr.timeout = TIMEOUT_MS;
    xhr.onload = () => resolve({ estado: xhr.status, cuerpo: xhr.responseText });
    xhr.onerror = () => reject(new Error('RED'));
    xhr.ontimeout = () => reject(new Error('TIEMPO'));

    const formulario = new FormData();
    formulario.append('audio', { uri, name: 'trozo.m4a', type: 'audio/m4a' } as any);
    xhr.send(formulario);
  });
}

// Manda el audio al backend y devuelve el texto transcrito.
// Si algo falla lanza un Error con un mensaje en español listo para mostrar.
export async function transcribirAudio(uri: string): Promise<string> {
  // Caso: archivo de audio no encontrado o ilegible (solo se leen los encabezados).
  try {
    if (!uri) throw new Error('uri vacía');
    await fetch(uri);
  } catch (e: any) {
    registrarError(e, uri);
    throw new Error('No se encontró el archivo de audio o no se puede leer. Graba de nuevo.');
  }

  let resultado: { estado: number; cuerpo: string };
  try {
    resultado = await enviarAudio(uri);
  } catch (e: any) {
    registrarError(e, uri);
    if (e?.message === 'TIEMPO') {
      throw new Error('Tiempo agotado: el servidor tardó demasiado en responder. Intenta de nuevo.');
    }
    if (e?.message === 'RED') {
      throw new Error('Sin respuesta del servidor. Revisa tu internet e intenta de nuevo.');
    }
    throw new Error('No se pudo preparar el envío del audio. Graba de nuevo.');
  }

  let datos: any = null;
  try {
    datos = JSON.parse(resultado.cuerpo);
  } catch {
    datos = null;
  }

  // Caso: error HTTP del servidor
  if (resultado.estado < 200 || resultado.estado >= 300) {
    const detalle = typeof datos?.error === 'string' ? datos.error : 'El servidor respondió con un error.';
    registrarError(new Error(detalle), uri, resultado.estado);
    throw new Error(`Error del servidor (${resultado.estado}): ${detalle}`);
  }

  if (typeof datos?.texto !== 'string') {
    registrarError(new Error('Respuesta sin campo "texto"'), uri, resultado.estado);
    throw new Error('El servidor devolvió una respuesta inesperada.');
  }
  return datos.texto;
}