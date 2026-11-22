import {
  AudioQuality,
  IOSOutputFormat,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  type RecordingOptions,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

export type PermisoMic = 'desconocido' | 'concedido' | 'denegado';

// Preset ligero para voz: mono, 16 kHz, ~32 kbps, AAC en .m4a
const PRESET_VOZ: RecordingOptions = {
  extension: '.m4a',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 32000,
  android: { outputFormat: 'mpeg4', audioEncoder: 'aac' },
  ios: { outputFormat: IOSOutputFormat.MPEG4AAC, audioQuality: AudioQuality.MEDIUM },
  web: { mimeType: 'audio/webm', bitsPerSecond: 32000 },
};

export function useGrabadora() {
  const grabadora = useAudioRecorder(PRESET_VOZ);
  const [permiso, setPermiso] = useState<PermisoMic>('desconocido');
  const [error, setError] = useState<string | null>(null);
  const activa = useRef(false); // hay una grabación empezada y sin detener

  // Pide permiso, prepara y empieza a grabar.
  // Devuelve 'ok', 'denegado' (sin permiso de micrófono) o 'error' (falló otra cosa).
  const iniciar = useCallback(async (): Promise<'ok' | 'denegado' | 'error'> => {
    try {
      setError(null);
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        setPermiso('denegado');
        return 'denegado';
      }
      setPermiso('concedido');
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await grabadora.prepareToRecordAsync();
      grabadora.record();
      activa.current = true;
      return 'ok';
    } catch {
      setError('No se pudo iniciar la grabación.');
      return 'error';
    }
  }, [grabadora]);

  const pausar = useCallback(() => {
    try {
      grabadora.pause();
    } catch {
      setError('No se pudo pausar la grabación.');
    }
  }, [grabadora]);

  const reanudar = useCallback(() => {
    try {
      grabadora.record();
    } catch {
      setError('No se pudo reanudar la grabación.');
    }
  }, [grabadora]);

  // Detiene y devuelve la uri del archivo, o null si falló
  const detener = useCallback(async (): Promise<string | null> => {
    try {
      await grabadora.stop();
      activa.current = false;
      const uri = grabadora.uri;
      if (!uri) {
        setError('No se encontró el archivo de audio.');
        return null;
      }
      return uri;
    } catch {
      setError('No se pudo detener la grabación.');
      return null;
    }
  }, [grabadora]);

  // Si la pantalla se cierra mientras graba (ej. "Salir"), detiene la grabadora
  useEffect(() => {
    return () => {
      if (activa.current) {
        activa.current = false;
        try {
          grabadora.stop().catch(() => {});
        } catch {
          // ya estaba liberada
        }
      }
    };
  }, [grabadora]);

  return { permiso, error, iniciar, pausar, reanudar, detener };
}
